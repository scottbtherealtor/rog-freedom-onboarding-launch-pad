import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronDown, ChevronUp, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface OnboardingFormCardProps {
  isStartHereDone: boolean;
}

export default function OnboardingFormCard({ isStartHereDone }: OnboardingFormCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Listen for form submission from the iframe (OpnForm sends postMessage on submit)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // OpnForm emits various events — catch submission signals
      const data = event.data;
      if (
        data &&
        (data.type === 'form-submitted' ||
          data.type === 'submission' ||
          data.submitted === true ||
          (typeof data === 'string' && data.includes('submitted')))
      ) {
        setIsSubmitted(true);
        // Close the form after a short delay so user sees the success state
        setTimeout(() => setIsExpanded(false), 1800);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{
        border: isStartHereDone
          ? '1px solid rgba(197,169,94,0.55)'
          : '1px solid rgba(255,255,255,0.1)',
        background: isStartHereDone
          ? 'linear-gradient(135deg, rgba(197,169,94,0.13) 0%, rgba(0,0,0,0) 70%)'
          : 'rgba(255,255,255,0.04)',
        boxShadow: isStartHereDone ? '0 0 32px rgba(197,169,94,0.12)' : 'none',
      }}
    >
      {/* Header button — larger and more prominent */}
      <button
        onClick={() => isStartHereDone && setIsExpanded((v) => !v)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left transition-all duration-200"
        style={{ cursor: isStartHereDone ? 'pointer' : 'default' }}
      >
        {/* Icon */}
        <div
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: isStartHereDone
              ? 'linear-gradient(135deg, #c5a95e, #a8903d)'
              : 'rgba(255,255,255,0.07)',
            boxShadow: isStartHereDone ? '0 6px 24px rgba(197,169,94,0.35)' : 'none',
          }}
        >
          {isStartHereDone ? (
            <ClipboardList className="w-7 h-7 text-black" />
          ) : (
            <Lock className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.3)' }} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="font-bold text-base"
              style={{
                color: isStartHereDone ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.4)',
              }}
            >
              Phase 1 Completion Form
            </p>
            {isStartHereDone && !isSubmitted && (
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold"
                style={{
                  background: 'rgba(197,169,94,0.25)',
                  color: '#c5a95e',
                  border: '1px solid rgba(197,169,94,0.4)',
                }}
              >
                <Sparkles className="w-3 h-3" />
                Required
              </span>
            )}
            {isSubmitted && (
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold"
                style={{
                  background: 'rgba(34,197,94,0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34,197,94,0.3)',
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                Submitted!
              </span>
            )}
          </div>
          <p
            className="text-sm mt-1"
            style={{
              color: isStartHereDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
            }}
          >
            {isSubmitted
              ? 'Form submitted — you\'re all set for your onboarding!'
              : isStartHereDone
              ? 'Complete this form before your in-person or digital onboarding'
              : 'Complete all Start Here trainings to unlock this form'}
          </p>
        </div>

        {/* Right side */}
        <div className="shrink-0 flex items-center gap-2">
          {isStartHereDone ? (
            <>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl"
                style={{
                  background: 'rgba(197,169,94,0.15)',
                  color: '#c5a95e',
                  border: '1px solid rgba(197,169,94,0.3)',
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Unlocked
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" style={{ color: '#c5a95e' }} />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: '#c5a95e' }} />
              )}
            </>
          ) : (
            <Lock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.2)' }} />
          )}
        </div>
      </button>

      {/* Open Form CTA — shown when collapsed and unlocked */}
      {isStartHereDone && !isExpanded && !isSubmitted && (
        <div className="px-6 pb-5">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #c5a95e, #a8903d)',
              color: '#000',
              boxShadow: '0 4px 20px rgba(197,169,94,0.4)',
            }}
          >
            Open Form →
          </button>
        </div>
      )}

      {/* Form Embed */}
      <AnimatePresence>
        {isStartHereDone && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Close button */}
            <div className="flex justify-end px-5 pb-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Close form ↑
              </button>
            </div>
            <div
              className="mx-4 mb-4 rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(197,169,94,0.2)',
                background: 'rgba(0,0,0,0.3)',
              }}
            >
              <iframe
                src="https://opnform.com/forms/freedom-onboarding-start-here-trainings-67gnit"
                title="Phase 1 Completion Form"
                className="w-full"
                style={{ height: '680px', border: 'none', display: 'block' }}
                allow="clipboard-write"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
