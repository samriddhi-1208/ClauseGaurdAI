import React, { useState, useEffect } from 'react';
import { Search, Bell, CheckCircle2 } from 'lucide-react';
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
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="h-16 bg-[#0B101D] border-b border-slate-800 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
        {/* Left Title & Subtitle */}
        <div className="truncate pr-4">
          <h2 className="text-base font-semibold text-white leading-tight tracking-tight truncate">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 font-normal truncate mt-0.5">{subtitle}</p>}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search contracts and findings"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors group"
          >
            <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Search contracts...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#0B101D] border border-slate-800 rounded text-[10px] font-mono text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* Verification Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/50 rounded-md text-xs font-medium text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grounded RAG Active</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Open notifications"
              title="Notifications"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-semibold border border-blue-500/40 shrink-0">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline text-xs font-medium text-slate-200">
              {user?.name || 'Counsel'}
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
