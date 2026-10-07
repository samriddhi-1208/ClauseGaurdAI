import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Completed</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <Loader2 className="w-3 h-3 text-blue-600 animate-spin shrink-0" />
        <span>{s === 'analyzing' ? 'Analyzing' : 'Processing'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Uploaded</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
      <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
      <span>Failed</span>
    </span>
  );
};

export default StatusBadge;
