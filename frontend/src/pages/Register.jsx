import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerAuth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    
    const result = await registerAuth(data);
    
    if (result.success) {
      toast.success('Account created! Welcome to BlogSphere.');
      navigate('/');
    } else {
      setApiError(result.error);
      toast.error(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-primary-100 shadow-sm">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-primary-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-primary-500">
            Join the community to start writing, reading, and commenting.
          </p>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          
          <div className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Name cannot exceed 100 characters',
                    },
                  })}
                  className={`w-full bg-primary-50 border ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-primary-200 focus:ring-primary-900'
                  } rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1`}
                />
                <User className="absolute right-3.5 top-3 h-4.5 w-4.5 text-primary-400" />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 font-medium pl-2">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full bg-primary-50 border ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-primary-200 focus:ring-primary-900'
                  } rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1`}
                />
                <Mail className="absolute right-3.5 top-3 h-4.5 w-4.5 text-primary-400" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium pl-2">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full bg-primary-50 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-primary-200 focus:ring-primary-900'
                  } rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-primary-400 hover:text-primary-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium pl-2">{errors.password.message}</p>
              )}
            </div>

          </div>

          <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
            Get Started
          </Button>

          {/* Login link */}
          <div className="text-center text-sm text-primary-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-900 hover:underline">
              Sign In
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
