import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  X,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { alerts } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Report Incident', path: '/report', icon: ShieldAlert },
    { name: 'My Reports', path: '/my-reports', icon: FileText },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: alerts.length },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  // If user is Admin, add Admin Panel to navigation
  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const activeLinkStyle =
    'flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-600 text-white font-medium shadow-md shadow-brand-600/20 dark:shadow-brand-600/10 transition-all duration-200';
  const inactiveLinkStyle =
    'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-all duration-200';

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white leading-none">CrowdShield</h1>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase">Realtime Safety</span>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-4 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-500 text-white rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile footer & logout */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-100 to-indigo-100 dark:from-brand-950/50 dark:to-indigo-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-brand-200/50 dark:border-brand-900/50">
              {user ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user ? user.name : 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize font-medium">
                {user ? user.role : 'Guest'} Account
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-sm transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
