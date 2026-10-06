import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = (riskLevel || '').toUpperCase();
  
  if (level === 'HIGH' || classification === 'POTENTIAL_CONTRADICTION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950/50 text-rose-300 border border-rose-800/60 shadow-xs">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span>{compact ? 'High Risk' : 'Potential Contradiction (High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classification === 'POTENTIAL_INCONSISTENCY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/60 shadow-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{compact ? 'Medium Risk' : 'Potential Inconsistency (Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classification === 'NO_SIGNIFICANT_CONFLICT') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{compact ? 'Low Risk' : 'Compatible Terms (Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800/60 text-slate-300 border border-slate-700/60 shadow-xs">
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Uncertain Risk</span>
    </span>
  );
};

export default RiskBadge;
