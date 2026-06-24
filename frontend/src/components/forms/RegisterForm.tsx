import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RegisterForm() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('registerForm.error');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-danger">
          {error}
        </div>
      )}
      <Input
        label={t('registerForm.fullName')}
        name="name"
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder={t('registerForm.namePlaceholder')}
        required
      />
      <Input
        label={t('registerForm.username')}
        name="username"
        value={form.username}
        onChange={(e) => updateField('username', e.target.value)}
        placeholder={t('registerForm.usernamePlaceholder')}
        required
      />
      <Input
        label={t('registerForm.email')}
        type="email"
        name="email"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder={t('registerForm.emailPlaceholder')}
        required
      />
      <Input
        label={t('registerForm.password')}
        type="password"
        name="password"
        value={form.password}
        onChange={(e) => updateField('password', e.target.value)}
        placeholder={t('registerForm.passwordPlaceholder')}
        required
        minLength={8}
      />
      <Button type="submit" loading={loading} className="w-full">
        {t('registerForm.submit')}
      </Button>
    </form>
  );
}
