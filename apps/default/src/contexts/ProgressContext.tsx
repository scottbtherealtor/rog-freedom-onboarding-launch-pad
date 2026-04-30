import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface Training {
  id: string;
  order: number;
  category: string;
  subCategory: string;
  name: string;
  url: string;
  description: string;
}

export interface CompletionRecord {
  nodeId: string;
  trainingId: string;
  trainingName: string;
  completedAt: string;
}

interface ProgressContextType {
  trainings: Training[];
  completedIds: Set<string>;
  completionRecords: CompletionRecord[];
  isLoading: boolean;
  loadError: boolean;
  markComplete: (trainingId: string, trainingName: string) => Promise<void>;
  isUnlocked: (order: number) => boolean;
  getProgress: () => number;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [completionRecords, setCompletionRecords] = useState<CompletionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchWithRetry = useCallback(async (url: string, retries = 3, delay = 800): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) return res;
        if (res.status >= 400 && res.status < 500) throw new Error(`Client error: ${res.status}`);
      } catch (e) {
        if (i === retries - 1) throw e;
      }
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
    throw new Error('Max retries reached');
  }, []);

  const fetchTrainings = useCallback(async () => {
    try {
      const res = await fetchWithRetry('/api/taskade/projects/JGUD6icgVKi5MbHW/nodes');
      const data = await res.json();
      const nodes = data?.payload?.nodes || [];

      const parsed: Training[] = nodes
        .filter((n: any) => n.fieldValues?.['/attributes/@trn01'] != null)
        .map((n: any) => ({
          id: n.id,
          order: Number(n.fieldValues?.['/attributes/@trn01'] || 0),
          category: n.fieldValues?.['/attributes/@trn02'] || '',
          subCategory: n.fieldValues?.['/attributes/@trn03'] || '',
          name: n.fieldValues?.['/attributes/@trn04'] || n.fieldValues?.['/text'] || '',
          url: n.fieldValues?.['/attributes/@trn05'] || '',
          description: n.fieldValues?.['/attributes/@trn06'] || '',
        }))
        .sort((a: Training, b: Training) => a.order - b.order);

      setTrainings(parsed);
      setLoadError(false);
    } catch (e) {
      console.error('Failed to fetch trainings', e);
      setLoadError(true);
    }
  }, [fetchWithRetry]);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetchWithRetry('/api/taskade/projects/FdxmcLMZ5RDz7mBf/nodes');
      const data = await res.json();
      const nodes = data?.payload?.nodes || [];

      const userRecords = nodes.filter(
        (n: any) => n.fieldValues?.['/attributes/@prg01'] === user.id
      );

      const records: CompletionRecord[] = userRecords.map((n: any) => ({
        nodeId: n.id,
        trainingId: n.fieldValues?.['/attributes/@prg03'] || '',
        trainingName: n.fieldValues?.['/attributes/@prg04'] || '',
        completedAt: n.fieldValues?.['/attributes/@prg05'] || '',
      }));

      const ids = new Set(records.map((r) => r.trainingId));
      setCompletedIds(ids);
      setCompletionRecords(records);
    } catch (e) {
      console.error('Failed to fetch progress', e);
    }
  }, [user, fetchWithRetry]);

  const refreshProgress = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchTrainings(), fetchProgress()]);
    setIsLoading(false);
  }, [fetchTrainings, fetchProgress]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const markComplete = async (trainingId: string, trainingName: string) => {
    if (!user || completedIds.has(trainingId)) return;

    const now = new Date().toISOString();

    try {
      await fetch('/api/taskade/projects/FdxmcLMZ5RDz7mBf/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '/text': `${user.fullName} — ${trainingName}`,
          '/attributes/@prg01': user.id,
          '/attributes/@prg02': user.email,
          '/attributes/@prg03': trainingId,
          '/attributes/@prg04': trainingName,
          '/attributes/@prg05': now,
          '/attributes/@prg06': 'prg-opt-1',
        }),
      });

      setCompletedIds((prev) => new Set([...prev, trainingId]));
      setCompletionRecords((prev) => [
        ...prev,
        { nodeId: Date.now().toString(), trainingId, trainingName, completedAt: now },
      ]);
    } catch (e) {
      console.error('Failed to mark training complete', e);
    }
  };

  const isUnlocked = (order: number): boolean => {
    if (order === 1) return true;
    const prevTraining = trainings.find((t) => t.order === order - 1);
    if (!prevTraining) return true;
    return completedIds.has(prevTraining.id);
  };

  const getProgress = (): number => {
    if (trainings.length === 0) return 0;
    return Math.round((completedIds.size / trainings.length) * 100);
  };

  return (
    <ProgressContext.Provider
      value={{
        trainings,
        completedIds,
        completionRecords,
        isLoading,
        loadError,
        markComplete,
        isUnlocked,
        getProgress,
        refreshProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
