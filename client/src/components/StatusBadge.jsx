import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertOctagon } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Completed 🟢</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-brand border border-blue-200">
        <Loader2 className="w-3.5 h-3.5 text-brand animate-spin" />
        <span>{s === 'analyzing' ? 'Analyzing 🔵' : 'Processing 🔵'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Uploaded 🟡</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
      <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
      <span>Failed 🔴</span>
    </span>
  );
};

export default StatusBadge;
