import React, { useState } from 'react';
import { Sliders, Cpu, Database, FileText, Check, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

const SettingsPage = () => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [sensitivity, setSensitivity] = useState('strict');
  const [autoVectorize, setAutoVectorize] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Workspace Settings" subtitle="Configure legal contradiction thresholds, AI reasoning model, and vector indexing" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-3.5 bg-[#E2ECE3] border border-[#CADBCC] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#2F5236]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Settings and AI parameters updated successfully.</span>
            </div>
          )}

          {/* AI Intelligence Engine Settings */}
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-5">
            <div className="flex items-center gap-3 border-b border-[#ECEAE2] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#EAECE4] text-[#3F6149] flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#18231C]">AI Intelligence Engine</h2>
                <p className="text-xs text-[#5A665D]">Configure Google Gemini reasoning behavior for clause extraction</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Primary LLM Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] focus:outline-none focus:border-[#3F6149]"
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Fast, high-throughput legal reasoning)</option>
                  <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep complex statutory synthesis)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Contradiction Detection Sensitivity</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSensitivity('strict')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sensitivity === 'strict'
                        ? 'bg-[#EAECE4] border-[#3F6149] text-[#18231C]'
                        : 'bg-[#FAF9F5] border-[#DDDCD3] text-[#5A665D] hover:border-[#BFD1DF]'
                    }`}
                  >
                    <p className="text-xs font-semibold">Strict (High Recall)</p>
                    <p className="text-[11px] text-[#758177] mt-0.5">Flags subtle date/numeric discrepancies</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSensitivity('balanced')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sensitivity === 'balanced'
                        ? 'bg-[#EAECE4] border-[#3F6149] text-[#18231C]'
                        : 'bg-[#FAF9F5] border-[#DDDCD3] text-[#5A665D] hover:border-[#BFD1DF]'
                    }`}
                  >
                    <p className="text-xs font-semibold">Balanced (Standard)</p>
                    <p className="text-[11px] text-[#758177] mt-0.5">Optimal for commercial Master Agreements</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSensitivity('permissive')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sensitivity === 'permissive'
                        ? 'bg-[#EAECE4] border-[#3F6149] text-[#18231C]'
                        : 'bg-[#FAF9F5] border-[#DDDCD3] text-[#5A665D] hover:border-[#BFD1DF]'
                    }`}
                  >
                    <p className="text-xs font-semibold">Permissive</p>
                    <p className="text-[11px] text-[#758177] mt-0.5">Flags only direct legal contradictions</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vector Memory & Embeddings */}
          <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-5">
            <div className="flex items-center gap-3 border-b border-[#ECEAE2] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#D8E4EE] text-[#35536D] flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#18231C]">Vector Database & Retrieval</h2>
                <p className="text-xs text-[#5A665D]">ChromaDB vector persistence and semantic search indexing</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-semibold text-[#18231C]">Automatic Semantic Vector Indexing</p>
                <p className="text-[11px] text-[#5A665D] mt-0.5">Embed uploaded contract clauses immediately upon file upload</p>
              </div>
              <input
                type="checkbox"
                checked={autoVectorize}
                onChange={(e) => setAutoVectorize(e.target.checked)}
                className="w-4 h-4 accent-[#3F6149] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SettingsPage;
