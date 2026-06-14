import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, Trash2, ShieldAlert, AlertTriangle, AlertOctagon, HelpCircle, User, MapPin } from 'lucide-react';

const Alerts = () => {
  const { alerts, clearAlerts } = useSocket();

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'High':
        return <AlertOctagon className="w-5 h-5 text-rose-500" />;
      case 'Medium':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBg = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-950/20';
      case 'Medium':
        return 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-950/20';
      default:
        return 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-950/20';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-73px)] bg-gray-50 dark:bg-slate-950/40">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Real-Time Safety Feed
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">
            Live websocket stream containing security alerts and status modifications.
          </p>
        </div>
        
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-950 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold text-xs transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear Activity Feed
          </button>
        )}
      </div>

      {/* Feed Container */}
      <div className="max-w-3xl mx-auto space-y-4">
        {alerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 mt-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800/40 flex items-center justify-center text-gray-300 dark:text-slate-700 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-gray-900 dark:text-white">Broadcast logs empty</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold max-w-sm mx-auto">
              No real-time events have been captured in this browser session. New reports will push alerts here instantly.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-brand-500/30 pl-6 ml-3 space-y-6">
            {alerts.map((alert, idx) => (
              <div key={idx} className="relative">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-brand-600 border-4 border-gray-50 dark:border-slate-950" />
                
                {/* Alert Card */}
                <div className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-3 transition-shadow hover:shadow-md ${getAlertBg(alert.severity)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex-shrink-0">
                        {getAlertIcon(alert.severity)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {alert.type === 'new' ? 'New Report Filed' : 'Report Modified'}
                        </span>
                        <h4 className="font-extrabold text-gray-900 dark:text-white leading-snug">
                          {alert.title}
                        </h4>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-semibold text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold pl-1">
                    {alert.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-gray-200/40 dark:border-slate-800/40 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-450" />
                      <span>Reporter: {alert.reporter}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-450" />
                      <span>{alert.locationName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Alerts;
