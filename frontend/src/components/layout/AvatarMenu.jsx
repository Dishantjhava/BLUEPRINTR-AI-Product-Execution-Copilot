import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BookMarked, LogOut, ChevronDown, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AvatarMenu = () => {
  const { isDark, userProfile, logoutUser } = useStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logoutUser();
    navigate('/signin');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => { setOpen(false); navigate('/profile'); },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => { setOpen(false); navigate('/settings'); },
    },
    {
      icon: BookMarked,
      label: 'My Blueprints',
      onClick: () => { setOpen(false); navigate('/chats'); },
    },
  ];

  if (!userProfile) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* ── Avatar trigger ─────────────────────────────────────────── */}
      <button
        id="avatar-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 group"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:scale-105 transition-transform">
          {userProfile.initials}
        </div>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Dropdown ───────────────────────────────────────────────── */}
      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-2xl z-50 overflow-hidden
            animate-[fadeSlideDown_0.15s_ease-out]
            ${isDark
              ? 'bg-[#111111] border-white/10 shadow-black/60'
              : 'bg-white border-gray-200 shadow-gray-200/80'
            }`}
          role="menu"
        >
          {/* User info header */}
          <div className={`px-4 py-3 border-b ${isDark ? 'border-white/[0.07]' : 'border-gray-100'}`}>
            <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {userProfile.name}
            </p>
            <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {userProfile.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                role="menuitem"
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                  ${isDark
                    ? 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon size={15} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                {label}
              </button>
            ))}
          </div>

          {/* Logout — separated by a divider */}
          <div className={`border-t py-1 ${isDark ? 'border-white/[0.07]' : 'border-gray-100'}`}>
            <button
              onClick={handleLogout}
              role="menuitem"
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                ${isDark
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-red-500 hover:bg-red-50'
                }`}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Keyframe injected once */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AvatarMenu;
