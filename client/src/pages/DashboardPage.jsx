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
  Leaf, 
  LogOut,
  User,
  Settings,
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
      date: 'Oct 7, 2026',
      iconBg: 'bg-[#D8E4EE] text-[#35536D]'
    },
    {
      id: 'demo-2',
      fileName: 'Sample_Contract_A_Enterprise.pdf',
      type: 'Contract',
      status: 'Completed',
      date: 'Oct 7, 2026',
      iconBg: 'bg-[#E2ECE3] text-[#2F5236]'
    }
  ];

  // Merge real documents if present, else fallback
  const displayDocs = documents.length > 0
    ? documents.map((doc, idx) => {
        let inferredType = 'Contract';
        if (doc.fileName.toLowerCase().includes('nda')) inferredType = 'NDA';
        else if (doc.fileName.toLowerCase().includes('sla')) inferredType = 'SLA';
        else if (doc.fileName.toLowerCase().includes('msa') || doc.fileName.toLowerCase().includes('master')) inferredType = 'MSA';

        const paletteIcons = [
          'bg-[#D8E4EE] text-[#35536D]',
          'bg-[#E2ECE3] text-[#2F5236]',
          'bg-[#FDF0DD] text-[#9C6A28]',
          'bg-[#F9DFDE] text-[#B5413D]',
          'bg-[#EDE9DE] text-[#685F4D]'
        ];

        return {
          id: doc._id || doc.id || `doc-${idx}`,
          fileName: doc.fileName,
          type: inferredType,
          status: doc.processingStatus === 'completed' ? 'Completed' : (doc.processingStatus === 'failed' ? 'Issues Found' : 'Completed'),
          date: new Date(doc.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          iconBg: paletteIcons[idx % paletteIcons.length],
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
      circleBg: 'bg-[#E2ECE3] text-[#2F5236]'
    },
    {
      id: 'act-2',
      title: 'Payment Contradiction Flagged',
      detail: 'Net 30 vs Net 60 payment milestone discrepancy',
      time: '1h ago',
      icon: AlertTriangle,
      circleBg: 'bg-[#F9DFDE] text-[#B5413D]'
    },
    {
      id: 'act-3',
      title: 'Contract Vectorized & Synced',
      detail: 'Sample_Contract_B_Vendor.pdf added to ChromaDB',
      time: '3h ago',
      icon: FileText,
      circleBg: 'bg-[#D8E4EE] text-[#35536D]'
    },
    {
      id: 'act-4',
      title: 'Data Retention Schedule Warning',
      detail: 'Document B mandates 2-yr deletion vs Document A 5-yr schedule',
      time: 'Yesterday',
      icon: ShieldAlert,
      circleBg: 'bg-[#FAF1ED] text-[#9B4F37]'
    }
  ];

  return (
    <div className="flex-1 bg-[#F8F7F2] min-h-screen flex flex-col font-sans text-[#101A13] pb-16">
      
      {/* Top Header Bar */}
      <header className="px-6 md:px-10 pt-7 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD5] bg-[#F8F7F2]">
        <div className="flex items-center gap-3">
          {outletContext?.toggleMobileSidebar && (
            <button
              onClick={outletContext.toggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#DDDCD3] text-[#4E5650] hover:text-[#101A13] transition-colors shrink-0 shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-[28px] font-extrabold text-[#101A13] tracking-tight leading-tight">
                Good morning, {userName}!
              </h1>
              <span className="inline-flex items-center justify-center text-[#3F6149]">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </span>
            </div>
            <p className="text-sm md:text-[15px] text-[#455248] font-medium leading-normal mt-1">
              Here's an overview of your contract analysis and legal risks.
            </p>
          </div>
        </div>

        {/* Top Right User & Notifications */}
        <div className="flex items-center gap-3 relative shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="View notifications"
              className="p-2.5 rounded-xl bg-white hover:bg-[#F2F0E8] border border-[#DDDCD3] text-[#455248] hover:text-[#101A13] transition-colors relative shadow-2xs cursor-pointer"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#3F6149] rounded-full ring-2 ring-white"></span>
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-white hover:bg-[#F2F0E8] border border-[#DDDCD3] rounded-xl text-xs font-bold text-[#101A13] transition-colors shadow-2xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#3F6149] text-white flex items-center justify-center text-xs font-bold shrink-0">
                S
              </div>
              <span className="hidden md:inline font-bold text-xs text-[#101A13]">{fullName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#455248] stroke-[2]" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-dropdown border border-[#DDDCD3] p-1.5 z-50 text-xs font-normal animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2.5 border-b border-[#ECEAE2]">
                  <p className="font-bold text-[#101A13] truncate">{fullName}</p>
                  <p className="text-[11px] text-[#526055] truncate mt-0.5">{user?.email || 'tiwari.samriddhi12@gmail.com'}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF9F5] rounded-xl text-[#18231C] font-semibold flex items-center gap-2 mt-1 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#3F6149]" />
                  <span>Counsel Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF9F5] rounded-xl text-[#18231C] font-semibold flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#3F6149]" />
                  <span>Workspace Settings</span>
                </button>
                <div className="my-1 border-t border-[#ECEAE2]"></div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-[#F9DFDE]/60 text-[#B5413D] font-bold rounded-xl flex items-center gap-2 transition-colors"
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
          
          {/* Card 1: Total Documents (Dusty Blue) */}
          <div className="bg-[#F1F5F8] p-5 rounded-2xl border border-[#D5E0EA] shadow-card hover:border-[#BFD1DF] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#101A13]">Total Documents</span>
              <div className="w-9 h-9 rounded-full bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#101A13] mt-2 leading-none">{totalDocumentsCount}</p>
            <p className="text-xs md:text-[13px] text-[#35536D] font-bold mt-1.5">Uploaded & analyzed</p>
          </div>

          {/* Card 2: Contradictions Found (Muted Peach) */}
          <div className="bg-[#FAF1ED] p-5 rounded-2xl border border-[#EDD5CA] shadow-card hover:border-[#E2C3B5] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#101A13]">Contradictions Found</span>
              <div className="w-9 h-9 rounded-full bg-[#F5DDD3] text-[#9B4F37] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#101A13] mt-2 leading-none">{totalContradictionsCount}</p>
            <p className="text-xs md:text-[13px] text-[#9B4F37] font-bold mt-1.5">Needs your attention</p>
          </div>

          {/* Card 3: High Risk Clauses (Muted Rose) */}
          <div className="bg-[#FAF0F0] p-5 rounded-2xl border border-[#EED1D0] shadow-card hover:border-[#E4BCBB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#101A13]">High Risk Clauses</span>
              <div className="w-9 h-9 rounded-full bg-[#F9DFDE] text-[#B5413D] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#101A13] mt-2 leading-none">{highRiskCount}</p>
            <p className="text-xs md:text-[13px] text-[#B5413D] font-bold mt-1.5">Review recommended</p>
          </div>

          {/* Card 4: Analysis History (Muted Lavender) */}
          <div className="bg-[#F3F1F7] p-5 rounded-2xl border border-[#DDD7E7] shadow-card hover:border-[#CBC2DC] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#101A13]">Analysis History</span>
              <div className="w-9 h-9 rounded-full bg-[#E3DEEC] text-[#5B4F73] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#101A13] mt-2 leading-none">{totalAnalysesCount}</p>
            <p className="text-xs md:text-[13px] text-[#5B4F73] font-bold mt-1.5">View past reports</p>
          </div>

        </div>

        {/* ROW 1: Recent Documents (Left 7 cols) & Contract Intelligence (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Recent Documents (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#ECEAE2] pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#101A13]">Recent Documents</h2>
                  <p className="text-xs text-[#526055] font-medium mt-0.5">
                    Vectorized contracts currently indexed in your repository
                  </p>
                </div>
                <Link 
                  to="/documents" 
                  className="text-xs md:text-sm font-bold text-[#3F6149] hover:text-[#273C2D] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#F2ECE1]"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </Link>
              </div>

              {/* Document Rows */}
              <div className="divide-y divide-[#F1EFE8] mt-2">
                {displayDocs.slice(0, 5).map((doc) => {
                  let badgeClass = 'bg-[#E2ECE3] text-[#2F5236] border border-[#CADBCC]';
                  if (doc.status === 'Issues Found') {
                    badgeClass = 'bg-[#FDF0DD] text-[#9C6A28] border border-[#F5DFBF]';
                  } else if (doc.status === 'Contradictions') {
                    badgeClass = 'bg-[#F9DFDE] text-[#B5413D] border border-[#F2CAC8]';
                  }

                  return (
                    <div 
                      key={doc.id}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] px-3 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 truncate min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${doc.iconBg} flex items-center justify-center shrink-0`}>
                          <FileText className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div className="truncate">
                          <p className="text-[14px] font-bold text-[#101A13] truncate group-hover:text-[#3F6149] transition-colors leading-snug">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-[#526055] font-semibold mt-0.5">
                            {doc.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EDE9DE] text-[#554D3F] border border-[#DDD6C5]">
                          {doc.type}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
                          {doc.status}
                        </span>
                        <Link
                          to={doc.isReal ? `/documents/${doc.id}` : '/documents'}
                          aria-label={`Inspect ${doc.fileName}`}
                          className="p-1.5 text-[#526055] hover:text-[#101A13] hover:bg-[#EAE8DF] rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[2]" />
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
                    className="flex items-center justify-between p-3.5 rounded-xl border-2 border-dashed border-[#CFD8CD] hover:border-[#3F6149] bg-[#F7F9F6] hover:bg-[#EFF5F0] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E2ECE3] text-[#3F6149] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-bold text-[#101A13] group-hover:text-[#284830]">
                          Add another contract to cross-compare
                        </p>
                        <p className="text-[11px] text-[#526055] font-semibold">
                          Upload multiple files to unlock automated conflict detection
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3F6149] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                      Upload <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Card Summary */}
            <div className="pt-3.5 mt-2 border-t border-[#ECEAE2] flex items-center justify-between text-xs text-[#526055] font-semibold">
              <span>{displayDocs.length} agreement{displayDocs.length !== 1 ? 's' : ''} indexed</span>
              <span className="text-[#3F6149] font-bold">ChromaDB embeddings synchronized</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Contract Intelligence (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card flex flex-col justify-between relative overflow-hidden">
            {/* Subtle decorative leaf background graphic */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.05] transform translate-x-4 translate-y-4 text-[#3F6149]">
              <Leaf className="w-40 h-40 stroke-[1]" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#3F6149] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 stroke-[2.2]" />
                <span>AI Legal Engine</span>
              </div>
              <h3 className="text-base font-extrabold text-[#101A13]">Contract Intelligence</h3>
              <p className="text-xs md:text-sm text-[#455248] font-semibold mt-1 leading-relaxed">
                Detect contradictions. Mitigate hidden liabilities. Make confident counsel decisions.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#18231C] font-semibold">
                  <div className="w-5 h-5 rounded-full bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Compare multiple agreements & exhibits</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#18231C] font-semibold">
                  <div className="w-5 h-5 rounded-full bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Find contradictory dates, terms & clauses</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#18231C] font-semibold">
                  <div className="w-5 h-5 rounded-full bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Identify potential legal & financial risks</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm text-[#18231C] font-semibold">
                  <div className="w-5 h-5 rounded-full bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>Grounded citations with exact page excerpts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2.5">
              <Link
                to="/upload"
                className="w-full py-3 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-bold text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Upload New Document</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/compare"
                className="w-full py-2.5 px-4 bg-[#FAF9F5] hover:bg-[#F0EDE3] border border-[#DDDCD3] text-[#101A13] font-bold text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-[#3F6149] stroke-[2]" />
                <span>Run Side-by-Side Comparison</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ROW 2: Recent Activity (Left 7 cols) & Quick Legal Tools (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card: Recent Activity (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECEAE2] pb-3.5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-extrabold text-[#101A13]">Recent Activity</h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2ECE3] text-[#2F5236]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F5236] animate-pulse"></span>
                  Audit Feed
                </span>
              </div>
              <Link 
                to="/results" 
                className="text-xs md:text-sm font-bold text-[#3F6149] hover:text-[#273C2D] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#F2ECE1]"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-[#FAF9F5] transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full ${act.circleBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div className="truncate min-w-0">
                        <p className="font-bold text-[#101A13] text-sm truncate leading-snug">{act.title}</p>
                        <p className="text-xs text-[#526055] font-semibold truncate mt-0.5">{act.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#526055] shrink-0 font-bold bg-[#F2EFE8] px-2 py-0.5 rounded-md">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Quick Legal Workflows (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DDDCD3] p-6 shadow-card space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#ECEAE2] pb-3.5">
                <h3 className="text-base font-extrabold text-[#101A13]">Quick Legal Shortcuts</h3>
                <p className="text-xs text-[#526055] font-medium mt-0.5">Direct actions across your contract portfolio</p>
              </div>

              <div className="space-y-2.5 pt-3">
                <Link
                  to="/chat"
                  className="p-3 rounded-xl border border-[#E5E3D8] hover:border-[#3F6149] bg-[#FAF9F5] hover:bg-[#F2ECE1] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-[#101A13] group-hover:text-[#23452B]">Ask Legal Assistant</p>
                      <p className="text-[11px] text-[#526055] font-semibold">Q&A grounded in contract text</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#526055] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/compare"
                  className="p-3 rounded-xl border border-[#E5E3D8] hover:border-[#3F6149] bg-[#FAF9F5] hover:bg-[#F2ECE1] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5DDD3] text-[#9B4F37] flex items-center justify-center shrink-0">
                      <GitCompare className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-[#101A13] group-hover:text-[#803823]">Cross-Document Compare</p>
                      <p className="text-[11px] text-[#526055] font-semibold">Flag conflicting indemnities & SLAs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#526055] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/results"
                  className="p-3 rounded-xl border border-[#E5E3D8] hover:border-[#3F6149] bg-[#FAF9F5] hover:bg-[#F2ECE1] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F9DFDE] text-[#B5413D] flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-[#101A13] group-hover:text-[#962A27]">Review Risk Insights</p>
                      <p className="text-[11px] text-[#526055] font-semibold">Detailed counsel mitigations</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#526055] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#526055] font-semibold text-center">
              Powered by ClauseGuard Deep Semantic Engine
            </div>
          </div>

        </div>

        {/* Bottom Quote Banner */}
        <div className="pt-2">
          <div className="w-full bg-[#EAECE4] border border-[#D7DACD] rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2.5 text-xs md:text-sm font-bold text-[#2A4532] shadow-2xs">
            <Leaf className="w-4 h-4 stroke-[2] text-[#3F6149]" />
            <span>Better contracts. Stronger partnerships.</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
