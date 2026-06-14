import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Download, Trash2, Edit3, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const { apiFetch } = useAuth();
  const { showToast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/reports');
      if (data.success) {
        setReports(data.reports);
        setFilteredReports(data.reports);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to fetch reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports
  useEffect(() => {
    let result = reports;

    if (search.trim() !== '') {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()) ||
          r.location.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.userId && r.userId.name.toLowerCase().includes(search.toLowerCase()))
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

  // Update report status
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const data = await apiFetch(`/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (data.success) {
        showToast(`Report status updated to: ${newStatus}`, 'success');
        
        // Update local state
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this incident report? This action is permanent.')) {
      return;
    }

    try {
      const data = await apiFetch(`/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (data.success) {
        showToast('Report deleted successfully', 'success');
        
        // Update local state
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to delete report', 'error');
    }
  };

  // Client-side CSV Exporter
  const handleExportCSV = () => {
    if (reports.length === 0) {
      showToast('No reports available to export', 'warning');
      return;
    }

    const headers = [
      'ID',
      'Reporter Name',
      'Reporter Email',
      'Title',
      'Description',
      'Location Name',
      'Latitude',
      'Longitude',
      'Severity',
      'Status',
      'Reported At',
    ];

    const rows = reports.map((r) => [
      r._id,
      r.userId ? r.userId.name : 'Anonymous',
      r.userId ? r.userId.email : 'N/A',
      r.title.replace(/"/g, '""'),
      r.description.replace(/"/g, '""'),
      r.location.name.replace(/"/g, '""'),
      r.location.lat,
      r.location.lng,
      r.severity,
      r.status,
      r.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        headers.join(','),
        ...rows.map((row) => row.map((val) => `"${val}"`).join(',')),
      ].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `crowdshield_reports_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export started successfully', 'success');
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30';
      default:
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'In Progress':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-amber-600 dark:text-amber-400';
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
      
      {/* Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Management Panel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
            Review user reports, update hazard remediation status, and download records.
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/10 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </button>
      </div>

      {/* Filters Area */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports or reporters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-semibold"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-40 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
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
              className="block w-full sm:w-40 px-3 py-2 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

      </div>

      {/* Reports Table container */}
      <div className="rounded-2xl border border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-850/50 border-b border-gray-100 dark:border-slate-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Reporter</th>
                <th className="p-4">Incident Info</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status Update</th>
                <th className="p-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 dark:text-gray-500 font-medium">
                    No reports match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-850/30 transition-colors">
                    {/* Reporter */}
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-extrabold">{report.userId?.name || 'Anonymous'}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{report.userId?.email || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Incident Info */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-col space-y-1">
                        <span className="text-gray-900 dark:text-white font-extrabold">{report.title}</span>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                        <span className="text-[9px] text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4 max-w-[150px]">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-bold truncate">{report.location.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                          {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getSeverityStyle(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>

                    {/* Status Update Dropdown */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={report.status}
                          onChange={(e) => handleUpdateStatus(report._id, e.target.value)}
                          className={`px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none ${getStatusColor(report.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="p-2.5 rounded-xl border border-transparent hover:border-red-100 dark:hover:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
