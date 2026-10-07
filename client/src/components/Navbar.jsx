import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOutletContext, Link } from 'react-router-dom';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Safely grab outlet context if available
  let outletContext = null;
  try {
    outletContext = useOutletContext();
  } catch (e) {
    outletContext = null;
  }

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
      <header className="h-16 bg-[#F8F7F2] border-b border-[#E2DFD5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
        {/* Left Section: Mobile Menu Button + Title */}
        <div className="flex items-center gap-3 truncate pr-4">
          {outletContext?.toggleMobileSidebar && (
            <button
              onClick={outletContext.toggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#DDDCD3] text-[#4E5650] hover:text-[#18231C] transition-colors shrink-0 shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          <div className="truncate">
            <h2 className="text-sm md:text-[15px] font-semibold text-[#18231C] leading-snug truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] md:text-xs text-[#5A665D] font-normal leading-normal truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Search + Notifications + Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search contracts"
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#F2F0E8] border border-[#DDDCD3] rounded-xl text-xs text-[#5A665D] transition-colors shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-[#5A665D] stroke-[1.8]" />
            <span className="hidden sm:inline text-xs font-normal">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#EDE9DE] border border-[#DDD6C5] rounded text-[10px] font-mono text-[#5A665D]">
              Ctrl K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Open notifications"
              className="p-2 rounded-xl bg-white hover:bg-[#F2F0E8] border border-[#DDDCD3] text-[#5A665D] hover:text-[#18231C] transition-colors relative shadow-2xs"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#3F6149] rounded-full"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Avatar Circle */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 border-l border-[#E2DFD5] group"
            title="View Counsel Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#3F6149] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
              {getInitials(user?.name)}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-[#18231C] group-hover:text-[#3F6149] transition-colors">
              {user?.name ? user.name.split(' ')[0] : 'Samriddhi'}
            </span>
          </Link>
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
