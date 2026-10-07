import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Building, Check, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewAccount = location.state?.isNewAccount;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(localStorage.getItem('clauseguard_counsel_role') || 'Senior Legal Counsel');
  const [organization, setOrganization] = useState(localStorage.getItem('clauseguard_counsel_org') || 'Enterprise Legal Operations');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('clauseguard_counsel_role', role);
    localStorage.setItem('clauseguard_counsel_org', organization);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (n) => {
    if (!n) return 'C';
    return n.charAt(0).toUpperCase();
  };

  return (
    <div className="flex-1 bg-[#0B0A08] flex flex-col min-w-0 pb-16 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <Navbar title="Counsel Profile" subtitle="Manage your legal credentials, workspace identity, and profile preferences" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        {/* Onboarding Welcome Banner for newly registered users */}
        {isNewAccount && (
          <div className="p-5 bg-[#14120E] border border-[#2D261C] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#191612] border border-[#3A3022] flex items-center justify-center text-[#E5C38E] shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-sm font-serif font-medium text-[#F4EFE5]">
                  Account Created Successfully
                </p>
                <p className="text-xs text-[#B9AE9A] mt-0.5 leading-relaxed">
                  Set up your counsel credentials below so they appear correctly on audit reports and clause exports.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="py-2 px-4 bg-[#1B1813] hover:bg-[#231F19] border border-[#2D261C] hover:border-[#E5C38E]/40 text-[#E5C38E] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <span>Skip to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-[#191612] border border-[#2D261C] text-[#E5C38E] flex items-center justify-center font-serif text-3xl font-bold shrink-0 shadow-sm">
            {getInitials(name)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
                  {name || 'Counsel Profile'}
                </h1>
                <p className="text-xs md:text-sm text-[#B9AE9A] mt-1.5 leading-relaxed">{email || 'counsel@clauseguard.ai'}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-[#152319] text-[#98C7A3] border border-[#233B2B] self-center sm:self-auto">
                <Shield className="w-3.5 h-3.5 stroke-[2]" />
                <span>Verified Legal Counsel</span>
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-[#1F1B16] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#16130F] p-3 rounded-lg border border-[#231F19]">
                <span className="text-[11px] text-[#8C806F] block">Role</span>
                <span className="font-medium text-[#EDE5D5] mt-0.5 block">{role}</span>
              </div>
              <div className="bg-[#16130F] p-3 rounded-lg border border-[#231F19]">
                <span className="text-[11px] text-[#8C806F] block">Organization</span>
                <span className="font-medium text-[#EDE5D5] mt-0.5 block truncate">{organization}</span>
              </div>
              <div className="bg-[#16130F] p-3 rounded-lg border border-[#231F19] col-span-2 sm:col-span-1">
                <span className="text-[11px] text-[#8C806F] block">Engine Tier</span>
                <span className="font-medium text-[#E5C38E] mt-0.5 block">Enterprise Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-[#12100D] rounded-xl border border-[#231F19] p-6 md:p-8 space-y-6">
          <div className="border-b border-[#1F1B16] pb-4">
            <h2 className="text-base font-serif text-[#F4EFE5]">Personal Information</h2>
            <p className="text-xs text-[#8C806F] mt-0.5">Update your displayed legal identity on audit reports and clause exports.</p>
          </div>

          {saved && (
            <div className="p-3.5 bg-[#152319] border border-[#233B2B] rounded-lg flex items-center justify-between gap-2.5 text-xs text-[#98C7A3]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Profile details saved successfully.</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-xs text-[#98C7A3] underline hover:text-[#B9E0C2] font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-3 h-3 stroke-[2]" />
              </button>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F]/50 border border-[#231F19] rounded-lg text-xs md:text-sm text-[#8C806F] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Legal Title</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#1F1B16]">
              <div className="flex items-center gap-2.5">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="py-2.5 px-4 bg-[#16130F] hover:bg-[#1E1A14] border border-[#2D261C] hover:border-[#E5C38E]/40 text-[#EDE5D5] font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2] text-[#E5C38E]" />
                </button>
              </div>

              <button
                type="button"
                onClick={logout}
                className="py-2.5 px-4 bg-[#14120E] hover:bg-[#261516] border border-[#231F19] hover:border-[#482325] text-[#ECA09B] font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
