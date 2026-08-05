import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import PasswordInput from '../components/auth/PasswordInput';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!form.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/dashboard');
    } catch {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      headline="Plan smarter. Travel further."
      subtext="Join TripFlow AI and discover a new way to explore the world. Our conversational AI helps you build personalized multi-stop itineraries in minutes."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-1 text-2xl font-bold text-text-primary">Create your account</h2>
        <p className="mb-8 text-sm text-text-secondary">
          Start your AI-powered travel planning journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <Input
            label="Full name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            autoComplete="name"
            error={fieldErrors.name}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={fieldErrors.email}
          />

          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={fieldErrors.password}
          />

          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
          />

          <div>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-border text-accent-violet focus:ring-accent-violet/30"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="font-medium text-accent-violet hover:underline"
                  disabled
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-medium text-accent-violet hover:underline"
                  disabled
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {fieldErrors.acceptTerms && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.acceptTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting || isLoading}
          >
            Create account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-violet transition-colors hover:text-accent-violet-light"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
