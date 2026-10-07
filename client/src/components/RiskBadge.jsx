import React from 'react';
import { AlertTriangle, Check, AlertCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = String(riskLevel || '').toUpperCase();
  const classStr = String(classification || '').toUpperCase();
  
  if (level === 'HIGH' || classStr === 'POTENTIAL_CONTRADICTION' || level.includes('HIGH')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF0F0] text-[#B5413D] border border-[#F2CAC8] shadow-2xs">
        <AlertCircle className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
        <span>{compact ? 'High Risk' : 'Potential Contradiction (High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classStr === 'POTENTIAL_INCONSISTENCY' || level.includes('MED')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF1ED] text-[#9C6A28] border border-[#EDD5CA] shadow-2xs">
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
        <span>{compact ? 'Medium Risk' : 'Potential Inconsistency (Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classStr === 'NO_SIGNIFICANT_CONFLICT' || level.includes('LOW')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EAF0E6] text-[#2F5236] border border-[#CADBCC] shadow-2xs">
        <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
        <span>{compact ? 'Low Risk' : 'Compatible Terms (Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EDE9DE] text-[#554734] border border-[#DDD6C5] shadow-2xs">
      <AlertTriangle className="w-3.5 h-3.5 stroke-[2] shrink-0" />
      <span>Review Needed</span>
    </span>
  );
};

export default RiskBadge;
