// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
  }
  
  // User Types
  export interface CreateUserRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      subscriptionTier: string;
    };
    token: string;
  }
  
  // Job Types
  export interface JobSearchFilters {
    location?: string;
    keywords?: string;
    salaryMin?: number;
    salaryMax?: number;
    company?: string;
  }
  
  // CV Types
  export interface CVUploadRequest {
    file: Express.Multer.File;
    userId: string;
  }
  
  export interface ParsedCVData {
    skills: string[];
    experience: string[];
    education: string[];
    contactInfo: {
      email?: string;
      phone?: string;
      location?: string;
    };
    summary?: string;
  }