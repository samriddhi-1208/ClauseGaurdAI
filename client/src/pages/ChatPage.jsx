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
  HelpCircle, 
  ShieldCheck,
  Search,
  Lightbulb
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { chatAPI, documentAPI } from '../services/api';

const SUGGESTED_PROMPTS = [
  { icon: "⏱️", title: "Data Retention", prompt: "What are the data retention requirements across these documents?" },
  { icon: "💳", title: "Payment Terms", prompt: "What are the invoice payment terms and deadlines?" },
  { icon: "🔒", title: "Confidentiality", prompt: "What does this document say about confidentiality and NDA periods?" },
  { icon: "🚪", title: "Termination", prompt: "What are the termination conditions and notice periods?" }
];

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am ClauseGuard AI Legal Assistant. Ask me any question about your uploaded legal contracts.\n\nMy answers are strictly grounded in your contract context using vector RAG retrieval and include page citations.',
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
          text: 'I encountered an error retrieving contract information from vector memory. Please verify backend service connectivity.',
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
      <Navbar title="AI Legal Workspace (RAG)" subtitle="Ask natural language questions strictly grounded in your contract library" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-5 min-h-0 overflow-hidden">
        {/* Left Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#131C31] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-5 py-3 bg-[#0D1322] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold text-white flex items-center gap-2">
                  ClauseGuard Legal RAG Assistant
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-extrabold rounded-full border border-blue-400/30">
                    Grounded Output
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">ChromaDB Vector Retrieval & Gemini AI</p>
              </div>
            </div>

            {/* Scope Filter Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-200 font-bold truncate max-w-[180px]">
                {selectedDocument ? selectedDocument.fileName : `All Contracts (${documents.length})`}
              </span>
            </div>
          </div>

          {/* Chat Messages Conversation Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#090D16]/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600'
                      : 'bg-[#0D1322] border border-slate-800'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-bold rounded-tr-none shadow-2xs'
                      : 'bg-[#0D1322] text-slate-100 border border-slate-800 rounded-tl-none shadow-2xs space-y-3'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Sources Citations Pills */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Retrieved Grounded Sources:
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-400">
                          {msg.sources.length} snippet{msg.sources.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="px-2.5 py-1 bg-[#131C31] hover:bg-blue-950/60 border border-slate-800 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{src.documentName}</span>
                            <span className="text-blue-300 bg-blue-950 px-1.5 py-0.2 rounded text-[10px] font-extrabold border border-blue-800">
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
                <div className="w-8 h-8 rounded-xl bg-[#0D1322] flex items-center justify-center text-white shrink-0 border border-slate-800">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0D1322] border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5 shadow-2xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                  <span className="font-bold text-xs text-slate-300">
                    Querying ChromaDB vector embeddings & synthesizing answer...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Prompt Form Input Bar */}
          <div className="p-3.5 bg-[#0D1322] border-t border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-[#131C31] p-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask a question about your uploaded contracts..."
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-transparent focus:outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-2xs transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Context Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
          
          {/* Section 1: 📚 Active Documents Filter */}
          <div className="bg-[#131C31] p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>📚 Active Contracts</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Document Context:</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1322] border border-slate-800 rounded-xl text-xs font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/70 border-blue-500 text-white font-extrabold'
                        : 'bg-[#0D1322] border-slate-800 text-slate-300 hover:bg-slate-800 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{d.fileName}</span>
                    </div>
                    <span className="text-[10px] bg-[#131C31] px-1.5 py-0.5 rounded border border-slate-700 font-extrabold text-slate-300">
                      {d.totalClauses || 0} c
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 🔎 Sources Used */}
          <div className="bg-[#131C31] p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>🔎 Grounded Sources</span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {activeSources.length} Found
              </span>
            </div>

            {activeSources.length === 0 ? (
              <div className="p-3 bg-[#0D1322] rounded-xl border border-slate-800 text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Vector embeddings index active. Ask a question to view citations.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeSources.map((src, idx) => (
                  <div key={idx} className="p-2.5 bg-[#0D1322] rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-extrabold text-white">
                      <span className="truncate max-w-[140px]">{src.documentName}</span>
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-extrabold border border-blue-800">
                        Page {src.pageNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{src.textSnippet || 'Retrieved grounded clause matching search intent.'}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: 💡 Suggested Questions */}
          <div className="bg-[#131C31] p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>💡 Suggested Questions</span>
            </div>

            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  disabled={loading}
                  className="w-full text-left p-2.5 bg-[#0D1322] hover:bg-blue-950/50 border border-slate-800 hover:border-blue-700/80 rounded-xl text-xs font-bold text-white transition-all flex items-start gap-2 group disabled:opacity-50"
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <div>
                    <span className="block font-extrabold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-medium line-clamp-1">
                      {item.prompt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ChatPage;
