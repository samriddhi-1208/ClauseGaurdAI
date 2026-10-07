import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ShieldAlert, 
  AlertTriangle,
  Clock, 
  ArrowRight, 
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  GitCompare,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { documentAPI, analysisAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      if (docRes.data.success) setDocuments(docRes.data.documents || []);
      if (anaRes.data.success) setAnalyses(anaRes.data.analyses || []);
    } catch (err) {
      console.error('[Dashboard Data Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Samriddhi';
  const totalDocuments = documents.length;
  const totalContradictions = analyses.reduce((acc, curr) => acc + (curr.totalFindings || 0), 0);
  
  // Calculate high-risk count
  const highRiskCount = analyses.reduce((acc, curr) => {
    if (!curr.findings) return acc;
    const highInAnalysis = curr.findings.filter(f => f.riskLevel === 'HIGH' || f.classification === 'POTENTIAL_CONTRADICTION').length;
    return acc + highInAnalysis;
  }, 0);

  const totalAnalyses = analyses.length;

  const getDocType = (fileName) => {
    if (!fileName) return 'PDF';
    const ext = fileName.split('.').pop().toUpperCase();
    return ['PDF', 'DOCX', 'TXT'].includes(ext) ? ext : 'PDF';
  };

  // Build clean recent activities
  const recentActivities = [];
  if (analyses.length > 0) {
    const latestAna = analyses[0];
    recentActivities.push({
      id: 'ana-1',
      title: 'Contradiction scan completed',
      detail: `${latestAna.totalFindings || 0} potential friction points detected across evaluated contracts.`,
      time: 'Recently',
      accent: 'bg-[#EDEAF3] text-[#6E6484]'
    });
  }
  if (documents.length > 0) {
    const doc1 = documents[0];
    recentActivities.push({
      id: 'doc-1',
      title: `Processed ${doc1.fileName}`,
      detail: `${doc1.totalClauses || 0} clauses extracted & indexed in vector memory.`,
      time: new Date(doc1.createdAt || Date.now()).toLocaleDateString(),
      accent: 'bg-[#E7ECE7] text-[#3D5745]'
    });
  }
  if (documents.length > 1) {
    const doc2 = documents[1];
    recentActivities.push({
      id: 'doc-2',
      title: `Added ${doc2.fileName}`,
      detail: `${doc2.totalPages || 1} page document validated and stored.`,
      time: new Date(doc2.createdAt || Date.now()).toLocaleDateString(),
      accent: 'bg-[#E4ECF3] text-[#426179]'
    });
  }
  if (recentActivities.length < 3) {
    recentActivities.push({
      id: 'init-1',
      title: 'Legal intelligence engine ready',
      detail: 'Semantic vector retrieval active for PDF, DOCX, and TXT files.',
      time: 'System',
      accent: 'bg-[#FAEDE7] text-[#8C523D]'
    });
  }

  return (
    <div className="flex-1 bg-[#FAF9F6] flex flex-col min-w-0 pb-16 font-sans text-[#1F2421]">
      <Navbar title="Dashboard" subtitle="Contract Analysis Overview" />

      <main className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1F2421] tracking-tight">
            Good morning, {userName}!
          </h1>
          <p className="text-sm text-[#7B847E] font-normal mt-1">
            Here's an overview of your contract analysis.
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Documents */}
          <div className="bg-white p-5 rounded-xl border border-[#E8E7E0] shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] hover:border-[#D2DDD2] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#606963]">Total Documents</span>
              <div className="w-7 h-7 rounded-lg bg-[#E4ECF3] text-[#426179] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1F2421] mt-2.5">{totalDocuments}</p>
            <p className="text-[11px] text-[#7B847E] font-normal mt-0.5">Active in repository</p>
          </div>

          {/* Card 2: Contradictions Found */}
          <div className="bg-white p-5 rounded-xl border border-[#E8E7E0] shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] hover:border-[#F8D1CE] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#606963]">Contradictions Found</span>
              <div className="w-7 h-7 rounded-lg bg-[#FDF3F2] text-[#C25450] flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1F2421] mt-2.5">{totalContradictions}</p>
            <p className="text-[11px] text-[#7B847E] font-normal mt-0.5">Cross-contract conflicts</p>
          </div>

          {/* Card 3: High Risk Clauses */}
          <div className="bg-white p-5 rounded-xl border border-[#E8E7E0] shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] hover:border-[#F5D5C9] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#606963]">High Risk Clauses</span>
              <div className="w-7 h-7 rounded-lg bg-[#FAEDE7] text-[#8C523D] flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1F2421] mt-2.5">{highRiskCount}</p>
            <p className="text-[11px] text-[#7B847E] font-normal mt-0.5">Requires legal review</p>
          </div>

          {/* Card 4: Analysis History */}
          <div className="bg-white p-5 rounded-xl border border-[#E8E7E0] shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] hover:border-[#DDD8E7] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#606963]">Analysis History</span>
              <div className="w-7 h-7 rounded-lg bg-[#EDEAF3] text-[#6E6484] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1F2421] mt-2.5">{totalAnalyses}</p>
            <p className="text-[11px] text-[#7B847E] font-normal mt-0.5">Completed scans</p>
          </div>

        </div>

        {/* Main Content: Simple Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (2 cols): Recent Documents */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E7E0] p-6 shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EFE8] pb-3.5">
              <h2 className="text-sm font-semibold text-[#1F2421]">Recent Documents</h2>
              <Link 
                to="/documents" 
                className="text-xs font-medium text-[#5B8266] hover:text-[#3D5745] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-[#7B847E] font-normal">
                Loading contracts...
              </div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-xs text-[#606963] font-medium">No documents uploaded yet</p>
                <p className="text-[11px] text-[#7B847E] font-normal max-w-xs mx-auto">
                  Upload your agreements to start detecting contradictions.
                </p>
                <div className="pt-2">
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5B8266] hover:bg-[#4D6F57] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 stroke-[1.75]" />
                    <span>Upload First Document</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#F0EFE8]">
                {documents.slice(0, 5).map((doc) => {
                  const docId = doc._id || doc.id;
                  const docType = getDocType(doc.fileName);
                  return (
                    <div 
                      key={docId} 
                      className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF9F6] px-2 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3 truncate min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F5F4EE] text-[#606963] border border-[#E8E7E0] shrink-0">
                          {docType}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-medium text-[#1F2421] truncate group-hover:text-[#3D5745] transition-colors">
                            {doc.fileName}
                          </p>
                          <p className="text-[11px] text-[#7B847E] font-normal">
                            {new Date(doc.createdAt || Date.now()).toLocaleDateString()} &bull; {doc.totalClauses || 0} clauses
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={doc.processingStatus} />
                        <Link
                          to={`/documents/${docId}`}
                          aria-label={`Inspect ${doc.fileName}`}
                          className="p-1 text-[#9BA39E] hover:text-[#1F2421] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[1.75]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (1 col): Contract Intelligence */}
          <div className="bg-white rounded-xl border border-[#E8E7E0] p-6 shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-[#1F2421]">Contract Intelligence</h2>
              <p className="text-xs text-[#606963] leading-relaxed font-normal">
                Analyze contracts, find risks, and detect contradictions.
              </p>
              
              <div className="pt-2 space-y-2">
                <Link
                  to="/upload"
                  className="w-full py-2.5 px-4 bg-[#5B8266] hover:bg-[#4D6F57] text-white font-medium text-xs rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 stroke-[1.75]" />
                  <span>Upload New Document</span>
                </Link>

                <Link
                  to="/compare"
                  className="w-full py-2 px-4 bg-[#F5F4EE] hover:bg-[#EBEAE3] text-[#2E3430] font-medium text-xs rounded-xl border border-[#E8E7E0] transition-colors flex items-center justify-center gap-2"
                >
                  <GitCompare className="w-3.5 h-3.5 stroke-[1.75] text-[#5B8266]" />
                  <span>Compare Contracts</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0EFE8] flex items-center gap-2 text-[11px] text-[#7B847E]">
              <Sparkles className="w-3.5 h-3.5 text-[#5B8266] shrink-0 stroke-[1.75]" />
              <span>Grounded clause comparison active</span>
            </div>
          </div>

        </div>

        {/* Section 5: Recent Activity (3-4 items) */}
        <div className="bg-white rounded-xl border border-[#E8E7E0] p-6 shadow-[0_1px_3px_0_rgba(31,36,33,0.03)] space-y-4">
          <div className="border-b border-[#F0EFE8] pb-3">
            <h2 className="text-sm font-semibold text-[#1F2421]">Recent Activity</h2>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#5B8266]`}></div>
                  <div>
                    <p className="font-medium text-[#1F2421]">{act.title}</p>
                    <p className="text-[11px] text-[#7B847E] font-normal mt-0.5">{act.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#9BA39E] shrink-0 font-normal">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Subtle Bottom Quote Banner */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#7B847E] font-normal tracking-wide">
            Better contracts. Stronger partnerships.
          </p>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
