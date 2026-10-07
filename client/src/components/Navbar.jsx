import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';
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
      <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 font-sans shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        {/* Left Title & Subtitle */}
        <div className="truncate pr-4">
          <h2 className="text-sm md:text-base font-semibold text-slate-900 leading-tight tracking-tight truncate">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 font-normal truncate mt-0.5">{subtitle}</p>}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search contracts and findings"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
            <span className="hidden sm:inline">Search contracts...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {/* Verification Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-xs font-medium text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Grounded Legal RAG</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Open notifications"
              title="Notifications"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline text-xs font-medium text-slate-700">
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
