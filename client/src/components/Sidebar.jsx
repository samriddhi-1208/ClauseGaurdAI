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

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#18231C]/30 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#EAE8DF] text-[#242C26] flex flex-col justify-between border-r border-[#D7D5CB] z-50 select-none font-sans transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="px-5 py-5 border-b border-[#D7D5CB]/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Shield className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h1 className="font-semibold text-sm text-[#18231C] tracking-tight leading-none">
                  ClauseGuard AI
                </h1>
                <p className="text-[10px] text-[#5A635B] font-normal tracking-tight mt-1">
                  Smarter Contracts. Safer Decisions.
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#5A635B] hover:text-[#18231C] hover:bg-[#DCD8CB] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Main Navigation Section */}
          <div className="px-3 py-4 space-y-1">
            <p className="px-3 text-[10px] font-semibold text-[#7A867D] uppercase tracking-wider mb-2">
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
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#DCD8CB] text-[#18231C] font-semibold shadow-2xs'
                        : 'text-[#4E5650] hover:text-[#18231C] hover:bg-[#E2DFD4]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 stroke-[1.8] ${isActive ? 'text-[#304E39]' : 'text-[#616A63]'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Vector Status Badge in Sidebar */}
          <div className="px-3.5 mt-auto mb-3">
            <div className="p-3 bg-[#E2DFD4]/70 border border-[#D7D5CB] rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#304E39]">
                <Sparkles className="w-3.5 h-3.5 stroke-[2] text-[#3F6149]" />
                <span>Vector Memory Active</span>
              </div>
              <p className="text-[10px] text-[#5A635B] leading-tight">
                ChromaDB semantic indexing & Gemini 2.5 legal reasoning.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Settings, Profile & User Card */}
        <div className="border-t border-[#D7D5CB] shrink-0 bg-[#E5E3D9]/40">
          <div className="px-3 py-2 space-y-0.5">
            {bottomNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#DCD8CB] text-[#18231C] font-semibold shadow-2xs'
                        : 'text-[#4E5650] hover:text-[#18231C] hover:bg-[#E2DFD4]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 stroke-[1.8] ${isActive ? 'text-[#304E39]' : 'text-[#616A63]'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* User Footer Profile */}
          <div className="p-3 border-t border-[#D7D5CB] bg-[#E2DFD4]/80">
            <div className="flex items-center justify-between gap-2">
              <div 
                onClick={() => { navigate('/profile'); handleLinkClick(); }}
                className="flex items-center gap-2.5 truncate cursor-pointer group flex-1"
              >
                <div className="w-7 h-7 rounded-full bg-[#3F6149] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
                  {getInitials(user?.name)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#18231C] truncate group-hover:text-[#3F6149] transition-colors leading-tight">
                    {user?.name || 'Samriddhi Tiwari'}
                  </p>
                  <p className="text-[10px] text-[#5A635B] truncate mt-0.5">
                    {user?.email || 'tiwari.samriddhi12@gmail.com'}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="p-1.5 rounded-lg text-[#616A63] hover:text-[#B5413D] hover:bg-[#DCD8CB] transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
