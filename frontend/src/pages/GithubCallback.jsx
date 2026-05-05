import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';

const GithubCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile, isDark } = useStore();
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const exchangeCodeForToken = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('No authorization code found.');
        return;
      }

      try {
        const res = await fetch('/api/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to authenticate with GitHub');
        }

        updateProfile({ name: data.user.name, email: data.user.email });
        navigate('/');
      } catch (err) {
        console.error('GitHub Callback Error:', err);
        setError(err.message);
      }
    };

    exchangeCodeForToken();
  }, [location, navigate, updateProfile]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-[#0B0F19] text-white' : 'bg-white text-black'
    }`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500 animate-pulse">
          <Command size={32} className="animate-spin-slow" />
        </div>
        
        {error ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-500">Authentication Failed</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{error}</p>
            <button 
              onClick={() => navigate('/signin')}
              className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Authenticating with GitHub</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Please wait while we verify your account...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GithubCallback;
