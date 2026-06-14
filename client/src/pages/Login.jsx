import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      showToast('Logged in successfully', 'success');
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Left Column: Visual branding - visible on large screens */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-tr from-brand-900 via-brand-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide">CrowdShield</span>
        </div>

        <div className="space-y-6 relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Real-time Monitoring. <br />
            Enhanced Safety.
          </h2>
          <p className="text-brand-100 text-base leading-relaxed">
            Join CrowdShield to report safety incidents, track active crowd hazards, and receive instant, real-time alerts. Let's make our communities safer together.
          </p>
        </div>

        <div className="text-xs text-brand-300 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} CrowdShield Corp. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/5 dark:bg-brand-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            {/* Logo for mobile only */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Access your crowd monitoring safety dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm font-semibold text-rose-600 dark:text-rose-400">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:ring-brand-500/20 dark:focus:border-brand-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:ring-brand-500/20 dark:focus:border-brand-500 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-500/20 dark:shadow-brand-500/10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold transition-colors"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
