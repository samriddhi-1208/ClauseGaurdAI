import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/profile', { state: { isNewAccount: true } });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0A08] flex items-center justify-center p-6 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <div className="w-full max-w-md bg-[#12100D] rounded-xl shadow-2xl p-8 md:p-9 border border-[#231F19] relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#191612] border border-[#2D261C] flex items-center justify-center text-[#E5C38E] mx-auto mb-3.5 shadow-sm">
            <Shield className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
            Create Workspace Account
          </h1>
          <p className="text-xs md:text-sm text-[#B9AE9A] mt-2 font-normal leading-relaxed">
            Start analyzing contracts & detecting contradictions
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-[#241314] border border-[#482325] rounded-lg flex items-center gap-2.5 text-xs text-[#ECA09B]">
            <AlertCircle className="w-4 h-4 text-[#ECA09B] shrink-0 stroke-[2]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#D5CEBF] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Counsel Name"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D5CEBF] mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="counsel@clauseguard.ai"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D5CEBF] mb-1">Password (min 6 characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D5CEBF] mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3 stroke-[1.8]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer shadow-sm"
          >
            <span>{loading ? 'Creating Workspace...' : 'Create Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4 stroke-[2]" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#1F1B16] text-center text-xs text-[#8C806F]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#EDE5D5] hover:text-[#E5C38E] transition-colors">
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
