import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trophy, BookOpen, Clock, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, ArrowRight, PlayCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import TrainingCard from './TrainingCard';
import HistoryPanel from './HistoryPanel';
import AgentChat from './AgentChat';
import OnboardingFormCard from './OnboardingFormCard';

type TabType = 'trainings' | 'history';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { trainings, completedIds, isLoading, loadError, markComplete, isUnlocked, getProgress, refreshProgress } = useProgress();
  const [activeTab, setActiveTab] = useState<TabType>('trainings');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Start Here']));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const progress = getProgress();

  // Group trainings by sub-category
  const groupedTrainings = trainings.reduce<Record<string, typeof trainings>>((acc, t) => {
    const key = t.subCategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const sectionOrder = ['Start Here', 'In-person/Digital Onboarding'];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProgress();
    setIsRefreshing(false);
  };

  const completedCount = completedIds.size;
  const totalCount = trainings.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(0,0,0,0.8)',
          borderBottom: '1px solid rgba(197,169,94,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #c5a95e, #a8903d)' }}
          >
            ONE
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">ONE Freedom Launchpad</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Onboarding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            title="Refresh progress"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">{user?.fullName}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome + Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(197,169,94,0.08) 0%, rgba(0,0,0,0) 60%)',
            border: '1px solid rgba(197,169,94,0.2)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Welcome back, {user?.fullName?.split(' ')[0]}! 👋
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {progress === 100
                  ? 'You\'ve completed your onboarding! 🎉'
                  : `${totalCount - completedCount} training${totalCount - completedCount !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: '#c5a95e' }}>
                {progress}%
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {completedCount}/{totalCount}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #a8903d, #c5a95e, #d4bc7a)',
                boxShadow: '0 0 10px rgba(197,169,94,0.4)',
              }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: BookOpen, label: 'Total', value: totalCount },
              { icon: Trophy, label: 'Completed', value: completedCount },
              { icon: Clock, label: 'Remaining', value: totalCount - completedCount },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: '#c5a95e' }} />
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructions Blurb */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl p-5 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(197,169,94,0.06) 0%, rgba(197,169,94,0.02) 100%)',
            border: '1px solid rgba(197,169,94,0.25)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'rgba(197,169,94,0.12)', border: '1px solid rgba(197,169,94,0.25)' }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#c5a95e' }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-2">How to complete your onboarding</p>
              <div className="space-y-2">
                {[
                  { step: '1', text: 'Complete each module by clicking the training link inside.' },
                  { step: '2', text: 'Once finished, mark the module as Done to unlock the next one.' },
                  { step: '3', text: 'Work through each section in order until you reach 100%.' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                      style={{ background: 'rgba(197,169,94,0.15)', color: '#c5a95e' }}
                    >
                      {step}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="flex items-center gap-1.5 mt-3 text-xs font-semibold"
                style={{ color: '#c5a95e' }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Start with the <span className="underline underline-offset-2">Start Here</span> section below
              </div>

              {/* Video Tutorial Button */}
              <a
                href="https://vento.so/view/659ae143-32d6-4077-9a93-c2ac33df921d?utm_medium=share"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mt-4 px-4 py-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: 'rgba(197,169,94,0.08)',
                  border: '1px solid rgba(197,169,94,0.25)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(197,169,94,0.14)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(197,169,94,0.45)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(197,169,94,0.08)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(197,169,94,0.25)';
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #c5a95e, #a8903d)' }}
                >
                  <PlayCircle className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#c5a95e' }}>
                    Watch Platform Tutorial
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    See how to navigate and use the platform
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'rgba(197,169,94,0.6)' }} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {([
            { id: 'trainings', label: 'Trainings', icon: BookOpen },
            { id: 'history', label: 'My Record', icon: Trophy },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                background: activeTab === id ? 'linear-gradient(135deg, #c5a95e, #a8903d)' : 'transparent',
                color: activeTab === id ? '#000' : 'rgba(255,255,255,0.4)',
                boxShadow: activeTab === id ? '0 4px 12px rgba(197,169,94,0.25)' : 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'history' && completedCount > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: activeTab === id ? 'rgba(0,0,0,0.2)' : 'rgba(197,169,94,0.2)',
                    color: activeTab === id ? '#000' : '#c5a95e',
                  }}
                >
                  {completedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'trainings' && (
            <motion.div
              key="trainings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl animate-pulse"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    />
                  ))}
                </div>
              ) : loadError ? (
                <div
                  className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(197,169,94,0.1)' }}
                  >
                    <RefreshCw className="w-5 h-5" style={{ color: '#c5a95e' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Couldn't load trainings</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Check your connection and try again.
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #c5a95e, #a8903d)',
                      color: '#000',
                      boxShadow: '0 4px 16px rgba(197,169,94,0.3)',
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sectionOrder.map((section) => {
                    const sectionTrainings = groupedTrainings[section] || [];
                    if (sectionTrainings.length === 0) return null;
                    const isExpanded = expandedSections.has(section);
                    const sectionCompleted = sectionTrainings.filter((t) => completedIds.has(t.id)).length;
                    const allDone = sectionCompleted === sectionTrainings.length;

                    // Compute Start Here completion for the form gate
                    const startHereTrainings = groupedTrainings['Start Here'] || [];
                    const startHereDone =
                      startHereTrainings.length > 0 &&
                      startHereTrainings.every((t) => completedIds.has(t.id));

                    return (
                      <React.Fragment key={section}>
                      <div>
                        {/* Section header */}
                        {section === 'In-person/Digital Onboarding' ? (
                          /* Big prominent button for the In-person/Digital Onboarding section */
                          <button
                            onClick={() => toggleSection(section)}
                            className="w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl mb-4 transition-all duration-200 active:scale-[0.99]"
                            style={{
                              background: allDone
                                ? 'linear-gradient(135deg, rgba(197,169,94,0.18) 0%, rgba(168,144,61,0.08) 100%)'
                                : 'linear-gradient(135deg, rgba(197,169,94,0.22) 0%, rgba(168,144,61,0.12) 100%)',
                              border: '1.5px solid rgba(197,169,94,0.5)',
                              boxShadow: '0 4px 28px rgba(197,169,94,0.18)',
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{
                                  background: 'linear-gradient(135deg, #c5a95e, #a8903d)',
                                  boxShadow: '0 4px 16px rgba(197,169,94,0.35)',
                                }}
                              >
                                <BookOpen className="w-6 h-6 text-black" />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-base" style={{ color: '#c5a95e' }}>
                                  {section}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                  {sectionCompleted}/{sectionTrainings.length} completed
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {allDone && (
                                <span
                                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
                                  style={{
                                    background: 'rgba(197,169,94,0.2)',
                                    color: '#c5a95e',
                                    border: '1px solid rgba(197,169,94,0.3)',
                                  }}
                                >
                                  <Trophy className="w-3.5 h-3.5" />
                                  Done
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" style={{ color: '#c5a95e' }} />
                              ) : (
                                <ChevronDown className="w-5 h-5" style={{ color: '#c5a95e' }} />
                              )}
                            </div>
                          </button>
                        ) : (
                          /* Default small pill header for other sections (Start Here) */
                          <button
                            onClick={() => toggleSection(section)}
                            className="w-full flex items-center gap-3 mb-3 group"
                          >
                            <div
                              className="h-px flex-1"
                              style={{
                                background: allDone
                                  ? 'linear-gradient(90deg, rgba(197,169,94,0.5), transparent)'
                                  : 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
                              }}
                            />
                            <div
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                              style={{
                                background: allDone ? 'rgba(197,169,94,0.15)' : 'rgba(255,255,255,0.05)',
                                color: allDone ? '#c5a95e' : 'rgba(255,255,255,0.45)',
                                border: `1px solid ${allDone ? 'rgba(197,169,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
                              }}
                            >
                              {section}
                              <span style={{ color: allDone ? '#c5a95e' : 'rgba(255,255,255,0.3)' }}>
                                {sectionCompleted}/{sectionTrainings.length}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </div>
                            <div
                              className="h-px flex-1"
                              style={{
                                background: allDone
                                  ? 'linear-gradient(90deg, transparent, rgba(197,169,94,0.5))'
                                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))',
                              }}
                            />
                          </button>
                        )}

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2 overflow-hidden"
                            >
                              {sectionTrainings.map((training, idx) => (
                                <TrainingCard
                                  key={training.id}
                                  training={training}
                                  isCompleted={completedIds.has(training.id)}
                                  isUnlocked={isUnlocked(training.order)}
                                  index={idx}
                                  onMarkComplete={() => markComplete(training.id, training.name)}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Form gate — shown between Start Here and In-Person Onboarding */}
                      {section === 'Start Here' && (
                        <OnboardingFormCard isStartHereDone={startHereDone} />
                      )}


                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Agent Chat */}
      <AgentChat />
    </div>
  );
}
