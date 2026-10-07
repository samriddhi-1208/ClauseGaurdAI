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
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-dropdown border border-[#DDDCD3] z-50 overflow-hidden font-sans text-[#18231C]">
      <div className="px-4 py-3 bg-[#F8F7F2] border-b border-[#E8E6DC] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#3F6149] stroke-[2]" />
          <h4 className="font-semibold text-xs text-[#18231C]">Notifications ({notifications.length})</h4>
        </div>
        <button 
          onClick={onClose} 
          aria-label="Close notifications" 
          className="text-[#6B736D] hover:text-[#18231C] transition-colors p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      <div className="divide-y divide-[#F1EFE8] max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6B736D] font-normal">
            No unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3.5 hover:bg-[#FAF9F5] transition-colors flex items-start justify-between gap-3 group">
              <div className="flex items-start gap-2.5">
                {n.type === 'risk' && (
                  <div className="w-6 h-6 rounded-full bg-[#F9DFDE] text-[#B5413D] flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 stroke-[2]" />
                  </div>
                )}
                {n.type === 'success' && (
                  <div className="w-6 h-6 rounded-full bg-[#E2ECE3] text-[#2F5236] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
                {n.type === 'warning' && (
                  <div className="w-6 h-6 rounded-full bg-[#FDF0DD] text-[#9C6A28] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 stroke-[2]" />
                  </div>
                )}
                <div>
                  <h5 className="font-semibold text-xs text-[#18231C]">{n.title}</h5>
                  <p className="text-[11px] text-[#5A665D] font-normal mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-[#8C948C] font-normal block mt-1">{n.time}</span>
                </div>
              </div>

              <button
                onClick={() => dismiss(n.id)}
                aria-label={`Dismiss notification: ${n.title}`}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#8C948C] hover:text-[#18231C] rounded transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-[#F8F7F2] border-t border-[#E8E6DC] text-center">
        <button
          onClick={() => setNotifications([])}
          className="text-[11px] font-semibold text-[#3F6149] hover:text-[#273C2D] transition-colors"
        >
          Clear all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
