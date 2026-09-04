import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Global Keyboard shortcut listener for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
        {/* Left Title & Subtitle */}
        <div>
          <h2 className="text-base font-extrabold text-[#0F172A] leading-tight tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 font-semibold">{subtitle}</p>}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0F172A] transition-all shadow-2xs group"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Search contracts, risks...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-extrabold text-slate-500">
              Ctrl K
            </kbd>
          </button>

          {/* Verification Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enterprise Verification Active</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-extrabold text-white shadow-sm border border-blue-400">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline text-xs font-extrabold text-[#0F172A]">
              {user?.name || 'Samriddhi'}
            </span>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
