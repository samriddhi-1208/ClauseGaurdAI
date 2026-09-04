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
  TrendingUp,
  ArrowRight
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
    <div className="flex-1 bg-[#F8FAFC] flex flex-col min-w-0 pb-12 font-sans">
      <Navbar title="Dashboard Overview" subtitle="Real-time status of legal contract library & contradiction intelligence" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
              Good afternoon, {userName} 👋
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Legal document workspace status, cross-document analysis & risk detection summary
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{seeding ? 'Loading Demo...' : '⚡ Instant Demo Mode'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Compact Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Documents</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">{documents.length}</h3>
            <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active contract library</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Clauses Extracted</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">{totalClauses}</h3>
            <p className="text-xs text-slate-600 font-bold mt-1">Categorized legal terms</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Findings</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A] mt-2">{totalFindings}</h3>
            <p className="text-xs text-amber-700 font-bold mt-1">Requires review</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 shadow-xs hover:border-red-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-red-700 uppercase tracking-wider">High Risk Clashes</span>
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-[#DC2626] mt-2">
              {analyses.reduce((acc, a) => acc + (a.totalFindings || 0), 0)}
            </h3>
            <p className="text-xs text-red-700 font-bold mt-1">Action items</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/upload"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition-colors">Upload Contract</h4>
                <p className="text-[11px] text-slate-500 font-medium">Add PDF or TXT file</p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <GitCompare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition-colors">Compare Contracts</h4>
                <p className="text-[11px] text-slate-500 font-medium">Cross-document scan</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition-colors">Ask AI Assistant</h4>
                <p className="text-[11px] text-slate-500 font-medium">Grounded RAG Q&A</p>
              </div>
            </Link>

            <Link
              to="/results"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition-colors">View Risk Findings</h4>
                <p className="text-[11px] text-slate-500 font-medium">Side-by-side evidence</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Table: Recent Contracts (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#0F172A]">Recently Uploaded Contracts</h3>
                <p className="text-xs text-slate-500 font-medium">Extracted clauses & current processing status</p>
              </div>
              <Link to="/documents" className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1">
                <span>View All ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-500 text-xs font-bold">Loading contracts...</div>
            ) : documents.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No legal documents uploaded yet.</p>
                <button
                  onClick={handleRunDemo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs"
                >
                  ⚡ Load Demo Contracts
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Contract Name</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Pages</th>
                      <th className="py-2.5 px-3">Clauses</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.slice(0, 5).map((doc) => {
                      const docId = doc._id || doc.id;
                      return (
                        <tr key={docId} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-extrabold text-[#0F172A] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate max-w-[200px]">{doc.fileName}</span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={doc.processingStatus} />
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-600">{doc.totalPages || 1}</td>
                          <td className="py-3 px-3 font-bold text-slate-600">{doc.totalClauses || 0} clauses</td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to={`/documents/${docId}`}
                              className="text-xs font-extrabold text-blue-600 hover:underline"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">Category Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Extracted clause distribution</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-extrabold text-[#0F172A] mb-1">
                  <span>Data Retention & Privacy</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-[#0F172A] mb-1">
                  <span>Payment & Invoicing</span>
                  <span>30%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-[#0F172A] mb-1">
                  <span>Confidentiality & NDA</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-extrabold text-[#0F172A] mb-1">
                  <span>Termination & Liability</span>
                  <span>10%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0F172A]">Risk Severity Score</span>
              <span className="px-2.5 py-0.5 bg-red-50 text-[#DC2626] rounded-full text-[10px] font-extrabold border border-[#EF4444]">
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
