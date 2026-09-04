import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = (riskLevel || '').toUpperCase();
  
  if (level === 'HIGH' || classification === 'POTENTIAL_CONTRADICTION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#DC2626] border border-[#EF4444] shadow-2xs">
        <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
        <span>{compact ? '🔴 High Risk' : 'Potential Contradiction (🔴 High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classification === 'POTENTIAL_INCONSISTENCY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#D97706] border border-[#F59E0B] shadow-2xs">
        <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
        <span>{compact ? '🟠 Medium Risk' : 'Potential Inconsistency (🟠 Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classification === 'NO_SIGNIFICANT_CONFLICT') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#16A34A] border border-[#22C55E] shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
        <span>{compact ? '🟢 Low Risk' : 'Compatible Terms (🟢 Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
      <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>Uncertain Risk Status</span>
    </span>
  );
};

export default RiskBadge;
