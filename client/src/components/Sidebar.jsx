import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  UploadCloud, 
  Search, 
  GitCompare, 
  ShieldAlert, 
  Clock, 
  Settings, 
  User, 
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Documents', path: '/upload', icon: UploadCloud },
    { label: 'Analyze', path: '/chat', icon: Search },
    { label: 'Compare Contracts', path: '/compare', icon: GitCompare },
    { label: 'Risk Insights', path: '/results', icon: ShieldAlert },
    { label: 'History', path: '/documents', icon: Clock },
  ];

  const bottomNav = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const renderContent = (isMobile = false) => (
    <>
      {/* Top & Navigation Section */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#24201A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A1815] border border-[#C8A97E]/40 text-[#E5C38E] flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-[17px] text-[#F8F6F0] tracking-normal leading-snug">
                ClauseGuard AI
              </h1>
              <p className="text-xs text-[#A99E8C] font-normal leading-relaxed mt-1">
                Smarter Contracts. Safer Decisions.
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#F8F6F0] hover:bg-[#1E1B16] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="px-3.5 py-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-[#8C806F] uppercase tracking-[0.14em] mb-2.5">
            Workspace
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] transition-all group ${
                    isActive
                      ? 'bg-[#221C13] text-[#F8F6F0] font-bold border-l-2 border-[#E5C38E] shadow-sm'
                      : 'text-[#B8AC99] hover:text-[#F8F6F0] hover:bg-[#181613] font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2] transition-colors ${
                      isActive ? 'text-[#E5C38E]' : 'text-[#8C806F] group-hover:text-[#E5C38E]'
                    }`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Subtle Divider */}
        <div className="mx-5 my-1.5 border-t border-[#24201A]"></div>

        {/* Preferences Navigation */}
        <div className="px-3.5 py-2 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-[#8C806F] uppercase tracking-[0.14em] mb-2">
            Preferences
          </p>
          {bottomNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] transition-all group ${
                    isActive
                      ? 'bg-[#221C13] text-[#F8F6F0] font-bold border-l-2 border-[#E5C38E] shadow-sm'
                      : 'text-[#B8AC99] hover:text-[#F8F6F0] hover:bg-[#181613] font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2] transition-colors ${
                      isActive ? 'text-[#E5C38E]' : 'text-[#8C806F] group-hover:text-[#E5C38E]'
                    }`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Vector Status Badge */}
        <div className="px-3.5 mt-auto pt-3 pb-3">
          <div className="p-3 bg-[#14120E] border border-[#2B251B] rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5C38E]">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.2] text-[#E5C38E]" />
              <span>Vector Memory Active</span>
            </div>
            <p className="text-xs text-[#8C806F] font-medium leading-relaxed">
              ChromaDB semantic indexing & Gemini 2.5 legal reasoning.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3.5 px-4 border-t border-[#24201A] bg-[#12100D] shrink-0">
        <div className="flex items-center justify-between gap-2.5">
          <div 
            onClick={() => { navigate('/profile'); handleLinkClick(); }}
            className="flex items-center gap-2.5 truncate cursor-pointer group flex-1 min-w-0"
            title={`${user?.name || 'Samriddhi Tiwari'} (${user?.email || 'tiwari.samriddhi12@gmail.com'})`}
          >
            <div className="w-8 h-8 rounded-full bg-[#241E15] border border-[#C8A97E]/50 text-[#E5C38E] flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-[13.5px] font-bold text-[#F8F6F0] truncate group-hover:text-[#E5C38E] transition-colors leading-snug">
                {user?.name || 'Samriddhi Tiwari'}
              </p>
              <p className="text-[11px] text-[#8C806F] truncate font-medium leading-normal">
                {user?.email || 'tiwari.samriddhi12@gmail.com'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-[#8C806F] hover:text-[#E58882] hover:bg-[#221616] transition-colors shrink-0 ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#000000]/70 backdrop-blur-xs z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#0E0D0B] text-[#EDE5D5] flex flex-col justify-between border-r border-[#24201A] z-50 select-none font-sans transition-transform duration-200 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderContent(true)}
      </aside>

      {/* Permanent Desktop & Laptop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 shrink-0 h-screen sticky top-0 bg-[#0E0D0B] text-[#EDE5D5] border-r border-[#24201A] z-20 select-none font-sans">
        {renderContent(false)}
      </aside>
    </>
  );
};

export default Sidebar;
