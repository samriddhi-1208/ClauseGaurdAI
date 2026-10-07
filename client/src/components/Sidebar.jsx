import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Search,
  GitCompare, 
  ShieldAlert, 
  Clock, 
  Scale, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Documents', path: '/upload', icon: UploadCloud },
    { label: 'Analyze', path: '/chat', icon: Search },
    { label: 'Compare Contracts', path: '/compare', icon: GitCompare },
    { label: 'Risk Insights', path: '/results', icon: ShieldAlert },
    { label: 'History', path: '/documents', icon: Clock },
  ];

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-60 bg-[#F5F4EE] text-[#2E3430] min-h-screen flex flex-col justify-between border-r border-[#E8E7E0] shrink-0 sticky top-0 h-screen select-none font-sans z-40">
      <div>
        {/* Brand Header */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-[#E8E7E0]/70">
          <div className="w-8 h-8 rounded-lg bg-[#E7ECE7] text-[#2F4335] flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-[#1F2421] tracking-tight leading-none">
              ClauseGuard <span className="text-[#5B8266] font-medium">AI</span>
            </h1>
            <p className="text-[10px] text-[#7B847E] font-normal tracking-wide mt-1">Contract Intelligence</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                      isActive
                        ? 'bg-[#E7ECE7] text-[#1C2D24] font-medium shadow-2xs'
                        : 'text-[#606963] hover:text-[#1F2421] hover:bg-[#EBEAE3] font-normal'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 stroke-[1.75] ${isActive ? 'text-[#3D5745]' : 'text-[#7B847E]'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile / Settings Section */}
      <div className="p-3 border-t border-[#E8E7E0]/80 bg-[#EFEFE8]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-[#5B8266] text-white flex items-center justify-center text-[11px] font-medium shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-[#1F2421] truncate">{user?.name || 'Samriddhi'}</p>
              <p className="text-[10px] text-[#7B847E] truncate font-normal">{user?.email || 'user@workspace.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => alert(`ClauseGuard AI Workspace\nUser: ${user?.name || 'Samriddhi'}\nRole: Contract Counsel`)}
              title="Settings & Profile"
              aria-label="Settings and Profile"
              className="p-1.5 rounded-lg text-[#7B847E] hover:text-[#1F2421] hover:bg-[#E4E3DC] transition-colors"
            >
              <Settings className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
            <button
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-[#7B847E] hover:text-[#C25450] hover:bg-[#E4E3DC] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
