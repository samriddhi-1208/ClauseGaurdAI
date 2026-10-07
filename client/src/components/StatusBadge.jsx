import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E7ECE7] text-[#2F4335] border border-[#D2DDD2]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5B8266]"></span>
        <span>Completed</span>
      </span>
    );
  }

  if (s === 'processing' || s === 'analyzing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E4ECF3] text-[#426179] border border-[#C9DBE8]">
        <Loader2 className="w-3 h-3 text-[#6B8BA4] animate-spin shrink-0" />
        <span>{s === 'analyzing' ? 'Analyzing' : 'Processing'}</span>
      </span>
    );
  }

  if (s === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAEDE7] text-[#8C523D] border border-[#F5D5C9]">
        <Clock className="w-3 h-3 text-[#DF8F75] shrink-0" />
        <span>Uploaded</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FDF3F2] text-[#C25450] border border-[#F8D1CE]">
      <AlertCircle className="w-3 h-3 text-[#C25450] shrink-0" />
      <span>Failed</span>
    </span>
  );
};

export default StatusBadge;
