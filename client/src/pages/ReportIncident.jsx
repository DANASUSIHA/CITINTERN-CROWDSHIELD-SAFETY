import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MapView from '../components/MapView';
import { ShieldAlert, AlertTriangle, MapPin, Send, Navigation } from 'lucide-react';

const ReportIncident = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [severity, setSeverity] = useState('Low');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLocationSelect = (lat, lng) => {
    setCoords({ lat, lng });
    setError('');
  };

  // Helper to prefill current location using geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        showToast('Current coordinates detected!', 'success');
      },
      () => {
        showToast('Unable to retrieve your location', 'error');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !locationName || !severity) {
      setError('Please fill in all textual fields');
      return;
    }

    if (!coords) {
      setError('Please click on the map below to pin the incident coordinates');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          locationName,
          lat: coords.lat,
          lng: coords.lng,
          severity
        }),
      });

      if (res.success) {
        showToast('Incident reported successfully!', 'success');
        navigate('/my-reports');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit report');
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950/40">
      
      {/* Header Info */}
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Report New Incident</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
          File an incident to notify local monitoring safety teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Fields: Left 2 Columns on large screens */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Incident Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Active fire hazard, crowd overflow, blocked exit"
                className="block w-full px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Incident Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is happening, approximate crowd size, and immediate hazards..."
                className="block w-full px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                required
              ></textarea>
            </div>

            {/* Location Name & Detect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="locationName" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Location Name / Description
                </label>
                <input
                  id="locationName"
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Sector 4 Central Plaza, South Station Lobby"
                  className="block w-full px-4 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  required
                />
              </div>

              {/* Coordinates Indicator */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  Coordinates
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-[10px] text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-bold transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Auto Detect
                  </button>
                </label>
                <div className="flex items-center gap-2 px-4 py-3 border border-gray-100 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-850 text-xs font-semibold text-gray-600 dark:text-gray-300 h-[46px]">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {coords ? (
                    <span>Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</span>
                  ) : (
                    <span className="text-gray-400 italic">No coordinates selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Severity Card Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Incident Severity Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { level: 'Low', color: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/10 hover:bg-emerald-50/20 text-emerald-700 dark:text-emerald-400 font-bold text-sm', activeColor: 'bg-emerald-600 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border-transparent' },
                  { level: 'Medium', color: 'border-amber-200 dark:border-amber-900 bg-amber-50/10 hover:bg-amber-50/20 text-amber-700 dark:text-amber-400 font-bold text-sm', activeColor: 'bg-amber-500 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 border-transparent' },
                  { level: 'High', color: 'border-rose-200 dark:border-rose-900 bg-rose-50/10 hover:bg-rose-50/20 text-rose-700 dark:text-rose-400 font-bold text-sm', activeColor: 'bg-rose-600 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 border-transparent' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSeverity(item.level)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs ${
                      severity === item.level ? item.activeColor : item.color
                    }`}
                  >
                    <span>{item.level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/20 dark:shadow-brand-500/10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>

        {/* Map Picker Sidebar Panel */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4 flex flex-col h-full min-h-[400px] lg:min-h-[500px]">
            <div>
              <h4 className="font-extrabold text-gray-900 dark:text-white">Pin Coordinates</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                Click directly on the map surface below to set the precise hazard center marker.
              </p>
            </div>
            
            <div className="flex-1 w-full rounded-xl overflow-hidden min-h-[300px]">
              <MapView
                interactive={true}
                selectedLocation={coords}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportIncident;
