import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    let result;
    if (mode === 'login') {
      result = await login(email, phone);
    } else {
      result = await register(email, fullName, phone);
    }
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong.');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c5a95e 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c5a95e 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c5a95e 0%, transparent 70%)' }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#c5a95e 1px, transparent 1px), linear-gradient(90deg, #c5a95e 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="gold-shimmer">ONE Freedom</span> Launchpad
          </h1>
          <p className="text-white/40 text-sm">Your onboarding journey starts here</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(197,169,94,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(197,169,94,0.1)',
          }}
        >
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(0,0,0,0.4)' }}>
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize"
                style={{
                  background: mode === tab ? 'linear-gradient(135deg, #c5a95e, #a8903d)' : 'transparent',
                  color: mode === tab ? '#000' : 'rgba(255,255,255,0.5)',
                  boxShadow: mode === tab ? '0 4px 12px rgba(197,169,94,0.3)' : 'none',
                }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="fullname"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === 'register'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(197,169,94,0.5)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(197,169,94,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(197,169,94,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            {mode === 'login' && (
              <p className="text-xs px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Use the phone number you registered with to sign in.
              </p>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-black text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-2"
              style={{
                background: isLoading
                  ? 'rgba(197,169,94,0.5)'
                  : 'linear-gradient(135deg, #c5a95e, #a8903d)',
                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(197,169,94,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(197,169,94,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(197,169,94,0.3)';
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-4">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={switchMode} className="font-medium transition-colors" style={{ color: '#c5a95e' }}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} ONE Freedom. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
