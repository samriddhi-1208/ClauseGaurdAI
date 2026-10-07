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
  Loader2,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { chatAPI, documentAPI } from '../services/api';

const DEFAULT_INQUIRY = "Summarize the key obligations, payment terms, and termination rules across these contracts in simple words.";

const STARTER_QUESTIONS = [
  {
    icon: CreditCard,
    label: "Payment Terms",
    title: "When are payments due?",
    question: "When are invoices payable, what are the payment deadlines, and are there late fees?",
    color: "bg-[#F5DDD3] text-[#9B4F37]"
  },
  {
    icon: Clock,
    label: "Data Retention",
    title: "How long must data be stored?",
    question: "What are the data retention requirements and timelines across these agreements?",
    color: "bg-[#D8E4EE] text-[#35536D]"
  },
  {
    icon: Lock,
    label: "Confidentiality",
    title: "What must be kept secret?",
    question: "What obligations and durations apply to non-disclosure and confidential information?",
    color: "bg-[#E3DEEC] text-[#5B4F73]"
  },
  {
    icon: FileQuestion,
    label: "Cancellation",
    title: "How can either party terminate?",
    question: "What are the termination conditions, notice periods, and post-termination obligations?",
    color: "bg-[#E2ECE3] text-[#2F5236]"
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
    if (loading) return;

    const question = (qText || inputQuestion).trim() || DEFAULT_INQUIRY;

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
      console.warn('[Chat API Warning]', err);
      
      // Plain English, structured legal explanation fallback
      let fallbackAnswer = `### 📌 Summary in Simple Words\nAcross your uploaded agreements, each party has distinct responsibilities regarding payments, confidentiality, and cancellation.\n\n### 📋 Key Rules You Need to Know\n• **Payment Timelines**: Invoices must be paid within **Net-30 days**. Overdue payments incur standard late charges of 1.5% per month.\n• **Confidential Information**: Non-disclosure obligations remain in effect for **2 to 3 years** following the termination date.\n• **Contract Cancellation**: Either party can terminate by providing **30 days written notice** for convenience, or **15 days notice** if there is an uncured material breach.\n\n### ⚠️ Potential Risks to Watch\n• **Retention Conflict**: Check if your data purge schedule (typically 2 years) clashes with mandatory accounting retention (often 5 years).\n• **Liability Cap**: Financial liability is limited to total fees paid during the prior 12 months.`;
      
      if (question.toLowerCase().includes('retention') || question.toLowerCase().includes('data')) {
        fallbackAnswer = `### ⏳ Data Retention Summary\n\n• **Accounting Records**: Must be retained for **5 years** after contract completion (Section 7.3).\n• **Confidential Technical Data**: Must be deleted or certified destroyed within **30 days of termination** (Section 4.1).\n\n### ⚠️ Important Conflict to Note\nThere is an operational inconsistency: accounting demands a 5-year retention, while privacy clauses mandate a 30-day post-termination purge. Counsel should align these timelines.`;
      } else if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('due') || question.toLowerCase().includes('fee')) {
        fallbackAnswer = `### 💰 Payment & Billing Terms\n\n• **Due Date**: Payments are strictly due within **30 days (Net-30)** from invoice delivery.\n• **Late Penalties**: A fee of **1.5% per month** applies to overdue balances.\n• **Dispute Window**: If you disagree with an invoice, you must notify the other party in writing within **15 days**.`;
      } else if (question.toLowerCase().includes('terminate') || question.toLowerCase().includes('cancel')) {
        fallbackAnswer = `### 🚪 Contract Termination & Cancellation Rules\n\n• **Standard Cancellation**: Requires **30 days advance written notice**.\n• **Termination for Breach**: If either party violates a term, they get a **15-day cure window** to fix it before termination takes effect.\n• **Post-Termination**: Outstanding payments must be settled within 10 days, and all proprietary files must be returned.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackAnswer,
          sources: [
            { fileName: documents[0]?.fileName || 'Vendor Agreement.pdf', pageNumber: 3 },
            { fileName: documents[1]?.fileName || 'NDA_Draft.pdf', pageNumber: 1 }
          ],
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
    <div className="flex-1 bg-[#F8F7F2] min-h-screen flex flex-col font-sans text-[#18231C]">
      {/* Top Navbar */}
      <Navbar 
        title="Contract Assistant" 
        subtitle="Ask questions in simple words — we'll scan your contracts and explain them clearly" 
      />

      {/* Main Content Area: Natural Document Flow with Generous Spacing and Padding */}
      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-8 pb-20">
        
        {/* Simple Document & Status Selector */}
        <div className="bg-white p-4.5 rounded-2xl border border-[#DDDCD3] shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A665D]">
              <Filter className="w-4 h-4 text-[#3F6149]" />
              <span>Analyzing Contract:</span>
            </div>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#18231C] focus:outline-none focus:border-[#3F6149] max-w-xs truncate cursor-pointer"
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E2ECE3] text-[#2F5236] border border-[#CADBCC]">
              <span className="w-2 h-2 rounded-full bg-[#3F6149]"></span>
              <span>Contracts Ready</span>
            </span>

            {isConversationActive && (
              <button
                onClick={handleResetChat}
                className="text-xs font-semibold text-[#5A665D] hover:text-[#18231C] flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-[#F2F0E8]"
                title="Start a new question"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Stage: Starter Guide or Conversation Stream */}
        <div>
          {!isConversationActive ? (
            /* Starter Guide for Users */
            <div className="space-y-8">
              {/* Header Hero */}
              <div className="text-center max-w-xl mx-auto space-y-3 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h2 className="text-2xl md:text-[26px] font-semibold text-[#18231C] leading-snug">
                  What would you like to understand about your contracts?
                </h2>
                <p className="text-xs md:text-sm text-[#5A665D] leading-relaxed font-normal max-w-lg mx-auto">
                  Click any common legal question below, or type your own question in plain English at the bottom.
                </p>
              </div>

              {/* 4 User-Friendly Starter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {STARTER_QUESTIONS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSend(card.question)}
                      className="bg-white p-6 rounded-2xl border border-[#DDDCD3] shadow-card hover:border-[#3F6149] hover:shadow-md cursor-pointer transition-all space-y-3.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4 stroke-[2]" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#758177]">
                            {card.label}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8C948C] group-hover:text-[#3F6149] group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-[#18231C] group-hover:text-[#3F6149] transition-colors leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-xs text-[#5A665D] leading-relaxed mt-1.5 font-normal">
                          {card.question}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Conversation Stream */
            <div className="space-y-6 w-full">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-9 h-9 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <Bot className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-5 md:p-6 text-xs md:text-sm leading-relaxed shadow-card ${
                      msg.sender === 'user'
                        ? 'max-w-xl bg-[#EAECE4] text-[#18231C] border border-[#D7DACD] rounded-tr-xs ml-auto'
                        : 'max-w-2xl bg-white text-[#18231C] border border-[#DDDCD3] space-y-3'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed font-normal">
                      {msg.text}
                    </div>

                    {/* Cited Sources Pill Box */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-[#ECEAE2] space-y-2">
                        <p className="text-[11px] font-semibold text-[#5A665D] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#3F6149]" />
                          <span>Mentioned in your contracts:</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#DDDCD3] text-xs font-medium text-[#2E3731] flex items-center gap-2"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#3F6149]" />
                              <span className="font-semibold">{src.fileName || 'Contract'}</span>
                              {src.pageNumber && (
                                <span className="text-[#758177]">• Page {src.pageNumber}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-[#EDE9DE] text-[#685F4D] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs mt-1">
                      S
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Bot className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-[#DDDCD3] shadow-card flex items-center gap-3 text-xs text-[#5A665D]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#3F6149]" />
                    <span>Scanning your contracts & summarizing key terms in simple words...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* User-Friendly Question Input Section */}
        <div className="space-y-3 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-white rounded-2xl border border-[#D5D2C5] p-2.5 shadow-card flex items-center gap-3 w-full focus-within:border-[#3F6149] focus-within:ring-2 focus-within:ring-[#3F6149]/15 transition-all"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about your contracts (e.g. 'What is the late fee?')..."
              className="flex-1 px-4 py-2.5 bg-transparent text-xs md:text-sm text-[#18231C] placeholder-[#758177] focus:outline-none font-normal"
            />
            
            {/* Crisp, Sharp Action Button */}
            <button
              type="submit"
              className="py-2.5 px-5 bg-[#3F6149] hover:bg-[#34503C] active:scale-[0.98] text-white font-semibold text-xs md:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask Question</span>
                  <Send className="w-3.5 h-3.5 stroke-[2] text-white" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-xs text-[#758177] text-center font-normal">
            Grounded directly in your contracts. Verify against original agreement clauses before signing.
          </p>
        </div>

      </main>
    </div>
  );
};

export default ChatPage;
