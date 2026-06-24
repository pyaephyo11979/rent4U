import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function toggleLanguage() {
    i18n.changeLanguage(i18n.language === 'en' ? 'my' : 'en');
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            {t('common.brand')}
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              {t('nav.browse')}
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  {t('nav.dashboard')}
                </Link>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">{t('nav.signup')}</Button>
                </Link>
              </>
            )}

            <button
              onClick={toggleLanguage}
              className="rounded-lg border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {t(`language.${i18n.language === 'en' ? 'my' : 'en'}`)}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
