import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';

const AGENT_ID = '01KJAPGW80G0XJXSMKSMPV4Q5B';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentStreamIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initConversation = useCallback(async () => {
    if (conversationId) return;
    setIsInitializing(true);
    try {
      const res = await fetch(`/api/taskade/agents/${AGENT_ID}/public-conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const newConvoId = data.conversationId;
      setConversationId(newConvoId);

      // Open persistent SSE stream
      const es = new EventSource(
        `/api/taskade/agents/${AGENT_ID}/public-conversations/${newConvoId}/stream`
      );
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        setIsInitializing(false);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'text-start') {
            currentStreamIdRef.current = data.id;
            setMessages((prev) => [
              ...prev,
              { id: data.id, role: 'assistant', content: '', isStreaming: true },
            ]);
          } else if (data.type === 'text-delta') {
            const deltaId = data.id;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === deltaId ? { ...m, content: m.content + data.delta } : m
              )
            );
          } else if (data.type === 'text-end') {
            const endId = data.id;
            setMessages((prev) =>
              prev.map((m) => (m.id === endId ? { ...m, isStreaming: false } : m))
            );
            setIsSending(false);
            currentStreamIdRef.current = null;
          } else if (data.type === 'finish') {
            setIsSending(false);
          } else if (data.type === 'error') {
            setIsSending(false);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'I encountered an error. Please try again.',
              },
            ]);
          }
        } catch {}
      };

      es.onerror = () => {
        setIsConnected(false);
        setIsInitializing(false);
      };
    } catch {
      setIsInitializing(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (isOpen && !conversationId) {
      initConversation();
    }
  }, [isOpen, conversationId, initConversation]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      await fetch(
        `/api/taskade/agents/${AGENT_ID}/public-conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userMsg.content }),
        }
      );
    } catch {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #c5a95e, #a8903d)',
              boxShadow: '0 8px 32px rgba(197,169,94,0.4)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6 text-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 w-80 h-[520px] rounded-2xl flex flex-col z-50 overflow-hidden"
            style={{
              background: 'rgba(10,10,10,0.97)',
              border: '1px solid rgba(197,169,94,0.25)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(197,169,94,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 border-b"
              style={{
                borderColor: 'rgba(197,169,94,0.2)',
                background: 'linear-gradient(135deg, rgba(197,169,94,0.1), transparent)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #c5a95e, #a8903d)' }}
              >
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Onboarding Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isConnected ? '#4ade80' : '#888' }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {isInitializing ? 'Connecting...' : isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.length === 0 && !isInitializing && (
                <div className="text-center py-8">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(197,169,94,0.1)' }}
                  >
                    <Bot className="w-6 h-6" style={{ color: '#c5a95e' }} />
                  </div>
                  <p className="text-sm font-medium text-white/70">zONE Onboarding Assistant</p>
                  <p className="text-xs text-white/30 mt-1">Ask me anything about your onboarding</p>
                </div>
              )}

              {isInitializing && (
                <div className="flex items-center justify-center py-8 gap-2 text-white/40">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#c5a95e' }} />
                  <span className="text-sm">Connecting...</span>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #c5a95e, #a8903d)'
                          : 'rgba(255,255,255,0.07)',
                      color: msg.role === 'user' ? '#000' : 'rgba(255,255,255,0.85)',
                      borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '12px',
                    }}
                  >
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-1 h-3 ml-0.5 align-middle animate-pulse"
                        style={{ background: '#c5a95e', borderRadius: '1px' }} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 border-t"
              style={{ borderColor: 'rgba(197,169,94,0.15)' }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={!isConnected || isSending}
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !input.trim() || isSending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
                  style={{
                    background:
                      isConnected && input.trim() && !isSending
                        ? 'linear-gradient(135deg, #c5a95e, #a8903d)'
                        : 'rgba(255,255,255,0.05)',
                    color: isConnected && input.trim() && !isSending ? '#000' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
