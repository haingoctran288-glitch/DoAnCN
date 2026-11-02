import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, X, Trash2 } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success' }) => {
    const id = Date.now();
    setToasts((prev) => {
      if (prev.some(t => t.message === message && t.title === title)) {
        return prev;
      }
      return [...prev, { id, title, message, type }];
    });
    
    const duration = type === 'auth_warning' ? 5000 : 2500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container - Góc top-right */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex gap-4 bg-[#111]/95 backdrop-blur-md border-y border-r border-[#222] border-l-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] p-4 rounded-r-lg ${toast.type === 'auth_warning' ? 'min-w-[320px] max-w-[400px] border-l-red-500 flex-col items-stretch' : 'min-w-[280px] max-w-[350px] border-l-accent flex-row items-start'} transform transition-all animate-[slideInRight_0.3s_ease-out_forwards] relative overflow-hidden`}
          >
            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 h-[3px] ${toast.type === 'auth_warning' ? 'bg-red-500 animate-[shrinkWidth_5s_linear_forwards]' : 'bg-accent/80 animate-[shrinkWidth_2.5s_linear_forwards]'}`} />
            
            {toast.type === 'auth_warning' ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-red-500 text-base font-bold mb-1 uppercase tracking-wider">{toast.title || 'Cảnh báo'}</span>
                    <span className="text-gray-300 text-sm leading-relaxed">{toast.message}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="mt-2 w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2 rounded transition-colors uppercase text-sm tracking-wider"
                >
                  Đã hiểu
                </button>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'remove' ? (
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  ) : toast.type === 'error' ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <span className="text-white text-sm font-bold mb-1">{toast.title}</span>
                  {toast.message && (
                    <span className="text-gray-400 text-xs leading-snug line-clamp-2">{toast.message}</span>
                  )}
                </div>
                
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-600 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

