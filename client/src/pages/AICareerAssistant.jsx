import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Lightbulb } from 'lucide-react';

export const AICareerAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your AI Placement Coach. Ask me anything about resume writing, interview prep, DSA strategy, or alumni outreach.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const prompts = [
    'How do I structure my resume bullet points?',
    'How to prepare for SDE-1 System Design?',
    'What questions should I ask the interviewer?',
    'How to write a good alumni referral message?',
  ];

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setMessages(p => [...p, { sender: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: msg });
      if (res.data.success) {
        setMessages(p => [...p, { sender: 'assistant', text: res.data.data.reply, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }]);
      }
    } catch {
      setMessages(p => [...p, { sender: 'assistant', text: 'Could not fetch response. Please try again.', time: '' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="card-panel overflow-hidden flex flex-col h-[78vh]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3 bg-white">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">AI Placement &amp; Career Coach</h1>
          <p className="text-[11px] text-gray-400">Resume strategy, DSA prep, behavioural rounds, cold outreach</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => {
          const isUser = m.sender === 'user';
          return (
            <div key={i} className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-500'}`}>
                {isUser ? user?.name?.charAt(0) : 'AI'}
              </div>
              <div className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${isUser ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm whitespace-pre-line shadow-sm'}`}>
                {m.text}
                {m.time && <div className={`mt-1 text-[10px] text-right ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>{m.time}</div>}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-end gap-2.5">
            <div className="h-7 w-7 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs text-gray-500 font-bold">AI</div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-gray-400 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        {prompts.map((p, i) => (
          <button key={i} onClick={() => send(p)}
            className="flex-shrink-0 px-3 py-1 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 text-[11px] text-gray-600 transition">
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
          <input type="text" placeholder="Ask about interviews, resume tips, referral messages…"
            value={input} onChange={(e) => setInput(e.target.value)} disabled={loading}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-3.5 py-2 text-xs">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
