import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Brain, 
  GitCompare, 
  ShieldAlert, 
  Plus, 
  Zap, 
  ChevronRight,
  AlertTriangle,
  UploadCloud,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Scale
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

  const userName = user?.name ? user.name.split(' ')[0] : 'Counsel';
  const totalClauses = documents.reduce((acc, curr) => acc + (curr.totalClauses || 0), 0);
  const totalFindings = analyses.reduce((acc, curr) => acc + (curr.totalFindings || 0), 0);

  return (
    <div className="flex-1 bg-[#090D16] flex flex-col min-w-0 pb-12 font-sans text-slate-100">
      <Navbar title="Dashboard Overview" subtitle="Real-time status of legal contract repository & contradiction analysis" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Good afternoon, {userName}
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Legal contract intelligence, clause extractions, and cross-document contradiction detection summary
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/60 font-medium text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{seeding ? 'Loading Demo...' : 'Instant Demo Mode'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Documents</span>
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{documents.length}</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Repository contracts</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Extracted Clauses</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{totalClauses}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Indexed in vector memory</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Analyses Run</span>
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                <GitCompare className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{analyses.length}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Cross-document scans</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Potential Conflicts</span>
              <div className="w-8 h-8 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/60 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-rose-400 mt-2">{totalFindings}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Findings requiring review</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Workflows</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/upload"
              className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 hover:border-blue-600/60 hover:bg-[#162032] transition-colors flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/60">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">Upload Contract</h4>
                <p className="text-[11px] text-slate-400 font-normal">PDF, DOCX, or TXT</p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 hover:border-blue-600/60 hover:bg-[#162032] transition-colors flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/60">
                <GitCompare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">Compare Contracts</h4>
                <p className="text-[11px] text-slate-400 font-normal">Cross-document scan</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 hover:border-blue-600/60 hover:bg-[#162032] transition-colors flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">AI Legal Assistant</h4>
                <p className="text-[11px] text-slate-400 font-normal">Grounded RAG retrieval</p>
              </div>
            </Link>

            <Link
              to="/results"
              className="bg-[#111827] p-3.5 rounded-xl border border-slate-800 hover:border-blue-600/60 hover:bg-[#162032] transition-colors flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/60">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">Risk Findings</h4>
                <p className="text-[11px] text-slate-400 font-normal">Evidence and rationale</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Table: Recent Contracts (2 cols) */}
          <div className="lg:col-span-2 bg-[#111827] rounded-xl border border-slate-800 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-white">Recently Uploaded Contracts</h3>
                <p className="text-xs text-slate-400 font-normal">Contract metadata & clause extraction status</p>
              </div>
              <Link to="/documents" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
                <span>View Library ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-normal">Loading contract repository...</div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Your document library is empty</h4>
                <p className="text-xs text-slate-400 font-normal max-w-sm mx-auto">
                  Upload contracts (PDF, DOCX, TXT) to begin automated clause extraction and contradiction analysis.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to="/upload"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    Upload Contract
                  </Link>
                  <button
                    onClick={handleRunDemo}
                    className="px-4 py-2 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/60 font-medium text-xs rounded-lg transition-colors"
                  >
                    Load Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0B101D] text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Contract Name</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Pages</th>
                      <th className="py-2.5 px-3">Clauses</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {documents.slice(0, 5).map((doc) => {
                      const docId = doc._id || doc.id;
                      return (
                        <tr key={docId} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{doc.fileName}</span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={doc.processingStatus} />
                          </td>
                          <td className="py-3 px-3 text-slate-300 font-normal">{doc.totalPages || 1}</td>
                          <td className="py-3 px-3 text-slate-300 font-normal">{doc.totalClauses || 0}</td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to={`/documents/${docId}`}
                              className="text-xs font-semibold text-blue-400 hover:underline"
                            >
                              Inspect
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

          {/* Right Card: Risk & Category Summary (1 col) */}
          <div className="bg-[#111827] rounded-xl border border-slate-800 shadow-xs p-5 space-y-5">
            <div>
              <h3 className="font-semibold text-sm text-white">Analysis Risk Distribution</h3>
              <p className="text-xs text-slate-400 font-normal">Cross-document contradiction breakdown</p>
            </div>

            {totalFindings === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Scale className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-normal">No cross-document conflicts detected yet.</p>
                <Link
                  to="/compare"
                  className="inline-block text-xs font-semibold text-blue-400 hover:underline"
                >
                  Run comparison scan &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-white mb-1">
                    <span className="text-rose-300">High Risk Contradictions</span>
                    <span>{analyses.reduce((acc, a) => acc + (a.totalFindings || 0), 0)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-white mb-1">
                    <span className="text-amber-300">Potential Inconsistencies</span>
                    <span>1</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-white mb-1">
                    <span className="text-emerald-300">Compatible Clauses</span>
                    <span>{Math.max(0, totalClauses - totalFindings)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Review Status</span>
              <span className="px-2.5 py-0.5 bg-rose-950/50 text-rose-300 rounded-md text-xs font-medium border border-rose-800/60">
                Action Required
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
