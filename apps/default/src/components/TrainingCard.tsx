import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, ExternalLink, ChevronDown, ChevronUp, Loader2, Phone, MapPin } from 'lucide-react';

const BOARD_CONTACTS = [
  {
    name: 'Greater Greenville Association of Realtors',
    shortName: 'GGAR',
    address: '50 Airpark Drive, Greenville, SC 29607',
    phone: '864-672-4427',
    website: 'https://www.ggar.com',
    color: '#6aabff',
    colorAlpha: 'rgba(106,171,255,0.12)',
    colorBorder: 'rgba(106,171,255,0.25)',
  },
  {
    name: 'Spartanburg Association of Realtors',
    shortName: 'SAR',
    address: '225 N Pine St. Spartanburg, SC 29306',
    phone: '864-583-3679',
    website: 'https://www.spartanburgrealtors.com',
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,0.12)',
    colorBorder: 'rgba(167,139,250,0.25)',
  },
  {
    name: 'Western Upstate Association of Realtors',
    shortName: 'WUAR',
    address: '600 McGee Rd. Anderson, SC 29625',
    phone: '864-224-7941',
    website: 'https://www.westernupstatemls.com',
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,0.12)',
    colorBorder: 'rgba(52,211,153,0.25)',
  },
];

function BoardContactsPanel() {
  return (
    <div className="space-y-2.5">
      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Contact your board(s) directly to request your transfer:
      </p>
      {BOARD_CONTACTS.map((board, i) => (
        <motion.div
          key={board.shortName}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.07 }}
          className="rounded-xl p-4"
          style={{
            background: board.colorAlpha,
            border: `1px solid ${board.colorBorder}`,
          }}
        >
          {/* Name row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: board.colorAlpha, border: `1px solid ${board.colorBorder}`, color: board.color }}
            >
              {board.shortName}
            </div>
            <p className="font-semibold text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {board.name}
            </p>
          </div>

          {/* Address + Phone */}
          <div className="space-y-1.5 mb-3 ml-10">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: board.color }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{board.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: board.color }} />
              <a
                href={`tel:${board.phone.replace(/-/g, '')}`}
                className="text-xs font-semibold hover:opacity-75 transition-opacity"
                style={{ color: board.color }}
              >
                {board.phone}
              </a>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 ml-10">
            <a
              href={board.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95"
              style={{ background: board.color, color: '#000' }}
            >
              <ExternalLink className="w-3 h-3" />
              Visit Website
            </a>
            <a
              href={`tel:${board.phone.replace(/-/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
              style={{ background: board.colorAlpha, color: board.color, border: `1px solid ${board.colorBorder}` }}
            >
              <Phone className="w-3 h-3" />
              Call to Transfer
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
import { Training } from '../contexts/ProgressContext';

interface TrainingCardProps {
  training: Training;
  isCompleted: boolean;
  isUnlocked: boolean;
  index: number;
  onMarkComplete: () => Promise<void>;
}

export default function TrainingCard({
  training,
  isCompleted,
  isUnlocked,
  index,
  onMarkComplete,
}: TrainingCardProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const handleMarkComplete = async () => {
    if (!isUnlocked || isCompleted || isMarking) return;
    setIsMarking(true);
    await onMarkComplete();
    setJustCompleted(true);
    setIsMarking(false);
    setTimeout(() => setJustCompleted(false), 2000);
  };

  const hasUrl = training.url && training.url.trim() !== '';
  const hasDescription = training.description && training.description.trim() !== '';
  const isLocked = !isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative rounded-xl border transition-all duration-300"
      style={{
        background: isCompleted
          ? 'rgba(197,169,94,0.12)'
          : isLocked
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.08)',
        borderColor: isCompleted
          ? 'rgba(197,169,94,0.5)'
          : isLocked
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.18)',
        opacity: isLocked ? 0.6 : 1,
      }}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Step indicator */}
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
          style={{
            background: isCompleted
              ? 'linear-gradient(135deg, #c5a95e, #a8903d)'
              : isLocked
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(197,169,94,0.1)',
            color: isCompleted ? '#000' : isLocked ? 'rgba(255,255,255,0.2)' : '#c5a95e',
            border: isCompleted ? 'none' : `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : 'rgba(197,169,94,0.3)'}`,
            boxShadow: isCompleted ? '0 4px 12px rgba(197,169,94,0.3)' : 'none',
          }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <span>{training.order}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p
              className="font-medium text-sm truncate"
              style={{ color: isCompleted ? '#c5a95e' : isLocked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.95)' }}
            >
              {training.name}
            </p>
            {hasDescription && !isLocked && (
              <button
                onClick={() => setDescriptionOpen((v) => !v)}
                className="shrink-0 p-0.5 rounded transition-colors"
                style={{ color: descriptionOpen ? '#c5a95e' : 'rgba(255,255,255,0.3)' }}
                title={descriptionOpen ? 'Hide details' : 'Show details'}
              >
                {descriptionOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {hasUrl && !isLocked && (
            <a
              href={training.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: 'rgba(197,169,94,0.1)',
                color: '#c5a95e',
                border: '1px solid rgba(197,169,94,0.2)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(197,169,94,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(197,169,94,0.1)';
              }}
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}

          {!isCompleted && !isLocked && (
            <button
              onClick={handleMarkComplete}
              disabled={isMarking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 text-black"
              style={{
                background: justCompleted
                  ? '#4ade80'
                  : 'linear-gradient(135deg, #c5a95e, #a8903d)',
                boxShadow: '0 4px 12px rgba(197,169,94,0.25)',
              }}
            >
              {isMarking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : justCompleted ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Mark Done
                </>
              )}
            </button>
          )}

          {isCompleted && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(197,169,94,0.1)', color: '#c5a95e' }}>
              ✓ Done
            </span>
          )}

          {isLocked && (
            <span className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
              Locked
            </span>
          )}
        </div>
      </div>


      {/* Description panel */}
      <AnimatePresence>
        {hasDescription && !isLocked && descriptionOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4">
              {training.name === 'Board Transfer' ? (
                <div
                  className="px-4 py-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: '1px solid rgba(197,169,94,0.15)',
                  }}
                >
                  <BoardContactsPanel />
                </div>
              ) : (
                <div
                  className="px-4 py-3 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    borderTop: '1px solid rgba(197,169,94,0.15)',
                  }}
                >
                  {training.description}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
