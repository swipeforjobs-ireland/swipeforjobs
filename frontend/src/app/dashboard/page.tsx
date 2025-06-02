'use client';

import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user?.firstName || user?.email}!
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            This is where you'll manage your job applications.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Applications Today</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Total Applications</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Interviews</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}