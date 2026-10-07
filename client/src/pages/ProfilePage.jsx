import React, { useState } from 'react';
import { User, Mail, Shield, Key, Building, Check, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Samriddhi Tiwari');
  const [email] = useState(user?.email || 'tiwari.samriddhi12@gmail.com');
  const [role] = useState('Senior Legal Counsel');
  const [organization] = useState('Enterprise Legal Operations');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (n) => {
    if (!n) return 'S';
    return n.charAt(0).toUpperCase();
  };

  return (
    <div className="flex-1 bg-[#F8F7F2] flex flex-col min-w-0 pb-16 font-sans text-[#18231C]">
      <Navbar title="Counsel Profile" subtitle="Manage your legal credentials, workspace identity, and profile preferences" />

      <main className="p-6 md:p-10 max-w-4xl w-full mx-auto space-y-7">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#3F6149] text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm">
            {getInitials(name)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
                  {name}
                </h1>
                <p className="text-xs text-[#5A665D] font-normal mt-0.5">{email}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECE3] text-[#2F5236] border border-[#CADBCC] self-center sm:self-auto">
                <Shield className="w-3.5 h-3.5 stroke-[2]" />
                <span>Verified Legal Counsel</span>
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-[#ECEAE2] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E6DC]">
                <span className="text-[11px] text-[#758177] block">Role</span>
                <span className="font-semibold text-[#18231C] mt-0.5 block">{role}</span>
              </div>
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E6DC]">
                <span className="text-[11px] text-[#758177] block">Organization</span>
                <span className="font-semibold text-[#18231C] mt-0.5 block truncate">{organization}</span>
              </div>
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E6DC] col-span-2 sm:col-span-1">
                <span className="text-[11px] text-[#758177] block">Engine Tier</span>
                <span className="font-semibold text-[#3F6149] mt-0.5 block">Enterprise Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-2xl border border-[#DDDCD3] p-6 md:p-8 shadow-card space-y-6">
          <div className="border-b border-[#ECEAE2] pb-4">
            <h2 className="text-base font-semibold text-[#18231C]">Personal Information</h2>
            <p className="text-xs text-[#5A665D] mt-0.5">Update your displayed legal identity on audit reports and clause exports.</p>
          </div>

          {saved && (
            <div className="p-3.5 bg-[#E2ECE3] border border-[#CADBCC] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#2F5236]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Profile details saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F2F0E8] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#6B736D] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Legal Title</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    defaultValue={role}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
                  <input
                    type="text"
                    defaultValue={organization}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#ECEAE2]">
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
              >
                Save Profile Changes
              </button>

              <button
                type="button"
                onClick={logout}
                className="py-2.5 px-4 bg-white hover:bg-[#F9DFDE]/50 border border-[#DDDCD3] hover:border-[#F2CAC8] text-[#B5413D] font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
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
