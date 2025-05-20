import React, { useState } from 'react';
import { Button } from '../atoms/ui/button';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

interface AuthFormProps {
  onSwitch?: (formType: 'login' | 'signup' | 'forgot' | 'reset') => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<AuthFormProps> = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response);
      toast.success('Login successful!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Login Now</h2>
        <p className="text-gray-500 mt-1">Welcome Back!</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <div className="mt-1 text-right">
            <button
              type="button"
              className="text-primary hover:underline text-sm"
              onClick={() => onSwitch && onSwitch('forgot')}
            >
              Forgot Password?
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login Now'}
        </Button>
      </form>
    </div>
  );
};

export const SignupForm: React.FC<AuthFormProps> = ({ onSwitch, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.signup(fullName, email, password);
      toast.success('Account created successfully!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Start your free trial</h2>
        <p className="text-gray-500 mt-1">No credit card required</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => onSwitch && onSwitch('login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordForm: React.FC<AuthFormProps> = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
      toast.success('Password reset instructions sent to your email');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the instructions to reset your password.
        </p>
        <Button
          type="button"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => onSwitch && onSwitch('login')}
        >
          Back to Login
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <p className="text-gray-500 mt-1">Enter your email to reset your password</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
        </Button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => onSwitch && onSwitch('login')}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}; 