import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { RegisterForm } from '../components/forms/RegisterForm';

export function RegisterPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">{t('register.title')}</h1>
          <p className="text-center text-muted mb-8">
            {t('register.subtitle')}
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
              {t('register.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
