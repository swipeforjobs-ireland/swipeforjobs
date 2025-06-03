'use client';

import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Target, CheckCircle, Eye, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Ready to find your next opportunity?</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        {/* Quick Action Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start Swiping Jobs!</h2>
              <p className="text-blue-100 mb-4">
                Discover personalized job matches and apply with one swipe
              </p>
              <Link 
                href="/swipe"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <Target className="w-5 h-5" />
                <span>Browse Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-6xl opacity-20">
              🎯
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Applications Today</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Free tier: 5 applications per day
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Total Applications</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              All time applications sent
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Interviews</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">0</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Scheduled interviews
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Recent Activity</span>
            </h2>
            <Link
              href="/applications"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All Applications →
            </Link>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📭</div>
            <p className="text-gray-600">No applications yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start swiping to see your application history here
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subscription:</span>
              <span className="font-medium text-green-600">{user?.subscriptionTier || 'FREE'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Limit:</span>
              <span className="font-medium">5 applications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}