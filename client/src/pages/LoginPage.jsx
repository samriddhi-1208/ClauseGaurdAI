import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both work email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      const isDemo = searchParams.get('demo');
      if (isDemo) {
        navigate('/dashboard?demo=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('tiwari.samriddhi12@gmail.com');
    setPassword('clauseguard123');
  };

  return (
    <div className="min-h-screen bg-[#0B0A08] flex items-center justify-center p-4 sm:p-6 font-sans text-[#EDE5D5] selection:bg-[#E5C38E]/20 selection:text-[#F8F6F0]">
      <div className="w-full max-w-md bg-[#12100D] rounded-xl shadow-2xl p-5 sm:p-8 md:p-9 border border-[#231F19] relative">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-[#191612] border border-[#2D261C] flex items-center justify-center text-[#E5C38E] mx-auto mb-3.5 shadow-sm">
            <Shield className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-medium text-[#F4EFE5] tracking-normal leading-snug">
            Sign In to ClauseGuard AI
          </h1>
          <p className="text-xs md:text-sm text-[#B9AE9A] mt-2 font-normal leading-relaxed">
            Enterprise legal intelligence & contradiction analysis
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-[#241314] border border-[#482325] rounded-lg flex items-center gap-2.5 text-xs text-[#ECA09B]">
            <AlertCircle className="w-4 h-4 text-[#ECA09B] shrink-0 stroke-[2]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#D5CEBF] mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-3 stroke-[1.8]" />
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#D5CEBF]">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C806F] absolute left-3.5 top-3 stroke-[1.8]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#16130F] border border-[#231F19] rounded-lg text-xs md:text-sm text-[#EDE5D5] placeholder-[#8C806F] focus:outline-none focus:border-[#E5C38E]/70 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8C806F] hover:text-[#E5C38E] transition-colors p-0.5 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.8]" /> : <Eye className="w-4 h-4 stroke-[1.8]" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4 stroke-[2]" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#1F1B16] flex items-center justify-between text-xs text-[#8C806F]">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-medium text-[#E5C38E] hover:underline cursor-pointer"
          >
            Fill Demo Credentials
          </button>
          <Link to="/register" className="text-[11px] font-medium text-[#EDE5D5] hover:text-[#E5C38E] transition-colors">
            Create an Account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
