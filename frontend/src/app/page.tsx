import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SwipeForJobs.ie
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ireland's first AI-powered job application automation platform
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Swipe right on jobs, let AI apply for you automatically!
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/signup"
                className="block w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 text-center font-medium"
              >
                Sign Up Free
              </Link>
              <Link 
                href="/login"
                className="block w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 text-center font-medium"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}