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
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
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

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="w-64 bg-[#EAE8DF] text-[#242C26] min-h-screen flex flex-col justify-between border-r border-[#D7D5CB] shrink-0 sticky top-0 h-screen select-none font-sans z-40">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-[#D7D5CB]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3F6149] text-white flex items-center justify-center shrink-0 shadow-2xs">
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
        </div>

        {/* Navigation Section */}
        <div className="px-3.5 py-5 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#DCD8CB] text-[#18231C] shadow-2xs font-semibold'
                      : 'text-[#4E5650] hover:text-[#18231C] hover:bg-[#E3E0D6]'
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

        {/* Divider */}
        <div className="mx-5 my-2 border-t border-[#D7D5CB]"></div>

        {/* Secondary Navigation */}
        <div className="px-3.5 space-y-1">
          <button
            onClick={() => alert('Settings: General preferences & AI parameters.')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#4E5650] hover:text-[#18231C] hover:bg-[#E3E0D6] transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0 stroke-[1.8] text-[#616A63]" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => alert(`Profile Information\nUser: ${user?.name || 'Samriddhi Tiwari'}\nEmail: ${user?.email || 'tiwari.samriddhi12@gmail.com'}`)}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#4E5650] hover:text-[#18231C] hover:bg-[#E3E0D6] transition-colors"
          >
            <User className="w-4 h-4 stroke-[1.8] text-[#616A63]" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-4 border-t border-[#D7D5CB] bg-[#E3E0D6]/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-[#3F6149] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
              {getInitials(user?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#18231C] truncate">{user?.name || 'Samriddhi Tiwari'}</p>
              <p className="text-[11px] text-[#5A635B] truncate">{user?.email || 'counsel@lawfirm.com'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-[#616A63] hover:text-[#B5413D] hover:bg-[#DCD8CB] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
