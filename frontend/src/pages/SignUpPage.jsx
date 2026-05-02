import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useStore } from '../store/useStore';

const SignUpPage = () => {
  const { isDark } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { updateProfile } = useStore();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to sign up');
      
      localStorage.setItem('blueprintr_token', data.token);
      updateProfile({ name: data.user.name, email: data.user.email });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Google login failed');
      
      localStorage.setItem('blueprintr_token', data.token);
      updateProfile({ name: data.user.name, email: data.user.email });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F19] text-white' : 'bg-white text-black'
    }`}>
      {/* Top Header Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Command size={18} />
          </div>
          <span className="font-bold tracking-tight text-xl">BLUEPRINTR</span>
        </Link>
      </div>

      {/* Top Right Sign In Button */}
      <div className="absolute top-8 right-8">
        <Link 
          to="/signin" 
          className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
            isDark 
              ? 'border-white/10 hover:bg-white/5' 
              : 'border-gray-200 hover:bg-gray-50 shadow-sm'
          }`}
        >
          Sign In
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] px-6 text-center space-y-8"
      >
        {/* Main Logo and Title */}
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500">
            <Command size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Join BLUEPRINTR to start architecting your vision.
          </p>
        </div>

        {/* Email Input Section */}
        <form onSubmit={handleEmailSignup} className="space-y-3">
          {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-xl">{error}</div>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              isDark 
                ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                : 'bg-white border-gray-200 text-black placeholder-gray-400 shadow-sm'
            }`}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@work-email.com"
            className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              isDark 
                ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                : 'bg-white border-gray-200 text-black placeholder-gray-400 shadow-sm'
            }`}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              isDark 
                ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                : 'bg-white border-gray-200 text-black placeholder-gray-400 shadow-sm'
            }`}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              isDark 
                ? 'bg-white text-black hover:bg-gray-200 disabled:opacity-50' 
                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 disabled:opacity-50'
            }`}
          >
            {loading ? 'Creating Account...' : 'Continue with Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>OR</span>
          <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="w-full flex justify-center overflow-hidden rounded-xl">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              theme={isDark ? 'filled_black' : 'outline'}
              shape="pill"
              size="large"
              width="350px"
              text="continue_with"
            />
          </div>

          <button
            onClick={handleGithubLogin}
            className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full border font-medium transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-white text-black border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            Continue with GitHub
          </button>
        </div>

        {/* Bottom Link */}
        <div className="pt-4">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-500 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="pt-12 text-[11px] text-gray-500 max-w-[320px] mx-auto">
          By proceeding, you agree to our <span className="underline text-indigo-500">Terms of Service</span> and <span className="underline text-indigo-500">Privacy Policy</span>.
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
