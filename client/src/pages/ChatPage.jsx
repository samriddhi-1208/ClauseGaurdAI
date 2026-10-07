import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  FileText, 
  Clock, 
  CreditCard, 
  Lock, 
  FileQuestion, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { chatAPI, documentAPI } from '../services/api';

const PROMPT_CARDS = [
  {
    icon: Clock,
    title: "Data Retention Timelines",
    description: "What are the retention requirements, audit rights, and deletion timelines across agreements?",
    color: "bg-[#D8E4EE] text-[#35536D]",
    border: "hover:border-[#BDD2E2]"
  },
  {
    icon: CreditCard,
    title: "Payment & Billing Terms",
    description: "Compare invoice payment deadlines, billing cycles, late fee penalties, and cure periods.",
    color: "bg-[#F5DDD3] text-[#9B4F37]",
    border: "hover:border-[#EBC3B4]"
  },
  {
    icon: Lock,
    title: "Confidentiality & NDA Scope",
    description: "What obligations, exceptions, and non-disclosure durations apply to proprietary information?",
    color: "bg-[#E3DEEC] text-[#5B4F73]",
    border: "hover:border-[#D2CBDF]"
  },
  {
    icon: FileQuestion,
    title: "Termination & Cure Periods",
    description: "What are the termination for cause triggers, notice periods, and post-termination remedies?",
    color: "bg-[#E2ECE3] text-[#2F5236]",
    border: "hover:border-[#CADBCC]"
  }
];

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const fetchDocuments = async () => {
    try {
      const res = await documentAPI.getAll();
      if (res.data.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      console.error('[Chat Fetch Docs Error]', err);
    }
  };

  const handleSend = async (qText) => {
    const question = qText || inputQuestion.trim();
    if (!question || loading) return;

    const userMsg = { sender: 'user', text: question, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const docIds = selectedDocId ? [selectedDocId] : null;
      const res = await chatAPI.ask(question, docIds);

      if (res.data.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.answer,
          sources: res.data.sources || [],
          time: 'Just now'
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('[Chat API Error]', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: err.response?.data?.message || 'Failed to retrieve information from contract memory. Please ensure the backend AI service is online and try again.',
          sources: [],
          time: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const isConversationActive = messages.length > 0;

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 h-full overflow-hidden font-sans text-[#18231C]">
      {/* Top Navbar: ALWAYS visible */}
      <Navbar 
        title="Contract Analysis Assistant" 
        subtitle="Interactive legal Q&A grounded in vectorized contract clauses" 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl w-full mx-auto px-4 md:px-8">
        
        {/* Context Bar: Scope & Vector Status */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DFD5] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#4E5650] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#3F6149]" />
              <span>Scope:</span>
            </span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-white border border-[#DDDCD3] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#18231C] focus:outline-none focus:border-[#3F6149] shadow-2xs max-w-xs truncate cursor-pointer"
            >
              <option value="">All Uploaded Contracts ({documents.length} files)</option>
              {documents.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#2F5236] bg-[#E2ECE3] px-3 py-0.5 rounded-full border border-[#CADBCC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F6149] animate-pulse"></span>
              <span>ChromaDB Vector Index Active</span>
            </div>

            {isConversationActive && (
              <button
                onClick={handleResetChat}
                className="text-xs font-semibold text-[#5A665D] hover:text-[#18231C] flex items-center gap-1 transition-colors px-2 py-0.5"
                title="Start a new inquiry"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Inquiry</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Stage: Welcome Hub or Message Stream */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!isConversationActive ? (
            /* Welcome State: Balanced & Gracefully Centered with my-auto */
            <div className="min-h-full flex flex-col justify-center py-4 my-auto space-y-6">
              
              {/* Header Hero */}
              <div className="text-center max-w-xl mx-auto space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#18231C] leading-snug">
                  How can I help analyze your contracts today?
                </h2>
                <p className="text-xs md:text-sm text-[#5A665D] leading-relaxed font-normal max-w-lg mx-auto">
                  Ask natural-language questions across your repository. All answers are strictly synthesized from indexed contract clauses with source page citations.
                </p>
              </div>

              {/* 4 Interactive Legal Prompt Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl mx-auto w-full">
                {PROMPT_CARDS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSend(card.description)}
                      className={`bg-white p-4.5 rounded-2xl border border-[#DDDCD3] shadow-card hover:shadow-md cursor-pointer transition-all space-y-2 group ${card.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8C948C] group-hover:text-[#3F6149] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div>
                        <h3 className="text-xs md:text-[13px] font-semibold text-[#18231C] group-hover:text-[#3F6149] transition-colors leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-[11px] md:text-xs text-[#5A665D] leading-relaxed mt-1 font-normal">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Active Conversation Stream */
            <div className="space-y-4 max-w-3xl mx-auto w-full py-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <Bot className="w-4 h-4 stroke-[2]" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl md:max-w-2xl rounded-2xl p-4.5 text-xs md:text-sm leading-relaxed shadow-card ${
                      msg.sender === 'user'
                        ? 'bg-[#EAECE4] text-[#18231C] border border-[#D7DACD] rounded-tr-xs'
                        : 'bg-white text-[#18231C] border border-[#DDDCD3]'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>

                    {/* Grounded Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-[#ECEAE2] space-y-1.5">
                        <p className="text-[10px] font-semibold text-[#5A665D] uppercase tracking-[0.05em] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#3F6149]" />
                          <span>Verified Contract Sources ({msg.sources.length})</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#DDDCD3] text-xs font-medium text-[#2E3731] flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#3F6149]" />
                              <span className="font-semibold">{src.fileName || 'Contract'}</span>
                              {src.pageNumber && (
                                <span className="text-[#758177]">p. {src.pageNumber}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#EDE9DE] text-[#685F4D] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-1">
                      S
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-[#DDDCD3] shadow-card flex items-center gap-3 text-xs text-[#5A665D]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#3F6149]" />
                    <span>Searching ChromaDB contract vectors and reasoning with Gemini...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Docked Input Capsule: ALWAYS visible and pinned to bottom */}
        <div className="py-3 border-t border-[#E2DFD5] shrink-0 bg-[#F8F7F2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-white rounded-2xl border border-[#DDDCD3] p-2 shadow-card flex items-center gap-2 max-w-3xl mx-auto w-full focus-within:border-[#3F6149] transition-all"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask any question regarding warranties, termination, cure periods, or liabilities..."
              className="flex-1 px-3 py-1.5 bg-transparent text-xs md:text-sm text-[#18231C] placeholder-[#758177] focus:outline-none font-normal"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="py-2 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-40 shrink-0"
            >
              <span>Ask Assistant</span>
              <Send className="w-3 h-3 stroke-[2]" />
            </button>
          </form>
          <p className="text-[11px] text-[#758177] text-center mt-1.5 font-normal">
            AI responses are strictly grounded in contract vectors. Always verify against official legal agreements.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
