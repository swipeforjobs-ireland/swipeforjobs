'use client';

import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Clock, Star, X, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Mock Irish job data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Ireland",
    location: "Dublin 2",
    salary: "€45,000 - €60,000",
    type: "Full-time",
    posted: "2 days ago",
    description: "Join our dynamic team building next-generation web applications. Experience with React, TypeScript, and modern CSS frameworks required.",
    requirements: ["3+ years React experience", "TypeScript proficiency", "Modern CSS (Tailwind/Styled Components)", "Git & CI/CD knowledge"],
    benefits: ["Remote work option", "Health insurance", "Annual bonus", "Learning budget €2,000"],
    companyLogo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=TC"
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Dublin Marketing Hub",
    location: "Dublin 4",
    salary: "€50,000 - €65,000",
    type: "Full-time",
    posted: "1 day ago",
    description: "Lead marketing campaigns for exciting Irish startups. Looking for creative thinker with digital marketing expertise.",
    requirements: ["5+ years marketing experience", "Digital campaign management", "Analytics & data-driven approach", "Team leadership"],
    benefits: ["Flexible hours", "Company car", "Pension scheme", "Professional development"],
    companyLogo: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=DMH"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "FinTech Solutions IE",
    location: "Cork",
    salary: "€55,000 - €75,000",
    type: "Full-time",
    posted: "3 days ago",
    description: "Analyze financial data to drive business insights. Work with machine learning models and big data technologies.",
    requirements: ["Python/R proficiency", "Machine learning experience", "SQL & databases", "Statistics background"],
    benefits: ["Stock options", "Relocation package", "Conference attendance", "Flexible working"],
    companyLogo: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=FTS"
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Creative Agency Dublin",
    location: "Dublin 1",
    salary: "€40,000 - €55,000",
    type: "Full-time",
    posted: "1 week ago",
    description: "Design beautiful user experiences for web and mobile applications. Collaborate with developers and product managers.",
    requirements: ["Figma/Sketch expertise", "User research experience", "Prototyping skills", "Portfolio required"],
    benefits: ["Creative workspace", "Design tools budget", "Team outings", "Work from home Fridays"],
    companyLogo: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=CAD"
  },
  {
    id: 5,
    title: "Software Engineer",
    company: "Irish Tech Giants",
    location: "Galway",
    salary: "€60,000 - €80,000",
    type: "Full-time",
    posted: "4 days ago",
    description: "Build scalable backend systems for millions of users. Work with microservices, cloud infrastructure, and modern development practices.",
    requirements: ["Java/Python/Go experience", "Cloud platforms (AWS/Azure)", "Microservices architecture", "API design"],
    benefits: ["Top-tier salary", "Equity package", "25 days holidays", "Gym membership"],
    companyLogo: "https://via.placeholder.com/60x60/EF4444/FFFFFF?text=ITG"
  }
];

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  companyLogo: string;
}

const JobCard: React.FC<{
  job: Job;
  onSwipe: (direction: 'left' | 'right') => void;
  isTopCard: boolean;
}> = ({ job, onSwipe, isTopCard }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const [showDetails, setShowDetails] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className={`absolute w-full h-full ${isTopCard ? 'z-20' : 'z-10'}`}
      style={{ x, rotate, opacity }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: isTopCard ? 1 : 0.95, y: isTopCard ? 0 : 20 }}
      animate={{ scale: isTopCard ? 1 : 0.95, y: isTopCard ? 0 : 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
                <p className="text-gray-600 font-medium">{job.company}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{job.salary}</div>
              <div className="text-sm text-gray-500">{job.type}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{job.posted}</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Show more details →
            </button>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                ← Show less
              </button>
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12 pointer-events-none"
          style={{
            opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]),
            scale: useTransform(x, [-100, -50, 0], [1, 0.8, 0.5])
          }}
        >
          NOPE
        </motion.div>

        <motion.div
          className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold transform rotate-12 pointer-events-none"
          style={{
            opacity: useTransform(x, [0, 50, 100], [0, 0.5, 1]),
            scale: useTransform(x, [0, 50, 100], [0.5, 0.8, 1])
          }}
        >
          APPLY
        </motion.div>
      </div>
    </motion.div>
  );
};

const SwipeJobsInterface: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [applications, setApplications] = useState(0);
  const [rejections, setRejections] = useState(0);
  
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return;

    try {
      // Save the swipe action to database
      await api.post('/api/v1/applications', {
        jobId: currentJob.id.toString(),
        action: direction === 'right' ? 'apply' : 'reject',
        jobData: {
          title: currentJob.title,
          company: currentJob.company,
          location: currentJob.location,
          salary: currentJob.salary,
          type: currentJob.type,
          description: currentJob.description,
          requirements: currentJob.requirements,
          benefits: currentJob.benefits,
          companyLogo: currentJob.companyLogo
        }
      });

      // Update local stats
      if (direction === 'right') {
        setApplications(prev => prev + 1);
      } else {
        setRejections(prev => prev + 1);
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (error: any) {
      console.log('API response:', error.response?.data);
      
      // Handle "already applied" case gracefully
      if (error.response?.data?.error === 'Already applied to this job') {
        console.log('Already applied to this job, skipping...');
        // Still update UI but don't increment applied counter
        setCurrentIndex(prev => prev + 1);
        return;
      }
      
      console.error('Error saving application:', error);
      // Still update UI even if save fails
      if (direction === 'right') {
        setApplications(prev => prev + 1);
      } else {
        setRejections(prev => prev + 1);
      }
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < jobs.length) {
      handleSwipe(direction);
    }
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setApplications(0);
    setRejections(0);
  };

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">SwipeForJobs</h1>
            <p className="text-gray-600 text-sm">Swipe right to apply, left to skip</p>
          </div>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{applications}</div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{rejections}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
        </div>

        {/* Job Cards Stack */}
        <div className="relative h-[600px] mb-6">
          {currentIndex >= jobs.length ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All done!</h3>
                <p className="text-gray-600 mb-6">You've reviewed all available jobs</p>
                <div className="space-y-3">
                  <button
                    onClick={resetStack}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Review Again
                  </button>
                  <Link 
                    href="/dashboard"
                    className="block w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {nextJob && (
                <JobCard
                  key={nextJob.id}
                  job={nextJob}
                  onSwipe={handleSwipe}
                  isTopCard={false}
                />
              )}
              {currentJob && (
                <JobCard
                  key={currentJob.id}
                  job={currentJob}
                  onSwipe={handleSwipe}
                  isTopCard={true}
                />
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {currentIndex < jobs.length && (
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => handleButtonSwipe('left')}
              className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors hover:scale-105 transform"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={() => handleButtonSwipe('right')}
              className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors hover:scale-105 transform"
            >
              <Heart className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Drag cards left or right, or use the buttons below</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeJobsInterface;