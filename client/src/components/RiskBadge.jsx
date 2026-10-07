import React from 'react';
import { AlertTriangle, Check, AlertCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = (riskLevel || '').toUpperCase();
  
  if (level === 'HIGH' || classification === 'POTENTIAL_CONTRADICTION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F9DFDE] text-[#B5413D] border border-[#F2CAC8]">
        <AlertCircle className="w-3.5 h-3.5 stroke-[2] shrink-0" />
        <span>{compact ? 'High Risk' : 'Potential Contradiction (High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classification === 'POTENTIAL_INCONSISTENCY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FDF0DD] text-[#9C6A28] border border-[#F5DFBF]">
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2] shrink-0" />
        <span>{compact ? 'Medium Risk' : 'Potential Inconsistency (Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classification === 'NO_SIGNIFICANT_CONFLICT') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E2ECE3] text-[#2F5236] border border-[#CADBCC]">
        <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
        <span>{compact ? 'Low Risk' : 'Compatible Terms (Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5]">
      <AlertTriangle className="w-3.5 h-3.5 stroke-[2] shrink-0" />
      <span>Review Needed</span>
    </span>
  );
};

export default RiskBadge;
