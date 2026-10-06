import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Filter, 
  CheckCircle2, 
  ShieldCheck,
  Search,
  Lightbulb,
  Clock,
  CreditCard,
  Lock,
  FileQuestion
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

  const selectedDocument = documents.find(d => (d._id || d.id) === selectedDocId);
  const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
  const activeSources = lastAiMessage?.sources || [];

  return (
    <div className="flex-1 bg-[#090D16] flex flex-col min-w-0 h-screen overflow-hidden font-sans text-slate-100">
      <Navbar title="AI Legal Research Assistant" subtitle="Inquire about contractual terms with grounded citations from vector memory" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-5 min-h-0 overflow-hidden">
        {/* Main Conversation Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#111827] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
          
          {/* Conversation Header Bar */}
          <div className="px-5 py-3 bg-[#0B101D] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>Legal Research Dialogue</span>
                  <span className="px-2 py-0.5 bg-blue-950 text-blue-300 text-[10px] font-medium rounded-md border border-blue-800/50">
                    Grounded RAG
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-normal">ChromaDB Persistent Vector Index & Gemini AI</p>
              </div>
            </div>

            {/* Scope Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-200 font-medium truncate max-w-[180px]">
                {selectedDocument ? selectedDocument.fileName : `All Contracts (${documents.length})`}
              </span>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#090D16]/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600'
                      : 'bg-slate-900 border border-slate-800 text-blue-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-4 rounded-xl text-xs leading-relaxed font-normal ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#0B101D] text-slate-100 border border-slate-800 rounded-tl-none space-y-3'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Sources Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Retrieved Document Sources:
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {msg.sources.length} citation{msg.sources.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-medium text-white flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{src.documentName}</span>
                            <span className="text-blue-300 bg-blue-950 px-1.5 py-0.2 rounded text-[10px] font-mono border border-blue-800/60">
                              Page {src.pageNumber}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 shrink-0 border border-slate-800">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-xl bg-[#0B101D] border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                  <span className="font-normal text-xs text-slate-300">
                    Retrieving vector chunks and generating response...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form Input Bar */}
          <div className="p-3 bg-[#0B101D] border-t border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-colors"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask a question about terms in your contract library..."
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-transparent focus:outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || loading}
                aria-label="Send question"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Context & Citations */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
          
          {/* Section 1: Active Context Selection */}
          <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Target Scope</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Inquire across:</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Uploaded Contracts ({documents.length})</option>
                {documents.map((d) => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 pt-1">
              {documents.slice(0, 4).map((d) => {
                const dId = d._id || d.id;
                const isSelected = selectedDocId === dId;
                return (
                  <div
                    key={dId}
                    onClick={() => setSelectedDocId(dId)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-600 text-white font-medium'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{d.fileName}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {d.totalClauses || 0} clauses
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Grounded Citations */}
          <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Grounded Citations</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                {activeSources.length} Found
              </span>
            </div>

            {activeSources.length === 0 ? (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 font-normal flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Ask a question to inspect retrieved citations.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeSources.map((src, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-medium text-white">
                      <span className="truncate max-w-[140px]">{src.documentName}</span>
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-mono border border-blue-800/60">
                        Page {src.pageNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic font-mono">
                      "{src.textSnippet || 'Retrieved grounded clause matching search intent.'}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Suggested Inquiries */}
          <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Suggested Inquiries</span>
            </div>

            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    disabled={loading}
                    className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-normal text-white transition-colors flex items-start gap-2.5 group disabled:opacity-50"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-medium text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-[11px] text-slate-400 font-normal line-clamp-1">
                        {item.prompt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ChatPage;
