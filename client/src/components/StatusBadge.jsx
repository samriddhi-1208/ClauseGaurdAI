import React from 'react';
import { Check, Loader2, Clock, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#152319] text-[#98C7A3] border border-[#233B2B]">
        <Check className="w-3 h-3 stroke-[2.5]" />
        <span>Completed</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#1C1914] text-[#E5C38E] border border-[#3A3326]">
        <Loader2 className="w-3 h-3 animate-spin stroke-[2]" />
        <span>{s === 'analyzing' ? 'Analyzing' : 'Processing'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#171512] text-[#B9AE9A] border border-[#2C261F]">
        <Clock className="w-3 h-3 stroke-[2]" />
        <span>Uploaded</span>
      </span>
    );
  }

  if (s === 'issues found' || s === 'issues') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#231A10] text-[#E5B56E] border border-[#443118]">
        <AlertTriangle className="w-3 h-3 stroke-[2]" />
        <span>Issues Found</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#241314] text-[#ECA09B] border border-[#482325]">
      <AlertTriangle className="w-3 h-3 stroke-[2]" />
      <span>{status || 'Contradictions'}</span>
    </span>
  );
};

export default StatusBadge;

