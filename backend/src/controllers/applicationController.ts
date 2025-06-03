import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { ApiResponse } from '../types';

const prisma = new PrismaClient();

// Validation schemas
const createApplicationSchema = z.object({
  jobId: z.string(),
  action: z.enum(['apply', 'reject']),
  jobData: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    salary: z.string(),
    type: z.string(),
    description: z.string(),
    requirements: z.array(z.string()),
    benefits: z.array(z.string()),
    companyLogo: z.string()
  })
});

export class ApplicationController {
  // Save swipe action (apply or reject)
  static async createApplication(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const validatedData = createApplicationSchema.parse(req.body);
      const { jobId, action, jobData } = validatedData;

      // First, create or update the job in our database
      const job = await prisma.job.upsert({
        where: {
          sourceBoard_externalId: {
            sourceBoard: 'mock',
            externalId: jobId
          }
        },
        update: {
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          salaryRange: jobData.salary,
          employmentType: jobData.type === 'Full-time' ? 'FULL_TIME' : 'PART_TIME',
          updatedAt: new Date()
        },
        create: {
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          requirements: jobData.requirements.join('\n'),
          salaryRange: jobData.salary,
          employmentType: jobData.type === 'Full-time' ? 'FULL_TIME' : 'PART_TIME',
          sourceBoard: 'mock',
          externalId: jobId,
          url: '#',
          isActive: true
        }
      });

      // Only create application record if user swiped right (apply)
      if (action === 'apply') {
        // Check if user already applied to this job
        const existingApplication = await prisma.jobApplication.findFirst({
          where: {
            userId,
            jobId: job.id
          }
        });

        if (existingApplication) {
          return res.status(400).json({
            success: false,
            error: 'Already applied to this job',
            timestamp: new Date().toISOString()
          } as ApiResponse);
        }

        // Create a basic CV record if user doesn't have one
        let userCV = await prisma.cV.findFirst({
          where: { userId }
        });

        if (!userCV) {
          userCV = await prisma.cV.create({
            data: {
              userId,
              originalText: 'Basic CV - needs upload',
              skills: [],
              experienceYears: 0
            }
          });
        }

        // Create the job application
        const application = await prisma.jobApplication.create({
          data: {
            userId,
            jobId: job.id,
            cvId: userCV.id,
            status: 'SENT',
            appliedAt: new Date()
          },
          include: {
            job: true
          }
        });

        res.status(201).json({
          success: true,
          data: application,
          message: 'Application created successfully',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      } else {
        // For rejections, we just acknowledge without saving
        res.json({
          success: true,
          message: 'Job rejected',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

    } catch (error: any) {
      console.error('Create application error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: error.errors[0].message,
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create application',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }

  // Get user's applications
  static async getUserApplications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { status } = req.query;

      const whereClause: any = { userId };
      if (status && status !== 'ALL') {
        whereClause.status = status;
      }

      const applications = await prisma.jobApplication.findMany({
        where: whereClause,
        include: {
          job: true,
          responses: true
        },
        orderBy: {
          appliedAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: applications,
        timestamp: new Date().toISOString()
      } as ApiResponse);

    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch applications',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }

  // Get application statistics
  static async getApplicationStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const stats = await prisma.jobApplication.groupBy({
        by: ['status'],
        where: { userId },
        _count: {
          status: true
        }
      });

      const formattedStats = {
        total: stats.reduce((sum, stat) => sum + stat._count.status, 0),
        pending: stats.filter(s => ['SENT', 'VIEWED'].includes(s.status))
                     .reduce((sum, stat) => sum + stat._count.status, 0),
        interviews: stats.find(s => s.status === 'INTERVIEW_SCHEDULED')?._count.status || 0,
        rejected: stats.find(s => s.status === 'REJECTED')?._count.status || 0,
      };

      res.json({
        success: true,
        data: formattedStats,
        timestamp: new Date().toISOString()
      } as ApiResponse);

    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }
}