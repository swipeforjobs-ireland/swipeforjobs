'use client';

import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, XCircle, Calendar, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'INTERVIEW_SCHEDULED': return 'text-purple-600 bg-purple-50';
    case 'VIEWED': return 'text-blue-600 bg-blue-50';
    case 'SENT': return 'text-yellow-600 bg-yellow-50';
    case 'REJECTED': return 'text-red-600 bg-red-50';
    case 'OFFER_RECEIVED': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'INTERVIEW_SCHEDULED': return Calendar;
    case 'VIEWED': return Eye;
    case 'SENT': return Clock;
    case 'REJECTED': return XCircle;
    case 'OFFER_RECEIVED': return CheckCircle;
    default: return Clock;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'INTERVIEW_SCHEDULED': return 'Interview Scheduled';
    case 'VIEWED': return 'Viewed by Employer';
    case 'SENT': return 'Application Sent';
    case 'REJECTED': return 'Not Selected';
    case 'OFFER_RECEIVED': return 'Offer Received';
    default: return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ApplicationsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviews: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch real applications data
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch applications
        const appsResponse = await api.get('/api/v1/applications');
        const statsResponse = await api.get('/api/v1/applications/stats');
        
        if (appsResponse.data.success) {
          setApplications(appsResponse.data.data);
        }
        
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Application History</h1>
            <p className="text-gray-600">Track your job application progress</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.interviews}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200">
            {['ALL', 'SENT', 'VIEWED', 'INTERVIEW_SCHEDULED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  filter === status
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status === 'ALL' ? 'All Applications' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📭</div>
              <p className="text-gray-600">No applications found</p>
              <p className="text-sm text-gray-500 mt-2">
                {filter === 'ALL' ? 'Start swiping to see your applications here' : `No applications with status: ${getStatusText(filter)}`}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => {
              const StatusIcon = getStatusIcon(application.status);
              return (
                <div key={application.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={application.job?.company ? `https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=${application.job.company.charAt(0)}` : 'https://via.placeholder.com/48x48/6B7280/FFFFFF?text=?'}
                        alt={application.job?.company || 'Company'}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{application.job?.title || 'Job Title'}</h3>
                        <p className="text-gray-600 font-medium">{application.job?.company || 'Company Name'}</p>
                        <p className="text-sm text-gray-500">{application.job?.location || 'Location'} • {application.job?.salaryRange || 'Salary not specified'}</p>
                        
                        {/* Status and Timeline */}
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {getStatusText(application.status)}
                            </span>
                            {application.matchingScore && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {application.matchingScore}% match
                              </span>
                            )}
                          </div>

                          {/* Timeline */}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Applied: {formatDate(application.appliedAt)}</div>
                            {application.viewedByEmployer && (
                              <div>Viewed: {formatDate(application.viewedByEmployer)}</div>
                            )}
                            {application.interviewDate && (
                              <div className="text-purple-600 font-medium">
                                Interview: {formatDateTime(application.interviewDate)}
                              </div>
                            )}
                            {application.responseDate && (
                              <div>Response: {formatDate(application.responseDate)}</div>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {application.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-700">{application.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/swipe"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Swiping
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}