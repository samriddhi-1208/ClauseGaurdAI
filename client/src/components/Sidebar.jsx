import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  UploadCloud, 
  FolderOpen, 
  GitCompare, 
  ShieldAlert, 
  MessageSquare, 
  Scale, 
  Zap, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { demoAPI } from '../services/api';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);

  const handleRunDemo = async () => {
    try {
      setSeeding(true);
      const res = await demoAPI.seed();
      if (res.data.success) {
        navigate(`/results/${res.data.analysisId}`);
      }
    } catch (err) {
      console.error('[Demo Seed Error]', err);
      alert('Failed to launch demo mode');
    } finally {
      setSeeding(false);
    }
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Upload Documents', path: '/upload', icon: UploadCloud },
    { label: 'Document Library', path: '/documents', icon: FolderOpen },
    { label: 'Compare Contracts', path: '/compare', icon: GitCompare },
    { label: 'Risk Analysis', path: '/results', icon: ShieldAlert },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
  ];

  const getInitials = (name) => {
    if (!name) return 'LA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-100 min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen select-none font-sans z-40">
      <div>
        {/* Brand Header */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              ClauseGuard <span className="text-blue-400">AI</span>
            </h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Legal Intelligence</p>
          </div>
        </div>

        {/* Instant Demo Launcher */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={handleRunDemo}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 group"
          >
            <Zap className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform shrink-0" />
            <span>{seeding ? 'Loading Demo...' : '⚡ Instant Demo Mode'}</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-3">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">Main Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-[#94A3B8] hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></span>
                      )}
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-extrabold text-white shadow-sm shrink-0 border border-blue-400">
              {getInitials(user?.name)}
            </div>
            <div className="truncate">
              <p className="text-xs font-extrabold text-white truncate">{user?.name || 'Samriddhi'}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'samriddhi@firm.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => alert('ClauseGuard AI Workspace Settings v1.0')}
              title="Settings"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
