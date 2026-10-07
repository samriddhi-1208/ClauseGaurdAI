import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Sparkles, 
  Loader2, 
  Clock, 
  CreditCard, 
  Lock, 
  FileQuestion,
  Filter
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { chatAPI, documentAPI } from '../services/api';

const SUGGESTED_PROMPTS = [
  { icon: Clock, title: "Data Retention", prompt: "What are the data retention requirements and timelines across these documents?" },
  { icon: CreditCard, title: "Payment Terms", prompt: "What are the invoice payment terms, billing cycles, and dispute deadlines?" },
  { icon: Lock, title: "Confidentiality", prompt: "What obligations and durations apply to non-disclosure and confidential information?" },
  { icon: FileQuestion, title: "Termination", prompt: "What are the termination conditions, cure periods, and notice requirements?" }
];

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to the ClauseGuard AI Legal Assistant. You can ask natural-language questions about your uploaded agreements.\n\nAll answers are strictly grounded in your contract library via ChromaDB vector embeddings and include source citations with page numbers.',
      sources: []
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    const userMsg = { sender: 'user', text: question };
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
          sources: res.data.sources || []
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
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 h-screen font-sans text-[#18231C]">
      <Navbar title="Contract Analysis Assistant" subtitle="Interactive legal Q&A grounded in vectorized contract clauses" />

      {/* Main Chat Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6">
        
        {/* Top Control Bar: Document Filter & Prompt Chips */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] p-4 shadow-card mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18231C]">
              <Filter className="w-3.5 h-3.5 text-[#3F6149]" />
              <span>Query Scope:</span>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="bg-[#FAF9F5] border border-[#DDDCD3] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#18231C] focus:outline-none focus:border-[#3F6149]"
              >
                <option value="">All Uploaded Contracts (Global Library)</option>
                {documents.map((d) => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] text-[#758177]">
              Vector Memory Powered by Gemini & ChromaDB
            </span>
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {SUGGESTED_PROMPTS.map((sp, idx) => {
              const Icon = sp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(sp.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAECE4] border border-[#DDDCD3] hover:border-[#CADBCC] text-xs font-medium text-[#2E3731] flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-[#3F6149]" />
                  <span>{sp.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 px-2 pr-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 stroke-[2]" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 text-xs md:text-sm leading-relaxed shadow-card ${
                  msg.sender === 'user'
                    ? 'bg-[#EAECE4] text-[#18231C] border border-[#D7DACD]'
                    : 'bg-white text-[#18231C] border border-[#DDDCD3]'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed font-normal">{msg.text}</p>

                {/* Grounded Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#ECEAE2] space-y-1.5">
                    <p className="text-[10px] font-semibold text-[#6B736D] uppercase tracking-wider">
                      Source Citations ({msg.sources.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#DDDCD3] text-[11px] font-medium text-[#2E3731] flex items-center gap-1.5"
                        >
                          <FileText className="w-3 h-3 text-[#3F6149]" />
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
                <div className="w-8 h-8 rounded-xl bg-[#EDE9DE] text-[#685F4D] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#DDDCD3] shadow-card flex items-center gap-2 text-xs text-[#5A665D]">
                <Loader2 className="w-4 h-4 animate-spin text-[#3F6149]" />
                <span>Searching semantic contract vectors & reasoning with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-white rounded-2xl border border-[#DDDCD3] p-2 shadow-card flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask any question regarding warranties, termination, or confidentiality..."
              className="flex-1 px-3 py-2 bg-transparent text-xs md:text-sm text-[#18231C] placeholder-[#8C948C] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="py-2.5 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
