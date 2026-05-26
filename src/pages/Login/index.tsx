import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { config } from '../../utils/config';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (config.app.enableMockData) {
      // Mock login for demo
      setIsLoading(true);
      setTimeout(() => {
        const mockUser = {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          role: email.includes('admin') ? 'admin' as const : 'customer' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('refresh_token', mockRefreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        toast.success('Login successful!');
        window.location.href = ROUTES.HOME;
        setIsLoading(false);
      }, 1000);
    } else {
      try {
        setIsLoading(true);
        await login({ email, password });
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {config.app.enableMockData && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Demo Mode:</strong> Use any email/password. Use email with 'admin' for admin access.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
