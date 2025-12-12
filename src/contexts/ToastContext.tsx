import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, Warning, Info, X } from '@phosphor-icons/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextData {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove após duração especificada
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} weight="fill" className="text-accent-400" />;
      case 'error':
        return <XCircle size={20} weight="fill" className="text-error-400" />;
      case 'warning':
        return <Warning size={20} weight="fill" className="text-secondary-400" />;
      case 'info':
        return <Info size={20} weight="fill" className="text-primary-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'border-accent-500 bg-accent-500/10 shadow-glow-neon';
      case 'error':
        return 'border-error-500 bg-error-500/10 shadow-glow-error';
      case 'warning':
        return 'border-secondary-500 bg-secondary-500/10 shadow-glow-secondary';
      case 'info':
        return 'border-primary-500 bg-primary-500/10 shadow-glow-sm';
    }
  };

  return (
    <div className={`
      relative p-4 rounded-t-gaming border backdrop-blur-sm
      bg-neutral-900/90 ${getStyles()}
      animate-slide-in-right
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-lg
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm leading-tight">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-neutral-300 text-xs mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800"
        >
          <X size={14} />
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 overflow-hidden">
        <div 
          className={`h-full animate-progress ${
            toast.type === 'success' ? 'bg-accent-400' :
            toast.type === 'error' ? 'bg-error-400' :
            toast.type === 'warning' ? 'bg-secondary-400' :
            'bg-primary-400'
          }`}
          style={{ animationDuration: `${toast.duration || 5000}ms` }}
        />
      </div>
    </div>
  );
};
