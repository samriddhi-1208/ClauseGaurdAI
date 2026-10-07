import React from 'react';
import { AlertTriangle, Check, AlertCircle } from 'lucide-react';

const RiskBadge = ({ riskLevel, classification, compact = false }) => {
  const level = String(riskLevel || '').toUpperCase();
  const classStr = String(classification || '').toUpperCase();
  
  if (level === 'HIGH' || classStr === 'POTENTIAL_CONTRADICTION' || level.includes('HIGH')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#241314] text-[#ECA09B] border border-[#482325]">
        <AlertCircle className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
        <span>{compact ? 'High Risk' : 'Potential Contradiction (High Risk)'}</span>
      </span>
    );
  }
  
  if (level === 'MEDIUM' || classStr === 'POTENTIAL_INCONSISTENCY' || level.includes('MED')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#231A10] text-[#E5B56E] border border-[#443118]">
        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
        <span>{compact ? 'Medium Risk' : 'Potential Inconsistency (Medium Risk)'}</span>
      </span>
    );
  }

  if (level === 'LOW' || classStr === 'NO_SIGNIFICANT_CONFLICT' || level.includes('LOW')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#152319] text-[#98C7A3] border border-[#233B2B]">
        <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
        <span>{compact ? 'Low Risk' : 'Compatible Terms (Low Risk)'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#1C1914] text-[#E5C38E] border border-[#3A3326]">
      <AlertTriangle className="w-3.5 h-3.5 stroke-[2] shrink-0" />
      <span>Review Needed</span>
    </span>
  );
};

export default RiskBadge;

