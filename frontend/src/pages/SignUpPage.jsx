import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const SignUpPage = () => {
  const { isDark } = useStore();
  const [email, setEmail] = useState('');

  const handleEmailSignup = (e) => {
    e.preventDefault();
    console.log('Email Sign Up:', email);
  };

  const handleGoogleLogin = () => {
    console.log('Google Sign Up');
  };

  const handleGithubLogin = () => {
    console.log('Github Sign Up');
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
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              isDark 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10'
            }`}
          >
            Continue with Email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>OR</span>
          <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-medium transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-white text-black border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-medium transition-all ${
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
