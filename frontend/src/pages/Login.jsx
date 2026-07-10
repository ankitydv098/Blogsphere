import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect path after login (either previous page or home)
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    
    const result = await login(data);
    
    if (result.success) {
      toast.success('Welcome back to BlogSphere!');
      navigate(from, { replace: true });
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
            Welcome Back
          </h2>
          <p className="text-sm text-primary-500">
            Sign in to your BlogSphere account to write and interact.
          </p>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          
          <div className="space-y-4">
            
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
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
            Sign In
          </Button>

          {/* Registration link */}
          <div className="text-center text-sm text-primary-500">
            No account yet?{' '}
            <Link to="/register" className="font-bold text-primary-900 hover:underline">
              Create an account
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
