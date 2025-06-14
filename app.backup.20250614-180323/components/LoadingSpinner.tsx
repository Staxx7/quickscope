import React from 'react';
import { Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  type?: 'data' | 'analysis' | 'report' | 'sync' | 'upload';
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  type = 'data',
  size = 'md',
  fullScreen = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'analysis':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'report':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
      case 'sync':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
        );
      case 'upload':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        );
      default:
        return <Shield className="w-full h-full" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getMessageSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-xl';
      default: return 'text-lg';
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Outer Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-spin" 
             style={{ 
               background: 'conic-gradient(from 0deg, #3b82f6, #06b6d4, #3b82f6, #1e40af, #3b82f6)',
               maskImage: 'radial-gradient(circle, transparent 70%, black 71%)',
               WebkitMaskImage: 'radial-gradient(circle, transparent 70%, black 71%)'
             }}>
        </div>
        
        {/* Middle Pulsing Ring */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 animate-pulse"></div>
        
        {/* Inner Icon Container */}
        <div className={`relative ${getSizeClasses()} bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center`}>
          {/* Shimmer Effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
          
          {/* Icon */}
          <div className="relative text-cyan-400 animate-pulse">
            {getIcon()}
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -inset-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                animation: `float-${i} 3s infinite ${i * 0.5}s`,
                transform: `rotate(${i * 60}deg) translateY(-${20 + i * 5}px)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className={`font-medium text-white ${getMessageSize()}`}>
          {message}
        </h3>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center z-50" 
           style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-12">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default LoadingSpinner;

// Add these custom animations to your global CSS or Tailwind config
const customAnimations = `
@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(360deg); }
}

@keyframes float-0 {
  0%, 100% { transform: rotate(0deg) translateY(-20px) scale(0); opacity: 0; }
  50% { transform: rotate(0deg) translateY(-30px) scale(1); opacity: 1; }
}

@keyframes float-1 {
  0%, 100% { transform: rotate(60deg) translateY(-25px) scale(0); opacity: 0; }
  50% { transform: rotate(60deg) translateY(-35px) scale(1); opacity: 1; }
}

@keyframes float-2 {
  0%, 100% { transform: rotate(120deg) translateY(-30px) scale(0); opacity: 0; }
  50% { transform: rotate(120deg) translateY(-40px) scale(1); opacity: 1; }
}

@keyframes float-3 {
  0%, 100% { transform: rotate(180deg) translateY(-25px) scale(0); opacity: 0; }
  50% { transform: rotate(180deg) translateY(-35px) scale(1); opacity: 1; }
}

@keyframes float-4 {
  0%, 100% { transform: rotate(240deg) translateY(-30px) scale(0); opacity: 0; }
  50% { transform: rotate(240deg) translateY(-40px) scale(1); opacity: 1; }
}

@keyframes float-5 {
  0%, 100% { transform: rotate(300deg) translateY(-20px) scale(0); opacity: 0; }
  50% { transform: rotate(300deg) translateY(-30px) scale(1); opacity: 1; }
}

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
`;
