import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MapView from '../components/MapView';
import { Shield, AlertTriangle, CheckCircle, Clock, PlusCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, apiFetch } = useAuth();
  const { alerts } = useSocket();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Admins fetch all, users fetch their own
        const endpoint = user.role === 'admin' ? '/reports' : '/reports/my';
        const data = await apiFetch(endpoint);
        
        if (data.success) {
          setReports(data.reports);
          calculateStats(data.reports);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const calculateStats = (data) => {
    const s = {
      total: data.length,
      pending: data.filter((r) => r.status === 'Pending').length,
      inProgress: data.filter((r) => r.status === 'In Progress').length,
      resolved: data.filter((r) => r.status === 'Resolved').length,
      high: data.filter((r) => r.severity === 'High').length,
      medium: data.filter((r) => r.severity === 'Medium').length,
      low: data.filter((r) => r.severity === 'Low').length
    };
    setStats(s);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-950 min-h-[calc(100vh-73px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Admin Custom SVG Donut Chart Calculation
  const totalSeverity = stats.high + stats.medium + stats.low || 1;
  const highPercent = (stats.high / totalSeverity) * 100;
  const mediumPercent = (stats.medium / totalSeverity) * 100;
  const lowPercent = (stats.low / totalSeverity) * 100;

  // Donut Arc Mathematics
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const highStroke = (highPercent / 100) * circumference;
  const mediumStroke = (mediumPercent / 100) * circumference;
  const lowStroke = (lowPercent / 100) * circumference;

  const highOffset = circumference;
  const mediumOffset = circumference - highStroke;
  const lowOffset = circumference - highStroke - mediumStroke;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950/40">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 text-white shadow-xl shadow-brand-500/10">
        <div className="max-w-xl space-y-2">
          <h3 className="text-2xl font-extrabold">Welcome back, {user?.name}!</h3>
          <p className="text-brand-100 text-sm font-medium">
            {user?.role === 'admin'
              ? 'Safety center admin interface active. You have full access to manage reports, update statuses, and export metrics.'
              : 'CrowdShield is monitoring your area. Report suspicious incidents, view personal submissions, or check live alerts below.'}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Total Reports' : 'My Reports'}
            </p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.total}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.pending}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">In Progress</p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.inProgress}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">High Severity</p>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.high}</h4>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Map View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-gray-900 dark:text-white">Incident Mapping</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {user?.role === 'admin' ? 'Geographic plotting of all system reports' : 'Locations of your submitted incidents'}
                </p>
              </div>
              {user?.role !== 'admin' && (
                <Link
                  to="/report"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-md shadow-brand-500/10"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Incident
                </Link>
              )}
            </div>
            
            <div className="h-[380px] w-full rounded-xl overflow-hidden">
              <MapView reports={reports} />
            </div>
          </div>
        </div>

        {/* Right: Charts or Alerts Feed depending on user role */}
        <div className="space-y-6">
          
          {user?.role === 'admin' ? (
            /* Admin Panel Analytics Widgets */
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h4 className="font-extrabold text-gray-900 dark:text-white">Severity Distribution</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Severity analytics breakdown</p>
              </div>

              {stats.total > 0 ? (
                <div className="flex flex-col items-center justify-center gap-6">
                  {/* Custom SVG Donut Chart */}
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                      {/* Base Circle */}
                      <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-800" />
                      
                      {/* Low Arc */}
                      {stats.low > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray={`${lowStroke} ${circumference}`}
                          strokeDashoffset={lowOffset}
                          strokeLinecap="round"
                        />
                      )}

                      {/* Medium Arc */}
                      {stats.medium > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray={`${mediumStroke} ${circumference}`}
                          strokeDashoffset={mediumOffset}
                          strokeLinecap="round"
                        />
                      )}

                      {/* High Arc */}
                      {stats.high > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${highStroke} ${circumference}`}
                          strokeDashoffset={highOffset}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.total}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reports</span>
                    </div>
                  </div>

                  {/* Legends */}
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-gray-600 dark:text-gray-400">High Severity</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">{stats.high} ({Math.round(highPercent)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-gray-600 dark:text-gray-400">Medium Severity</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">{stats.medium} ({Math.round(mediumPercent)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-gray-600 dark:text-gray-400">Low Severity</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">{stats.low} ({Math.round(lowPercent)}%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-gray-500 gap-2">
                  <HelpCircle className="w-8 h-8" />
                  <span className="text-xs font-medium">No analytical data available yet</span>
                </div>
              )}
            </div>
          ) : (
            /* User Panel Active Alerts Feed */
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 dark:text-white">Realtime Broadcasts</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live hazard feeds from Socket.io</p>
                </div>
                {alerts.length > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-gray-200 dark:border-slate-800 text-center text-gray-400 dark:text-gray-500 space-y-2">
                    <Clock className="w-6 h-6 mx-auto text-gray-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">No live alerts pushed. System is secure.</p>
                  </div>
                ) : (
                  alerts.slice(0, 5).map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        alert.severity === 'High'
                          ? 'bg-rose-50/50 border-rose-100 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30'
                          : alert.severity === 'Medium'
                          ? 'bg-amber-50/50 border-amber-100 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30'
                          : 'bg-blue-50/50 border-blue-100 text-blue-800 dark:bg-blue-950/10 dark:border-blue-900/30'
                      }`}
                    >
                      <div className="mt-0.5">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{alert.title}</p>
                        <p className="text-[10px] font-medium opacity-80 mt-0.5 truncate">{alert.locationName}</p>
                        <span className="text-[9px] font-semibold opacity-60 block mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick tips panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">Emergency Guide</h4>
            <div className="space-y-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Submit incident descriptions clearly, providing specific location context.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Keep live browser tabs open to receive real-time danger notifications.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
