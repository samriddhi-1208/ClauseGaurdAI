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
        <div className="px-5 py-5 border-b border-[#D7D5CB] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-bold text-[15px] text-[#101A13] leading-snug">
                ClauseGuard AI
              </h1>
              <p className="text-xs text-[#38463C] font-semibold leading-normal mt-0.5">
                Smarter Contracts. Safer Decisions.
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#38463C] hover:text-[#101A13] hover:bg-[#DCD8CB] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <div className="px-3.5 py-4 space-y-1.5">
          <p className="px-3 text-xs font-bold text-[#3B483E] uppercase tracking-wider mb-2">
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D6D1C2] text-[#101A13] font-bold shadow-2xs'
                      : 'text-[#28362D] hover:text-[#101A13] hover:bg-[#DFDBD0]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${isActive ? 'text-[#274830]' : 'text-[#48554A]'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Subtle Divider */}
        <div className="mx-5 my-1.5 border-t border-[#D7D5CB]"></div>

        {/* Preferences Navigation */}
        <div className="px-3.5 py-2 space-y-1.5">
          <p className="px-3 text-xs font-bold text-[#3B483E] uppercase tracking-wider mb-1.5">
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D6D1C2] text-[#101A13] font-bold shadow-2xs'
                      : 'text-[#28362D] hover:text-[#101A13] hover:bg-[#DFDBD0]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${isActive ? 'text-[#274830]' : 'text-[#48554A]'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Vector Status Badge */}
        <div className="px-3.5 mt-auto pt-3 pb-3">
          <div className="p-3 bg-[#E2DFD4] border border-[#D7D5CB] rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#23452B]">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.2] text-[#2F5236]" />
              <span>Vector Memory Active</span>
            </div>
            <p className="text-xs text-[#38463C] font-medium leading-relaxed">
              ChromaDB semantic indexing & Gemini 2.5 legal reasoning.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3.5 px-4 border-t border-[#D7D5CB] bg-[#E2DFD4] shrink-0">
        <div className="flex items-center justify-between gap-2.5">
          <div 
            onClick={() => { navigate('/profile'); handleLinkClick(); }}
            className="flex items-center gap-2.5 truncate cursor-pointer group flex-1 min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#3F6149] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {getInitials(user?.name)}
            </div>
            <div className="truncate min-w-0">
              <p className="text-[14px] font-bold text-[#101A13] truncate group-hover:text-[#3F6149] transition-colors leading-snug">
                {user?.name || 'Samriddhi Tiwari'}
              </p>
              <p className="text-xs text-[#38463C] truncate font-medium leading-normal">
                {user?.email || 'tiwari.samriddhi12@gmail.com'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-[#48554A] hover:text-[#B5413D] hover:bg-[#DCD8CB] transition-colors shrink-0 ml-1"
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
          className="fixed inset-0 bg-[#18231C]/35 backdrop-blur-xs z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#EAE8DF] text-[#101A13] flex flex-col justify-between border-r border-[#D7D5CB] z-50 select-none font-sans transition-transform duration-200 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderContent(true)}
      </aside>

      {/* Permanent Desktop & Laptop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 shrink-0 h-screen sticky top-0 bg-[#EAE8DF] text-[#101A13] border-r border-[#D7D5CB] z-20 select-none font-sans">
        {renderContent(false)}
      </aside>
    </>
  );
};

export default Sidebar;
