import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60',
          text: 'text-emerald-800 dark:text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60',
          text: 'text-rose-800 dark:text-rose-300',
          icon: <AlertCircle className="w-5 h-5 text-rose-500" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60',
          text: 'text-amber-800 dark:text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60',
          text: 'text-blue-800 dark:text-blue-300',
          icon: <Info className="w-5 h-5 text-blue-500" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-lg glass pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 animate-[slideIn_0.2s_ease-out] ${styles.bg}`}
              style={{
                animation: 'slideIn 0.2s ease-out',
              }}
            >
              <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
              <div className={`flex-1 text-sm font-medium leading-relaxed ${styles.text}`}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Custom inline animation in stylesheet style block */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
