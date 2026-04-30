import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useApiHealth } from '../hooks/useApiHealth';

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function MaintenanceBanner() {
  const { status, lastChecked, retry } = useApiHealth();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await retry();
    setIsRetrying(false);
  };

  const isOffline = status === 'offline';
  const spinClass = isRetrying ? 'w-4 h-4 animate-spin' : 'w-4 h-4';

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
        >
          {/* Ambient glow */}
          <div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(197,169,94,0.08) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-md mx-4 rounded-3xl p-8 flex flex-col items-center text-center gap-6"
            style={{
              background: 'rgba(16,16,16,0.95)',
              border: '1px solid rgba(197,169,94,0.2)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,169,94,0.08)',
            }}
          >
            {/* Icon */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(197,169,94,0.12), rgba(197,169,94,0.04))',
                  border: '1px solid rgba(197,169,94,0.2)',
                }}
              >
                <WifiOff className="w-9 h-9" style={{ color: '#c5a95e' }} />
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: '1px solid rgba(197,169,94,0.3)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Service Temporarily Unavailable
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                We're having trouble connecting to our servers. This is usually brief — please
                hold tight while we restore the connection.
              </p>
            </div>

            {/* Status pill */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-red-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span>All services offline</span>
              {lastChecked && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <Clock className="w-3 h-3" />
                  <span>Last checked {formatTime(lastChecked)}</span>
                </>
              )}
            </div>

            {/* Retry button */}
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-60"
              style={{
                background: isRetrying
                  ? 'rgba(197,169,94,0.2)'
                  : 'linear-gradient(135deg, #c5a95e, #a8903d)',
                color: isRetrying ? '#c5a95e' : '#000',
                boxShadow: isRetrying ? 'none' : '0 4px 20px rgba(197,169,94,0.3)',
              }}
            >
              <RefreshCw className={spinClass} />
              {isRetrying ? 'Checking connection…' : 'Try Again'}
            </button>

            {/* Auto-retry note */}
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Automatically retrying every 30 seconds
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
