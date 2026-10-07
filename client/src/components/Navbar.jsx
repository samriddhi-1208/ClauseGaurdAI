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
      <header className="bg-[#0E0D0B] border-b border-[#24201A] px-6 md:px-10 py-4 md:py-5 flex items-center justify-between sticky top-0 z-30 font-sans">
        {/* Left Section: Mobile Menu Button + Serif Page Title */}
        <div className="flex items-center gap-3.5 truncate pr-4">
          {outletContext?.toggleMobileSidebar && (
            <button
              onClick={outletContext.toggleMobileSidebar}
              className="md:hidden p-2 rounded-xl bg-[#161411] border border-[#2B251B] text-[#A89E8D] hover:text-[#F8F6F0] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4 stroke-[2]" />
            </button>
          )}

          <div className="truncate">
            <h1 className="text-lg md:text-xl font-serif font-medium text-[#F8F6F0] tracking-normal leading-snug truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#A89E8D] font-normal leading-relaxed truncate mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Search + Notifications + Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search contracts"
            className="flex items-center gap-2 px-3.5 py-2 bg-[#161411] hover:bg-[#1E1B16] border border-[#2B251B] hover:border-[#3D3528] rounded-xl text-xs text-[#A89E8D] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#C8A97E] stroke-[2]" />
            <span className="hidden sm:inline font-medium">Search repository...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#201D17] border border-[#352F25] rounded text-[10px] font-mono font-semibold text-[#E5C38E]">
              Ctrl K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Open notifications"
              className="p-2.5 rounded-xl bg-[#161411] hover:bg-[#1E1B16] border border-[#2B251B] hover:border-[#3D3528] text-[#A89E8D] hover:text-[#E5C38E] transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#E5C38E] rounded-full ring-2 ring-[#0E0D0B]"></span>
            </button>

            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>

          {/* User Avatar Circle */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 pl-2.5 border-l border-[#24201A] group"
            title="View Counsel Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#241E15] border border-[#C8A97E]/50 text-[#E5C38E] flex items-center justify-center text-xs font-bold shrink-0 shadow-sm group-hover:border-[#E5C38E] transition-colors">
              {getInitials(user?.name)}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-[#EDE5D5] group-hover:text-[#E5C38E] transition-colors">
              {user?.name ? user.name.split(' ')[0] : 'Counsel'}
            </span>
          </Link>
        </div>
      </header>

      {/* Global Command Palette */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
