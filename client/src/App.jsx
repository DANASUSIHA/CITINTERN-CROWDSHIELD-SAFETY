import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page Views
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import MyReports from './pages/MyReports';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine navbar header title based on active path
  const getHeaderTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/report':
        return 'Report Safety Incident';
      case '/my-reports':
        return 'My Submissions';
      case '/alerts':
        return 'Realtime Activity Feed';
      case '/profile':
        return 'Profile Settings';
      case '/admin':
        return 'System Administration';
      default:
        return 'CrowdShield';
    }
  };

  // Public/Auth paths don't display dashboard layouts
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    // Redirect authenticated users trying to hit login/register back home
    if (user) {
      return <Navigate to="/" replace />;
    }
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Panel Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar Header */}
        <Navbar toggleSidebar={toggleSidebar} title={getHeaderTitle(location.pathname)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
