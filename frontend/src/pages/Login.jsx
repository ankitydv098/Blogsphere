import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome to BlogSphere!');
      navigate(from, { replace: true });
    } else {
      setApiError(result.error || 'Login failed.');
      toast.error(result.error || 'Login failed.');
      setIsLoading(false);
    }
  };

  // Demo quick login — single user (Ankit Kumar)
  const handleDemoLogin = () => {
    setValue('email', 'ankit@blogsphere.com');
    setValue('password', 'password123');
    onSubmit({ email: 'ankit@blogsphere.com', password: 'password123' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to publish articles, bookmark posts, and manage your portfolio.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">

          {/* Demo Quick Login */}
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/70 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Portfolio Demo</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="avatar-initials h-7 w-7 rounded-lg text-[10px] flex-shrink-0">AK</div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ankit Kumar</p>
                  <p className="text-[10px] text-slate-400">Java Backend Developer · Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all">
                <Zap className="h-3 w-3" /> Quick Login
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {apiError && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="ankit@blogsphere.com"
                  {...register('email', { required: true })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 pl-4 pr-10 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Mail className="absolute right-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 pl-4 pr-10 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-2.5 rounded-full font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-md shadow-indigo-500/20"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          No account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create one for free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
