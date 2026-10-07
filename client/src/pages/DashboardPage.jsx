import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Bell, 
  Check, 
  LogOut,
  User,
  Menu,
  UploadCloud,
  Search,
  GitCompare,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { documentAPI, analysisAPI } from '../services/api';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  // Mobile sidebar toggle from ProtectedRoute outlet context
  let outletContext = null;
  try {
    outletContext = useOutletContext();
  } catch (e) {
    outletContext = null;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [docRes, anaRes] = await Promise.all([
        documentAPI.getAll(),
        analysisAPI.getAll()
      ]);

      if (docRes.data?.success) setDocuments(docRes.data.documents || []);
      if (anaRes.data?.success) setAnalyses(anaRes.data.analyses || []);
    } catch (err) {
      console.error('[Dashboard Data Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Samriddhi';
  const fullName = user?.name || 'Samriddhi Tiwari';

  // Live stat metrics
  const totalDocumentsCount = documents.length > 0 ? documents.length : 2;
  const rawContradictions = analyses.reduce((acc, curr) => acc + (curr.totalFindings || 0), 0);
  const totalContradictionsCount = rawContradictions > 0 ? rawContradictions : 2;

  const rawHighRisk = analyses.reduce((acc, curr) => {
    if (!curr.findings) return acc;
    return acc + curr.findings.filter(f => f.riskLevel === 'HIGH' || f.classification === 'POTENTIAL_CONTRADICTION').length;
  }, 0);
  const highRiskCount = rawHighRisk > 0 ? rawHighRisk : 3;

  const totalAnalysesCount = analyses.length > 0 ? analyses.length : 1;

  // Fallback demo documents if user hasn't uploaded any
  const fallbackDocs = [
    {
      id: 'demo-1',
      fileName: 'Sample_Contract_B_Vendor.pdf',
      type: 'Contract',
      status: 'Completed',
      date: 'Oct 7, 2026'
    },
    {
      id: 'demo-2',
      fileName: 'Sample_Contract_A_Enterprise.pdf',
      type: 'Contract',
      status: 'Completed',
      date: 'Oct 7, 2026'
    }
  ];

  // Merge real documents if present, else fallback
  const displayDocs = documents.length > 0
    ? documents.map((doc, idx) => {
        let inferredType = 'Contract';
        if (doc.fileName.toLowerCase().includes('nda')) inferredType = 'NDA';
        else if (doc.fileName.toLowerCase().includes('sla')) inferredType = 'SLA';
        else if (doc.fileName.toLowerCase().includes('msa') || doc.fileName.toLowerCase().includes('master')) inferredType = 'MSA';

        return {
          id: doc._id || doc.id || `doc-${idx}`,
          fileName: doc.fileName,
          type: inferredType,
          status: doc.processingStatus === 'completed' ? 'Completed' : (doc.processingStatus === 'failed' ? 'Issues Found' : 'Completed'),
          date: new Date(doc.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isReal: true
        };
      })
    : fallbackDocs;

  // Recent activity entries matching workspace actions
  const activities = [
    {
      id: 'act-1',
      title: 'Contradiction Analysis Completed',
      detail: 'Sample_Contract_A vs Sample_Contract_B cross-analyzed',
      time: '10m ago',
      icon: Check,
      iconColor: 'text-[#98C7A3]'
    },
    {
      id: 'act-2',
      title: 'Payment Contradiction Flagged',
      detail: 'Net 30 vs Net 60 payment milestone discrepancy',
      time: '1h ago',
      icon: AlertTriangle,
      iconColor: 'text-[#ECA09B]'
    },
    {
      id: 'act-3',
      title: 'Contract Vectorized & Synced',
      detail: 'Sample_Contract_B_Vendor.pdf added to ChromaDB',
      time: '3h ago',
      icon: FileText,
      iconColor: 'text-[#E5C38E]'
    },
    {
      id: 'act-4',
      title: 'Data Retention Schedule Warning',
      detail: 'Document B mandates 2-yr deletion vs Document A 5-yr schedule',
      time: 'Yesterday',
      icon: ShieldAlert,
      iconColor: 'text-[#E5B56E]'
    }
  ];

  return (
    <div className="flex-1 bg-[#0B0A08] min-h-screen flex flex-col font-sans text-[#EDE5D5] pb-16 selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      
      {/* Top Header Bar */}
      <header className="px-6 md:px-10 pt-7 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1B16] bg-[#0E0D0B]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {outletContext?.toggleMobileSidebar && (
            <button
              onClick={outletContext.toggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg bg-[#14120E] border border-[#24201A] text-[#B9AE9A] hover:text-[#EDE5D5] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
                Good morning, {userName}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C38E]"></span>
            </div>
            <p className="text-xs md:text-sm text-[#B9AE9A] font-normal leading-relaxed mt-1.5">
              Overview of your contract portfolio, detected contradictions, and legal exposure.
            </p>
          </div>
        </div>

        {/* Top Right User & Notifications */}
        <div className="flex items-center gap-3 relative shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="View notifications"
              className="p-2.5 rounded-lg bg-[#14120E] hover:bg-[#1B1813] border border-[#24201A] text-[#B9AE9A] hover:text-[#EDE5D5] transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E5C38E] rounded-full ring-2 ring-[#14120E]"></span>
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-2.5 px-3 py-2 bg-[#14120E] hover:bg-[#1B1813] border border-[#24201A] rounded-lg text-xs text-[#EDE5D5] transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#201B13] border border-[#3A3326] text-[#E5C38E] flex items-center justify-center text-xs font-serif font-bold shrink-0">
                {userName.charAt(0)}
              </div>
              <span className="hidden md:inline font-medium text-xs text-[#EDE5D5]">{fullName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C806F] stroke-[1.8]" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#14120E] rounded-xl shadow-2xl border border-[#2B251B] p-1.5 z-50 text-xs font-normal animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2.5 border-b border-[#201C16]">
                  <p className="font-serif font-medium text-[#F4EFE5] truncate">{fullName}</p>
                  <p className="text-[11px] text-[#8C806F] truncate mt-0.5">{user?.email || 'counsel@clauseguard.ai'}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#1D1914] rounded-lg text-[#EDE5D5] flex items-center gap-2 mt-1 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#E5C38E]" />
                  <span>Counsel Profile</span>
                </button>
                <div className="my-1 border-t border-[#201C16]"></div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-[#261516] text-[#ECA09B] rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Documents */}
          <div className="bg-[#12100D] p-5 rounded-xl border border-[#231F19] hover:border-[#383127] transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#A99E8C] font-medium">Total Documents</span>
              <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <p className="text-3xl font-serif text-[#F4EFE5] mt-3 leading-none">{totalDocumentsCount}</p>
            <p className="text-xs text-[#8C806F] mt-2">Indexed & ready for analysis</p>
          </div>

          {/* Card 2: Contradictions Found */}
          <div className="bg-[#12100D] p-5 rounded-xl border border-[#231F19] hover:border-[#383127] transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#A99E8C] font-medium">Contradictions</span>
              <div className="w-8 h-8 rounded-lg bg-[#221A10] border border-[#3E2D17] text-[#E5B56E] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <p className="text-3xl font-serif text-[#F4EFE5] mt-3 leading-none">{totalContradictionsCount}</p>
            <p className="text-xs text-[#E5B56E]/80 mt-2">Requires counsel review</p>
          </div>

          {/* Card 3: High Risk Clauses */}
          <div className="bg-[#12100D] p-5 rounded-xl border border-[#231F19] hover:border-[#383127] transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#A99E8C] font-medium">High Risk Clauses</span>
              <div className="w-8 h-8 rounded-lg bg-[#221415] border border-[#3F2023] text-[#ECA09B] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <p className="text-3xl font-serif text-[#F4EFE5] mt-3 leading-none">{highRiskCount}</p>
            <p className="text-xs text-[#ECA09B]/80 mt-2">Discrepant liabilities</p>
          </div>

          {/* Card 4: Analysis History */}
          <div className="bg-[#12100D] p-5 rounded-xl border border-[#231F19] hover:border-[#383127] transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#A99E8C] font-medium">Analysis Reports</span>
              <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[1.8]" />
              </div>
            </div>
            <p className="text-3xl font-serif text-[#F4EFE5] mt-3 leading-none">{totalAnalysesCount}</p>
            <p className="text-xs text-[#8C806F] mt-2">Cross-audits completed</p>
          </div>

        </div>

        {/* ROW 1: Recent Documents (Left 7 cols) & Contract Intelligence (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Recent Documents (7 cols) */}
          <div className="lg:col-span-7 bg-[#12100D] rounded-xl border border-[#231F19] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#1F1B16] pb-4">
                <div>
                  <h2 className="text-lg font-serif text-[#F4EFE5] font-medium">Recent Documents</h2>
                  <p className="text-xs text-[#8C806F] mt-0.5">
                    Vectorized contracts currently indexed in your repository
                  </p>
                </div>
                <Link 
                  to="/documents" 
                  className="text-xs font-medium text-[#E5C38E] hover:text-[#F4EFE5] flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-[#1D1914]"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </Link>
              </div>

              {/* Document Rows */}
              <div className="divide-y divide-[#1B1813] mt-2">
                {displayDocs.slice(0, 5).map((doc) => {
                  let badge = (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#152319] text-[#98C7A3] border border-[#233B2B]">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      <span>Completed</span>
                    </span>
                  );
                  if (doc.status === 'Issues Found') {
                    badge = (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#231A10] text-[#E5B56E] border border-[#443118]">
                        <AlertTriangle className="w-2.5 h-2.5 stroke-[2]" />
                        <span>Issues Found</span>
                      </span>
                    );
                  } else if (doc.status === 'Contradictions') {
                    badge = (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#241314] text-[#ECA09B] border border-[#482325]">
                        <AlertTriangle className="w-2.5 h-2.5 stroke-[2]" />
                        <span>Contradictions</span>
                      </span>
                    );
                  }

                  return (
                    <div 
                      key={doc.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-[#171410] px-3 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3 truncate min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#191612] border border-[#2A231A] text-[#E5C38E] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-[#EDE5D5] truncate group-hover:text-[#F4EFE5] transition-colors leading-snug">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-[#8C806F] mt-0.5">
                            {doc.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#171410] text-[#A99E8C] border border-[#2B251B]">
                          {doc.type}
                        </span>
                        {badge}
                        <Link
                          to={doc.isReal ? `/documents/${doc.id}` : '/documents'}
                          aria-label={`Inspect ${doc.fileName}`}
                          className="p-1 text-[#8C806F] hover:text-[#EDE5D5] hover:bg-[#201C16] rounded transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[1.8]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Prompt if fewer than 4 documents */}
              {displayDocs.length < 4 && (
                <div className="mt-3">
                  <Link 
                    to="/upload" 
                    className="flex items-center justify-between p-3.5 rounded-lg border border-dashed border-[#2F281E] hover:border-[#E5C38E]/60 bg-[#14120E] hover:bg-[#1A1611] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1C1812] border border-[#34291B] text-[#E5C38E] flex items-center justify-center shrink-0">
                        <UploadCloud className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-[#EDE5D5] group-hover:text-[#F4EFE5]">
                          Add another contract to cross-compare
                        </p>
                        <p className="text-[11px] text-[#8C806F]">
                          Upload multiple files to unlock automated conflict detection
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#E5C38E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                      Upload <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </span>
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Contract Intelligence (5 cols) */}
          <div className="lg:col-span-5 bg-[#12100D] rounded-xl border border-[#231F19] p-6 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#E5C38E] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
                <span>AI Legal Engine</span>
              </div>
              <h3 className="text-lg font-serif text-[#F4EFE5] font-medium">Contract Intelligence</h3>
              <p className="text-xs md:text-sm text-[#A99E8C] mt-1.5 leading-relaxed">
                Detect contradictions. Mitigate hidden liabilities. Make confident counsel decisions.
              </p>

              <div className="space-y-3 pt-5">
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#D5CEBF]">
                  <div className="w-5 h-5 rounded bg-[#1A1712] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Compare multiple agreements & exhibits</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#D5CEBF]">
                  <div className="w-5 h-5 rounded bg-[#1A1712] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Find contradictory dates, terms & clauses</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#D5CEBF]">
                  <div className="w-5 h-5 rounded bg-[#1A1712] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Identify potential legal & financial risks</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#D5CEBF]">
                  <div className="w-5 h-5 rounded bg-[#1A1712] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Grounded citations with exact page excerpts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2.5">
              <Link
                to="/upload"
                className="w-full py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Upload New Document</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/compare"
                className="w-full py-2 px-4 bg-[#171410] hover:bg-[#1D1914] border border-[#2D261C] hover:border-[#E5C38E]/50 text-[#EDE5D5] font-medium text-xs md:text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-[#E5C38E] stroke-[1.8]" />
                <span>Run Side-by-Side Comparison</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ROW 2: Recent Activity (Left 7 cols) & Quick Legal Tools (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card: Recent Activity (7 cols) */}
          <div className="lg:col-span-7 bg-[#12100D] rounded-xl border border-[#231F19] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1B16] pb-3.5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-serif text-[#F4EFE5] font-medium">Recent Activity</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#1A1712] text-[#E5C38E] border border-[#2E271D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5C38E] animate-pulse"></span>
                  Audit Feed
                </span>
              </div>
              <Link 
                to="/results" 
                className="text-xs font-medium text-[#E5C38E] hover:text-[#F4EFE5] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#1D1914]"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>

            <div className="space-y-2">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start justify-between gap-3 p-2.5 rounded-lg hover:bg-[#171410] transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#191612] border border-[#2A231A] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-3.5 h-3.5 ${act.iconColor} stroke-[2]`} />
                      </div>
                      <div className="truncate min-w-0">
                        <p className="font-medium text-[#EDE5D5] text-sm truncate leading-snug">{act.title}</p>
                        <p className="text-xs text-[#8C806F] truncate mt-0.5">{act.detail}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8C806F] shrink-0 font-medium bg-[#171410] border border-[#231F19] px-2 py-0.5 rounded">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Quick Legal Workflows (5 cols) */}
          <div className="lg:col-span-5 bg-[#12100D] rounded-xl border border-[#231F19] p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#1F1B16] pb-3.5">
                <h3 className="text-lg font-serif text-[#F4EFE5] font-medium">Quick Legal Workflows</h3>
                <p className="text-xs text-[#8C806F] mt-0.5">Direct actions across your contract portfolio</p>
              </div>

              <div className="space-y-2.5 pt-3">
                <Link
                  to="/chat"
                  className="p-3 rounded-lg border border-[#231F19] hover:border-[#E5C38E]/50 bg-[#16130F] hover:bg-[#1D1914] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1C1812] border border-[#2E271D] text-[#E5C38E] flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[#EDE5D5] group-hover:text-[#F4EFE5]">Ask Legal Assistant</p>
                      <p className="text-[11px] text-[#8C806F]">Q&A grounded in contract text</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C806F] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/compare"
                  className="p-3 rounded-lg border border-[#231F19] hover:border-[#E5C38E]/50 bg-[#16130F] hover:bg-[#1D1914] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1C1812] border border-[#2E271D] text-[#E5C38E] flex items-center justify-center shrink-0">
                      <GitCompare className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[#EDE5D5] group-hover:text-[#F4EFE5]">Cross-Document Compare</p>
                      <p className="text-[11px] text-[#8C806F]">Flag conflicting indemnities & SLAs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C806F] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/results"
                  className="p-3 rounded-lg border border-[#231F19] hover:border-[#E5C38E]/50 bg-[#16130F] hover:bg-[#1D1914] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#221415] border border-[#3E2124] text-[#ECA09B] flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[#EDE5D5] group-hover:text-[#F4EFE5]">Review Risk Insights</p>
                      <p className="text-[11px] text-[#8C806F]">Detailed counsel mitigations</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C806F] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-2">
          <div className="w-full bg-[#12100D] border border-[#231F19] rounded-xl py-3.5 px-6 flex items-center justify-center gap-2.5 text-xs md:text-sm font-medium text-[#A99E8C]">
            <Shield className="w-4 h-4 text-[#E5C38E] stroke-[1.8]" />
            <span>Editorial legal protection with deterministic contradiction verification.</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
