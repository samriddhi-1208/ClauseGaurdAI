import React, { useState } from 'react';
import { Bell, AlertTriangle, Check, Clock, X } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'High Risk Contradiction Detected',
    message: 'Data Retention period mismatch found between Vendor Agreement (5 yrs) and NDA (2 yrs).',
    time: '10m ago',
    type: 'risk'
  },
  {
    id: 2,
    title: 'Contract Processing Complete',
    message: 'Service_Level_Agreement.pdf processed into 8 categorized clauses.',
    time: '1h ago',
    type: 'success'
  },
  {
    id: 3,
    title: 'Inconsistency Alert',
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
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-[#14120E] rounded-2xl shadow-2xl border border-[#2B251B] z-50 overflow-hidden font-sans text-[#EDE5D5]">
      <div className="px-4 py-3 bg-[#181612] border-b border-[#24201A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#E5C38E] stroke-[2]" />
          <h4 className="font-serif font-bold text-xs text-[#F8F6F0]">Notifications ({notifications.length})</h4>
        </div>
        <button 
          onClick={onClose} 
          aria-label="Close notifications" 
          className="text-[#8C806F] hover:text-[#EDE5D5] transition-colors p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      <div className="divide-y divide-[#221D16] max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8C806F] font-normal">
            No unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3.5 hover:bg-[#1D1A15] transition-colors flex items-start justify-between gap-3 group">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'risk' 
                    ? 'bg-[#2B1716] text-[#E58882] border border-[#482523]' 
                    : n.type === 'warning' 
                    ? 'bg-[#2B2214] text-[#E5C38E] border border-[#4A3B20]' 
                    : 'bg-[#18261C] text-[#86B392] border border-[#263D2E]'
                }`}>
                  {n.type === 'risk' && <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />}
                  {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 stroke-[2]" />}
                  {n.type === 'success' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#F8F6F0] leading-snug">{n.title}</p>
                  <p className="text-[11px] text-[#A89E8D] font-normal mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-[#8C806F] mt-1 block">{n.time}</span>
                </div>
              </div>

              <button 
                onClick={() => dismiss(n.id)}
                className="text-[#8C806F] hover:text-[#E58882] p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                title="Dismiss"
              >
                <X className="w-3 h-3 stroke-[2]" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
