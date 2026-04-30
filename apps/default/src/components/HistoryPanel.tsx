import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Trophy } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { format } from 'date-fns';

export default function HistoryPanel() {
  const { completionRecords, trainings } = useProgress();

  const sorted = [...completionRecords].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const getTraining = (trainingId: string) =>
    trainings.find((t) => t.id === trainingId);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(197,169,94,0.1)' }}
        >
          <Trophy className="w-8 h-8" style={{ color: 'rgba(197,169,94,0.4)' }} />
        </div>
        <p className="text-white/40 font-medium">No completions yet</p>
        <p className="text-white/25 text-sm mt-1">
          Complete your first training to see your record here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4" style={{ color: '#c5a95e' }} />
        <h3 className="text-sm font-semibold text-white">
          Completion Record
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'rgba(197,169,94,0.15)', color: '#c5a95e' }}
        >
          {sorted.length} completed
        </span>
      </div>

      {sorted.map((record, i) => {
        const training = getTraining(record.trainingId);
        return (
          <motion.div
            key={record.nodeId + i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: 'rgba(197,169,94,0.04)',
              border: '1px solid rgba(197,169,94,0.12)',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(135deg, #c5a95e, #a8903d)' }}
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {record.trainingName}
              </p>
              {training && (
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {training.subCategory}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5">
                <Clock className="w-3 h-3" style={{ color: 'rgba(197,169,94,0.6)' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {record.completedAt
                    ? format(new Date(record.completedAt), 'MMM d, yyyy — h:mm a')
                    : 'Date unknown'}
                </span>
              </div>
            </div>
            <div
              className="shrink-0 text-xs px-2 py-1 rounded-lg font-medium"
              style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}
            >
              ✓
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
