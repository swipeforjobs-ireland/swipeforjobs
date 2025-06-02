import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthUtils } from '../utils/auth';
import type { ApiResponse, CreateUserRequest, LoginRequest, AuthResponse } from '../types';

const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  // User signup
  static async signup(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = signupSchema.parse(req.body);
      const { email, password, firstName, lastName } = validatedData;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

      // Hash password
      const passwordHash = await AuthUtils.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          subscriptionTier: 'FREE'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          subscriptionTier: true,
          createdAt: true
        }
      });

      // Create user profile
      await prisma.userProfile.create({
        data: {
          userId: user.id
        }
      });

      // Generate token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        },
        message: 'Account created successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse<AuthResponse>);

    } catch (error: any) {
      console.error('Signup error:', error);
      
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
        error: 'Failed to create account',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
          subscriptionTier: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

      // Verify password
      const isValidPassword = await AuthUtils.verifyPassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

      // Generate token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier
      });

      // Return user data (without password hash)
      const { passwordHash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'Login successful',
        timestamp: new Date().toISOString()
      } as ApiResponse<AuthResponse>);

    } catch (error: any) {
      console.error('Login error:', error);
      
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
        error: 'Login failed',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          subscriptionTier: true,
          createdAt: true,
          profile: {
            select: {
              location: true,
              linkedinUrl: true,
              preferences: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      } as ApiResponse);

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { firstName, lastName, phone, location, linkedinUrl } = req.body;

      // Update user basic info
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone && { phone })
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          subscriptionTier: true
        }
      });

      // Update user profile
      await prisma.userProfile.update({
        where: { userId },
        data: {
          ...(location && { location }),
          ...(linkedinUrl && { linkedinUrl })
        }
      });

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    }
  }
}