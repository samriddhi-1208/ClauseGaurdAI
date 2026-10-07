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
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-16 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title="Workspace Settings" subtitle="Configure legal contradiction thresholds, AI reasoning model, and vector indexing" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        <form onSubmit={handleSave} className="space-y-6">
          {saved && (
            <div className="p-3.5 bg-[#152319] border border-[#233B2B] rounded-lg flex items-center gap-2.5 text-xs text-[#98C7A3]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Settings and AI parameters updated successfully.</span>
            </div>
          )}

          {/* AI Intelligence Engine Settings */}
          <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#1F1B16] pb-4">
              <div className="w-9 h-9 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-base font-serif text-[#F4EFE5]">AI Intelligence Engine</h2>
                <p className="text-xs text-[#8C806F]">Configure Google Gemini reasoning behavior for clause extraction</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Primary LLM Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/70"
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Fast, high-throughput legal reasoning)</option>
                  <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep complex statutory synthesis)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Contradiction Detection Sensitivity</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSensitivity('strict')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      sensitivity === 'strict'
                        ? 'bg-[#1C1812] border-[#E5C38E]/60 text-[#F4EFE5]'
                        : 'bg-[#16130F] border-[#231F19] text-[#8C806F] hover:border-[#383127]'
                    }`}
                  >
                    <p className="text-xs font-medium">Strict (High Recall)</p>
                    <p className="text-[11px] text-[#8C806F] mt-0.5">Flags subtle date/numeric discrepancies</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSensitivity('balanced')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      sensitivity === 'balanced'
                        ? 'bg-[#1C1812] border-[#E5C38E]/60 text-[#F4EFE5]'
                        : 'bg-[#16130F] border-[#231F19] text-[#8C806F] hover:border-[#383127]'
                    }`}
                  >
                    <p className="text-xs font-medium">Balanced (Standard)</p>
                    <p className="text-[11px] text-[#8C806F] mt-0.5">Optimal for commercial Master Agreements</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSensitivity('permissive')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      sensitivity === 'permissive'
                        ? 'bg-[#1C1812] border-[#E5C38E]/60 text-[#F4EFE5]'
                        : 'bg-[#16130F] border-[#231F19] text-[#8C806F] hover:border-[#383127]'
                    }`}
                  >
                    <p className="text-xs font-medium">Permissive</p>
                    <p className="text-[11px] text-[#8C806F] mt-0.5">Flags only direct legal contradictions</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vector Memory & Embeddings */}
          <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#1F1B16] pb-4">
              <div className="w-9 h-9 rounded-lg bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-base font-serif text-[#F4EFE5]">Vector Database & Retrieval</h2>
                <p className="text-xs text-[#8C806F]">ChromaDB vector persistence and semantic search indexing</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-[#EDE5D5]">Automatic Semantic Vector Indexing</p>
                <p className="text-[11px] text-[#8C806F] mt-0.5">Embed uploaded contract clauses immediately upon file upload</p>
              </div>
              <input
                type="checkbox"
                checked={autoVectorize}
                onChange={(e) => setAutoVectorize(e.target.checked)}
                className="w-4 h-4 accent-[#E5C38E] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
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
