import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Calendar, MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/reports/my');
        if (data.success) {
          setReports(data.reports);
          setFilteredReports(data.reports);
        }
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Failed to fetch your reports', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  // Run filtering logic whenever search or filters update
  useEffect(() => {
    let result = reports;

    if (search.trim() !== '') {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.location.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (severityFilter !== 'All') {
      result = result.filter((r) => r.severity === severityFilter);
    }

    setFilteredReports(result);
  }, [search, statusFilter, severityFilter, reports]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border border-rose-200/30 dark:border-rose-900/30 uppercase tracking-wide">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/30 dark:border-amber-900/30 uppercase tracking-wide">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-900/30 uppercase tracking-wide">
            Low
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-950 min-h-[calc(100vh-73px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950/40">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Incident Reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
            Browse and track the resolution progress of your safety filings.
          </p>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-40 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="block w-full sm:w-40 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-300 dark:text-slate-700 mx-auto" />
          <h4 className="font-extrabold text-gray-900 dark:text-white">No reports found</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
            We couldn't find any reports matching your current filter choices or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700 transition-all group"
            >
              <div className="space-y-3">
                {/* Header: Title and Severity */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-extrabold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {report.title}
                  </h4>
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    {getSeverityBadge(report.severity)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
                  {report.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-50 dark:border-slate-800/40 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{report.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Status footer badge */}
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800/50 flex justify-end">
                {getStatusBadge(report.status)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyReports;
