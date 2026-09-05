import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Brain, 
  GitCompare, 
  ShieldAlert, 
  Plus, 
  Zap, 
  Clock, 
  ChevronRight,
  AlertTriangle,
  UploadCloud,
  MessageSquare,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import RiskBadge from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { documentAPI, analysisAPI, demoAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
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

  const handleRunDemo = async () => {
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Seed Error]', err);
      alert('Could not seed demo contracts.');
    } finally {
      setSeeding(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Samriddhi';
  const totalClauses = documents.reduce((acc, curr) => acc + (curr.totalClauses || 0), 0);
  const totalFindings = analyses.reduce((acc, curr) => acc + (curr.totalFindings || 0), 0);

  return (
    <div className="flex-1 bg-[#090D16] flex flex-col min-w-0 pb-12 font-sans text-slate-100">
      <Navbar title="Dashboard Overview" subtitle="Real-time status of legal contract library & contradiction intelligence" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131C31] p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Good afternoon, {userName} 👋
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Legal document workspace status, cross-document analysis & risk detection summary
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{seeding ? 'Loading Demo...' : '⚡ Instant Demo Mode'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Compact Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-800 shadow-sm hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Documents</span>
              <div className="w-9 h-9 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">{documents.length}</h3>
            <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active contract library</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Clauses Extracted</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">{totalClauses}</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Categorized legal terms</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#131C31] p-5 rounded-2xl border border-slate-800 shadow-sm hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Findings</span>
              <div className="w-9 h-9 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">{totalFindings}</h3>
            <p className="text-xs text-amber-400 font-bold mt-1">Requires review</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-red-950/30 p-5 rounded-2xl border border-red-900/60 shadow-sm hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">High Risk Clashes</span>
              <div className="w-9 h-9 rounded-xl bg-red-900/60 text-red-300 border border-red-700/60 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-red-400 mt-2">
              {analyses.reduce((acc, a) => acc + (a.totalFindings || 0), 0)}
            </h3>
            <p className="text-xs text-red-400 font-bold mt-1">Action items</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/upload"
              className="bg-[#131C31] p-3.5 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-[#1A2642] transition-all flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/60">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">Upload Contract</h4>
                <p className="text-[11px] text-slate-400 font-medium">Add PDF or TXT file</p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="bg-[#131C31] p-3.5 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-[#1A2642] transition-all flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/60">
                <GitCompare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">Compare Contracts</h4>
                <p className="text-[11px] text-slate-400 font-medium">Cross-document scan</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="bg-[#131C31] p-3.5 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-[#1A2642] transition-all flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">Ask AI Assistant</h4>
                <p className="text-[11px] text-slate-400 font-medium">Grounded RAG Q&A</p>
              </div>
            </Link>

            <Link
              to="/results"
              className="bg-[#131C31] p-3.5 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-[#1A2642] transition-all flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/60">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors">View Risk Findings</h4>
                <p className="text-[11px] text-slate-400 font-medium">Side-by-side evidence</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Table: Recent Contracts (2 cols) */}
          <div className="lg:col-span-2 bg-[#131C31] rounded-2xl border border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white">Recently Uploaded Contracts</h3>
                <p className="text-xs text-slate-400 font-medium">Extracted clauses & current processing status</p>
              </div>
              <Link to="/documents" className="text-xs font-extrabold text-blue-400 hover:underline flex items-center gap-1">
                <span>View All ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-400 text-xs font-bold">Loading contracts...</div>
            ) : documents.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-400">No legal documents uploaded yet.</p>
                <button
                  onClick={handleRunDemo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs"
                >
                  ⚡ Load Demo Contracts
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0D1322] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Contract Name</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Pages</th>
                      <th className="py-2.5 px-3">Clauses</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {documents.slice(0, 5).map((doc) => {
                      const docId = doc._id || doc.id;
                      return (
                        <tr key={docId} className="hover:bg-[#1A2642] transition-colors">
                          <td className="py-3 px-3 font-extrabold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{doc.fileName}</span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={doc.processingStatus} />
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-300">{doc.totalPages || 1}</td>
                          <td className="py-3 px-3 font-bold text-slate-300">{doc.totalClauses || 0} clauses</td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to={`/documents/${docId}`}
                              className="text-xs font-extrabold text-blue-400 hover:underline"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Card: Category Breakdown (1 col) */}
          <div className="bg-[#131C31] rounded-2xl border border-slate-800 shadow-sm p-5 space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-white">Category Breakdown</h3>
              <p className="text-xs text-slate-400 font-medium">Extracted clause distribution</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-extrabold text-white mb-1">
                  <span>Data Retention & Privacy</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-white mb-1">
                  <span>Payment & Invoicing</span>
                  <span>30%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-white mb-1">
                  <span>Confidentiality & NDA</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-white mb-1">
                  <span>Termination & Liability</span>
                  <span>10%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">Risk Severity Score</span>
              <span className="px-2.5 py-0.5 bg-red-950 text-red-300 rounded-full text-[10px] font-extrabold border border-red-700">
                🔴 High Attention
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
