import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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
      <header className="h-14 bg-[#FAF9F6] border-b border-[#E8E7E0] px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
        {/* Left Title */}
        <div className="truncate pr-4">
          <h2 className="text-sm font-semibold text-[#1F2421] leading-tight truncate">{title}</h2>
          {subtitle && <p className="text-[11px] text-[#7B847E] truncate mt-0.5">{subtitle}</p>}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search contracts"
            className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-[#F5F4EE] border border-[#E8E7E0] rounded-xl text-xs text-[#606963] transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#7B847E] stroke-[1.75]" />
            <span className="hidden sm:inline text-[11px]">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.2 bg-[#F5F4EE] border border-[#E8E7E0] rounded text-[10px] font-mono text-[#7B847E]">
              Ctrl K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Open notifications"
              className="p-1.5 rounded-lg text-[#7B847E] hover:text-[#1F2421] hover:bg-[#F0EFE9] transition-colors relative"
            >
              <Bell className="w-4 h-4 stroke-[1.75]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#5B8266] rounded-full"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E8E7E0]">
            <div className="w-6 h-6 rounded-full bg-[#5B8266] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline text-xs text-[#2E3430] font-medium">
              {user?.name || 'Samriddhi'}
            </span>
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
