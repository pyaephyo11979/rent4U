import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-muted max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-8">
          <Button>Go Home</Button>
        </Link>
      </div>
    </Layout>
  );
}
