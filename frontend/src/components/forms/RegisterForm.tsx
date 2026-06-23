import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RegisterForm() {
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
        'Registration failed. Please try again.';
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
        label="Full Name"
        name="name"
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="John Doe"
        required
      />
      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={(e) => updateField('username', e.target.value)}
        placeholder="johndoe"
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={(e) => updateField('password', e.target.value)}
        placeholder="Min. 8 characters"
        required
        minLength={8}
      />
      <Button type="submit" loading={loading} className="w-full">
        Create account
      </Button>
    </form>
  );
}
