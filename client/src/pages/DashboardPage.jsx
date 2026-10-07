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
    <div className="flex-1 bg-slate-50 flex flex-col min-w-0 pb-12 font-sans text-slate-900">
      <Navbar title="Dashboard Overview" subtitle="Real-time status of legal contract repository & contradiction analysis" />

      <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Good day, {userName}
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Legal contract intelligence, clause extractions, and cross-document contradiction detection overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemo}
              disabled={seeding}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg shadow-2xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{seeding ? 'Loading Demo...' : 'Instant Demo Mode'}</span>
            </button>

            <Link
              to="/upload"
              className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Contract</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Documents</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{documents.length}</h3>
            <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Repository contracts</span>
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Extracted Clauses</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{totalClauses}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Indexed in vector memory</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Analyses Run</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <GitCompare className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{analyses.length}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Cross-document scans</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Potential Conflicts</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-rose-600 mt-2">{totalFindings}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Findings requiring review</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operational Workflows</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/upload"
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">Upload Contract</h4>
                <p className="text-[11px] text-slate-500 font-normal">PDF, DOCX, or TXT</p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <GitCompare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">Compare Contracts</h4>
                <p className="text-[11px] text-slate-500 font-normal">Cross-document scan</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">AI Legal Assistant</h4>
                <p className="text-[11px] text-slate-500 font-normal">Grounded RAG retrieval</p>
              </div>
            </Link>

            <Link
              to="/results"
              className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all flex items-center gap-3 group shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">Risk Findings</h4>
                <p className="text-[11px] text-slate-500 font-normal">Evidence and rationale</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Dashboard 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Table: Recent Contracts (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Recently Uploaded Contracts</h3>
                <p className="text-xs text-slate-500 font-normal">Contract metadata & clause extraction status</p>
              </div>
              <Link to="/documents" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                <span>View Library ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs font-normal">Loading contract repository...</div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">Your document library is empty</h4>
                <p className="text-xs text-slate-500 font-normal max-w-sm mx-auto leading-relaxed">
                  Upload contracts (PDF, DOCX, TXT) to begin automated clause extraction and contradiction analysis.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to="/upload"
                    className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Upload Contract
                  </Link>
                  <button
                    onClick={handleRunDemo}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Load Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                        <tr key={docId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-medium text-slate-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[200px]">{doc.fileName}</span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={doc.processingStatus} />
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-normal">{doc.totalPages || 1}</td>
                          <td className="py-3 px-3 text-slate-600 font-normal">{doc.totalClauses || 0}</td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to={`/documents/${docId}`}
                              className="text-xs font-semibold text-blue-700 hover:underline"
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Analysis Risk Distribution</h3>
              <p className="text-xs text-slate-500 font-normal">Cross-document contradiction breakdown</p>
            </div>

            {totalFindings === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Scale className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-normal">No cross-document conflicts detected yet.</p>
                <Link
                  to="/compare"
                  className="inline-block text-xs font-semibold text-blue-700 hover:underline"
                >
                  Run comparison scan &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-slate-900 mb-1">
                    <span className="text-rose-700 font-medium">High Risk Contradictions</span>
                    <span>{analyses.reduce((acc, a) => acc + (a.totalFindings || 0), 0)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-900 mb-1">
                    <span className="text-amber-800 font-medium">Potential Inconsistencies</span>
                    <span>1</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-900 mb-1">
                    <span className="text-emerald-700 font-medium">Compatible Clauses</span>
                    <span>{Math.max(0, totalClauses - totalFindings)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Review Status</span>
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-md text-xs font-semibold border border-rose-200">
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
