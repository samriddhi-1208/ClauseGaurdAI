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
      <div className="min-h-screen bg-[#0B0A08] flex items-center justify-center text-[#EDE5D5]">
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#1A1815] border border-[#C8A97E]/40 text-[#E5C38E] flex items-center justify-center shadow-md animate-pulse">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 border-2 border-[#E5C38E] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-[#C8A97E] tracking-wide">Loading ClauseGuard AI...</span>
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
    <div className="min-h-screen bg-[#0B0A08] text-[#EDE5D5] flex selection:bg-[#E5C38E] selection:text-[#12110E]">
      {/* Sidebar: permanent on desktop & laptop, slide drawer on mobile */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={closeMobileSidebar} 
      />
      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0A08]">
        <Outlet context={{ toggleMobileSidebar }} />
      </div>
    </div>
  );
};

export default ProtectedRoute;
