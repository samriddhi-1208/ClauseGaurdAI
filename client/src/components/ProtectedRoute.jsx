import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Shield } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center text-[#18231C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3F6149] text-white flex items-center justify-center shadow-sm animate-pulse">
            <Shield className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#3F6149] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-[#3F6149]">Loading ClauseGuard AI...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#18231C] flex">
      {/* Sidebar: permanent on desktop & laptop, slide drawer on mobile */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={closeMobileSidebar} 
      />
      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ toggleMobileSidebar }} />
      </div>
    </div>
  );
};

export default ProtectedRoute;
