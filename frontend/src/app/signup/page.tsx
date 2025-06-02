import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}