'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info, Clock } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  countdown?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 5000, 
  onClose, 
  countdown 
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown || 0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (countdown && countdown > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    const autoCloseTimer = setTimeout(onClose, duration);
    
    return () => {
      clearInterval(progressTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-7 h-7 text-green-400" />;
      case 'error': return <AlertTriangle className="w-7 h-7 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-7 h-7 text-yellow-400" />;
      case 'info': return <Info className="w-7 h-7 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500/30 border-green-400/50 shadow-green-500/20';
      case 'error': return 'bg-red-500/30 border-red-400/50 shadow-red-500/20';
      case 'warning': return 'bg-yellow-500/30 border-yellow-400/50 shadow-yellow-500/20';
      case 'info': return 'bg-blue-500/30 border-blue-400/50 shadow-blue-500/20';
    }
  };

  return (
    <div className={`
      fixed top-6 right-6 z-[9999] 
      ${getColors()} 
      border-2 backdrop-blur-xl rounded-2xl p-6 text-white 
      shadow-2xl transform transition-all duration-500 ease-out
      animate-in slide-in-from-right-8 fade-in-0
      min-w-[400px] max-w-[500px]
    `}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 animate-pulse">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-1">
            {type === 'success' ? 'Success!' : 
             type === 'error' ? 'Error!' : 
             type === 'warning' ? 'Warning!' : 'Info'}
          </h3>
          <p className="text-white/90 text-base">{message}</p>
          {countdown && timeLeft > 0 && (
            <div className="mt-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-white/70" />
              <p className="text-sm text-white/70">
                Redirecting in {timeLeft} seconds...
              </p>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Enhanced Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    countdown?: number;
  }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', countdown?: number) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, countdown }]);
    
    // Auto-remove after countdown if specified
    if (countdown) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, (countdown + 1) * 1000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-6 right-6 z-[9999] space-y-3">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            countdown={toast.countdown}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};
