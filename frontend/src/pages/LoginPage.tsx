import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginForm } from '../components/forms/LoginForm';

export function LoginPage() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome back</h1>
          <p className="text-center text-muted mb-8">
            Log in to manage your bookings and listings.
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
