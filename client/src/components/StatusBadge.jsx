import React from 'react';
import { Check, Loader2, Clock, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E2ECE3] text-[#2F5236] border border-[#CADBCC]">
        <Check className="w-3 h-3 stroke-[2.5]" />
        <span>Completed</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D8E4EE] text-[#35536D] border border-[#BDD2E2]">
        <Loader2 className="w-3 h-3 animate-spin stroke-[2]" />
        <span>{s === 'analyzing' ? 'Analyzing' : 'Processing'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDE9DE] text-[#685F4D] border border-[#DDD6C5]">
        <Clock className="w-3 h-3 stroke-[2]" />
        <span>Uploaded</span>
      </span>
    );
  }

  if (s === 'issues found' || s === 'issues') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDF0DD] text-[#9C6A28] border border-[#F5DFBF]">
        <AlertTriangle className="w-3 h-3 stroke-[2]" />
        <span>Issues Found</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F9DFDE] text-[#B5413D] border border-[#F2CAC8]">
      <AlertTriangle className="w-3 h-3 stroke-[2]" />
      <span>{status || 'Contradictions'}</span>
    </span>
  );
};

export default StatusBadge;
