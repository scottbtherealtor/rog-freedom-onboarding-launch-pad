import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Phone, MapPin, ExternalLink, ChevronDown, ChevronUp, ArrowRightLeft } from 'lucide-react';

const BOARDS = [
  {
    name: 'Greater Greenville Association of Realtors',
    shortName: 'GGAR',
    address: '50 Airpark Drive, Greenville, SC 29607',
    phone: '864-672-4427',
    website: 'https://www.ggar.com',
    color: '#6aabff',
    colorAlpha: 'rgba(106,171,255,0.15)',
    colorBorder: 'rgba(106,171,255,0.3)',
  },
  {
    name: 'Spartanburg Association of Realtors',
    shortName: 'SAR',
    address: '225 N Pine St. Spartanburg, SC 29306',
    phone: '864-583-3679',
    website: 'https://www.spartanburgrealtors.com',
    color: '#a78bfa',
    colorAlpha: 'rgba(167,139,250,0.15)',
    colorBorder: 'rgba(167,139,250,0.3)',
  },
  {
    name: 'Western Upstate Association of Realtors',
    shortName: 'WUAR',
    address: '600 McGee Rd. Anderson, SC 29625',
    phone: '864-224-7941',
    website: 'https://www.westernupstatemls.com',
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,0.15)',
    colorBorder: 'rgba(52,211,153,0.3)',
  },
];

export default function BoardTransferCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid rgba(197,169,94,0.4)',
        background: 'linear-gradient(135deg, rgba(197,169,94,0.08) 0%, rgba(0,0,0,0) 70%)',
        boxShadow: '0 0 28px rgba(197,169,94,0.1)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left transition-all duration-200"
      >
        {/* Icon */}
        <div
          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #c5a95e, #a8903d)',
            boxShadow: '0 6px 24px rgba(197,169,94,0.35)',
          }}
        >
          <ArrowRightLeft className="w-7 h-7 text-black" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-base" style={{ color: 'rgba(255,255,255,0.97)' }}>
              Board Transfer Information
            </p>
            <span
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold"
              style={{
                background: 'rgba(197,169,94,0.2)',
                color: '#c5a95e',
                border: '1px solid rgba(197,169,94,0.35)',
              }}
            >
              Action Required
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Contact your board directly to request your transfer
          </p>
        </div>

        {/* Chevron */}
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: '#c5a95e' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: '#c5a95e' }} />
          )}
        </div>
      </button>

      {/* Board list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Instruction banner */}
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'rgba(197,169,94,0.08)',
                  border: '1px solid rgba(197,169,94,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <ArrowRightLeft className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c5a95e' }} />
                <p>
                  You may be part of <span style={{ color: '#c5a95e', fontWeight: 600 }}>one or two</span> of the boards below.
                  Contact each applicable board directly to request your transfer.
                </p>
              </div>

              {/* Board cards */}
              {BOARDS.map((board, i) => (
                <motion.div
                  key={board.shortName}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="rounded-xl p-4"
                  style={{
                    background: board.colorAlpha,
                    border: `1px solid ${board.colorBorder}`,
                  }}
                >
                  {/* Board name + badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs"
                        style={{
                          background: board.colorAlpha,
                          border: `1px solid ${board.colorBorder}`,
                          color: board.color,
                        }}
                      >
                        {board.shortName}
                      </div>
                      <p className="font-semibold text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>
                        {board.name}
                      </p>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-2 ml-12">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: board.color }} />
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {board.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: board.color }} />
                      <a
                        href={`tel:${board.phone.replace(/-/g, '')}`}
                        className="text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ color: board.color }}
                      >
                        {board.phone}
                      </a>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 ml-12 flex flex-wrap gap-2">
                    <a
                      href={board.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
                      style={{
                        background: board.color,
                        color: '#000',
                        boxShadow: `0 4px 12px ${board.colorAlpha}`,
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Website
                    </a>
                    <a
                      href={`tel:${board.phone.replace(/-/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
                      style={{
                        background: board.colorAlpha,
                        color: board.color,
                        border: `1px solid ${board.colorBorder}`,
                      }}
                    >
                      <Phone className="w-3 h-3" />
                      Call to Transfer
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
