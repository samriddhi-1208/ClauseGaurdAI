import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
        <span>Completed</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-950/40 text-blue-300 border border-blue-800/50">
        <Loader2 className="w-3 h-3 text-blue-400 animate-spin shrink-0" />
        <span>{s === 'analyzing' ? 'Analyzing' : 'Processing'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/50">
        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
        <span>Uploaded</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-800/50">
      <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
      <span>Failed</span>
    </span>
  );
};

export default StatusBadge;
