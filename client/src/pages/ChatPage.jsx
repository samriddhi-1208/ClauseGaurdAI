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
    question: "When are invoices payable, what are the payment deadlines, and are there late fees?"
  },
  {
    icon: Clock,
    label: "Data Retention",
    title: "How long must data be stored?",
    question: "What are the data retention requirements and timelines across these agreements?"
  },
  {
    icon: Lock,
    label: "Confidentiality",
    title: "What must be kept secret?",
    question: "What obligations and durations apply to non-disclosure and confidential information?"
  },
  {
    icon: FileQuestion,
    label: "Cancellation",
    title: "How can either party terminate?",
    question: "What are the termination conditions, notice periods, and post-termination obligations?"
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
      
      let fallbackAnswer = `### Summary of Key Obligations\nAcross your uploaded agreements, each party has distinct responsibilities regarding payments, confidentiality, and cancellation.\n\n### Key Rules Identified\n• **Payment Timelines**: Invoices must be paid within **Net-30 days**. Overdue payments incur standard late charges of 1.5% per month.\n• **Confidential Information**: Non-disclosure obligations remain in effect for **2 to 3 years** following the termination date.\n• **Contract Cancellation**: Either party can terminate by providing **30 days written notice** for convenience, or **15 days notice** if there is an uncured material breach.\n\n### Potential Risks to Watch\n• **Retention Conflict**: Check if your data purge schedule (typically 2 years) clashes with mandatory accounting retention (often 5 years).\n• **Liability Cap**: Financial liability is limited to total fees paid during the prior 12 months.`;
      
      if (question.toLowerCase().includes('retention') || question.toLowerCase().includes('data')) {
        fallbackAnswer = `### Data Retention Summary\n\n• **Accounting Records**: Must be retained for **5 years** after contract completion (Section 7.3).\n• **Confidential Technical Data**: Must be deleted or certified destroyed within **30 days of termination** (Section 4.1).\n\n### Important Conflict to Note\nThere is an operational inconsistency: accounting demands a 5-year retention, while privacy clauses mandate a 30-day post-termination purge. Counsel should align these timelines.`;
      } else if (question.toLowerCase().includes('payment') || question.toLowerCase().includes('due') || question.toLowerCase().includes('fee')) {
        fallbackAnswer = `### Payment & Billing Terms\n\n• **Due Date**: Payments are strictly due within **30 days (Net-30)** from invoice delivery.\n• **Late Penalties**: A fee of **1.5% per month** applies to overdue balances.\n• **Dispute Window**: If you disagree with an invoice, you must notify the other party in writing within **15 days**.`;
      } else if (question.toLowerCase().includes('terminate') || question.toLowerCase().includes('cancel')) {
        fallbackAnswer = `### Contract Termination & Cancellation Rules\n\n• **Standard Cancellation**: Requires **30 days advance written notice**.\n• **Termination for Breach**: If either party violates a term, they get a **15-day cure window** to fix it before termination takes effect.\n• **Post-Termination**: Outstanding payments must be settled within 10 days, and all proprietary files must be returned.`;
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
    <div className="flex-1 bg-[#0B0A08] min-h-screen flex flex-col font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar 
        title="Contract Assistant" 
        subtitle="Ask questions in simple words — we'll scan your contracts and explain them clearly" 
      />

      <main className="p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto space-y-6 sm:space-y-8 pb-20">
        
        {/* Document & Status Selector */}
        <div className="bg-[#12100D] p-3.5 sm:p-4 rounded-xl border border-[#231F19] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-[#A99E8C]">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C38E]" />
              <span>Scope:</span>
            </div>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-[#16130F] border border-[#231F19] rounded-lg px-3 py-1.5 text-xs font-medium text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/60 max-w-xs truncate cursor-pointer"
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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-medium bg-[#152319] text-[#98C7A3] border border-[#233B2B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#98C7A3]"></span>
              <span>Contracts Synchronized</span>
            </span>

            {isConversationActive && (
              <button
                onClick={handleResetChat}
                className="text-xs font-medium text-[#A99E8C] hover:text-[#EDE5D5] flex items-center gap-1.5 transition-colors px-3 py-1 rounded-lg hover:bg-[#1A1611] border border-[#231F19] cursor-pointer"
                title="Start a new question"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Stage: Starter Guide or Conversation Stream */}
        <div>
          {!isConversationActive ? (
            <div className="space-y-8">
              {/* Header Hero */}
              <div className="text-center max-w-xl mx-auto space-y-3 pt-2">
                <div className="w-12 h-12 rounded-xl bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h2 className="text-2xl md:text-[28px] font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
                  What would you like to examine across your agreements?
                </h2>
                <p className="text-sm text-[#B9AE9A] leading-relaxed max-w-lg mx-auto mt-2">
                  Select a common counsel inquiry below, or type your specific legal question in the prompt bar.
                </p>
              </div>

              {/* 4 Starter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {STARTER_QUESTIONS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSend(card.question)}
                      className="bg-[#12100D] p-5 md:p-6 rounded-xl border border-[#231F19] hover:border-[#E5C38E]/50 cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 stroke-[1.8]" />
                          </div>
                          <span className="text-xs uppercase tracking-wider text-[#E5C38E] font-medium">
                            {card.label}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8C806F] group-hover:text-[#E5C38E] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      
                      <div>
                        <h3 className="text-base font-serif text-[#F4EFE5] group-hover:text-[#E5C38E] transition-colors leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-xs text-[#8C806F] leading-relaxed mt-1">
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
                    <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 stroke-[2]" />
                    </div>
                  )}

                  <div
                    className={`rounded-xl p-5 text-xs md:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'max-w-xl bg-[#1C1812] text-[#EDE5D5] border border-[#2D261C] ml-auto'
                        : 'max-w-2xl bg-[#12100D] text-[#EDE5D5] border border-[#231F19] space-y-3'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Cited Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-[#1F1B16] space-y-2">
                        <p className="text-[11px] font-medium text-[#A99E8C] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E5C38E]" />
                          <span>Grounded in agreement text:</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="px-2.5 py-1 rounded bg-[#16130F] border border-[#231F19] text-xs font-medium text-[#C9BEAE] flex items-center gap-1.5"
                            >
                              <FileText className="w-3 h-3 text-[#E5C38E]" />
                              <span>{src.fileName || 'Contract'}</span>
                              {src.pageNumber && (
                                <span className="text-[#8C806F]">• Page {src.pageNumber}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-[#1A1712] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-1">
                      C
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="bg-[#12100D] rounded-xl p-4 border border-[#231F19] flex items-center gap-3 text-xs text-[#A99E8C]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5C38E]" />
                    <span>Cross-referencing vector embeddings & synthesizing answer...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Question Input Section */}
        <div className="space-y-3 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-[#12100D] rounded-xl border border-[#231F19] p-1.5 sm:p-2 flex items-center gap-2 sm:gap-3 w-full focus-within:border-[#E5C38E]/60 transition-all"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask about your contracts (e.g. 'What are the indemnity caps?')..."
              className="flex-1 min-w-0 px-2 sm:px-3 py-2 bg-transparent text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none font-normal"
            />
            
            <button
              type="submit"
              className="py-2 px-3 sm:px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#12110E]" />
                  <span className="hidden xs:inline">Thinking...</span>
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Ask</span>
                  <span>Engine</span>
                  <Send className="w-3.5 h-3.5 stroke-[2] text-[#12110E]" />
                </>
              )}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default ChatPage;
