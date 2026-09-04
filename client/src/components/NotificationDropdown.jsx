import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, FileText, Clock, X } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: '🔴 High Risk Contradiction Detected',
    message: 'Data Retention period mismatch found between Contract A (5 yrs) and Contract B (2 yrs).',
    time: '10m ago',
    type: 'risk'
  },
  {
    id: 2,
    title: '🟢 Contract Processing Complete',
    message: 'Sample_Contract_A_Enterprise.pdf processed into 2 categorized clauses.',
    time: '1h ago',
    type: 'success'
  },
  {
    id: 3,
    title: '🟡 Inconsistency Alert',
    message: 'Payment deadline difference (30 days vs 60 days) requires review.',
    time: '2h ago',
    type: 'warning'
  }
];

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  if (!isOpen) return null;

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand" />
          <h4 className="font-bold text-xs text-navy-900">Notifications ({notifications.length})</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-navy-900">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 group">
              <div className="flex items-start gap-2.5">
                {n.type === 'risk' && <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                {n.type === 'warning' && <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}

                <div>
                  <h5 className="font-bold text-xs text-navy-900 leading-tight">{n.title}</h5>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                </div>
              </div>

              <button
                onClick={() => dismiss(n.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <button
          onClick={() => setNotifications([])}
          className="text-[11px] font-bold text-brand hover:underline"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
