import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Shield, Save, Key } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Name and Email cannot be blank');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    try {
      setUpdating(true);
      await updateProfile({
        name,
        email,
        password: password || undefined,
      });

      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile');
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950/40">
      
      {/* Title */}
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
          Manage your account credentials and personal details.
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* User Role Banner (Non-editable) */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/20">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white capitalize">{user?.role} Account</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                Role-based privileges: {user?.role === 'admin' ? 'Full administrative access' : 'Standard incident reporting access'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800/60 pt-6 space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <Key className="w-4.5 h-4.5 text-gray-400" />
              Change Password
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
              Leave these fields empty if you do not wish to modify your current login password.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPass" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800/60">
            <button
              type="submit"
              disabled={updating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/20 dark:shadow-brand-500/10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm w-full sm:w-auto"
            >
              {updating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4.5 h-4.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Profile;
