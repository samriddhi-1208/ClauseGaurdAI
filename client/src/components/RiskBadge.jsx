import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = (riskLevel || '').toUpperCase();
  
  if (level === 'HIGH' || classification === 'POTENTIAL_CONTRADICTION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>{compact ? 'High Risk' : 'Potential Contradiction (High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classification === 'POTENTIAL_INCONSISTENCY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{compact ? 'Medium Risk' : 'Potential Inconsistency (Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classification === 'NO_SIGNIFICANT_CONFLICT') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{compact ? 'Low Risk' : 'Compatible Terms (Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span>Uncertain Risk</span>
    </span>
  );
};

export default RiskBadge;
