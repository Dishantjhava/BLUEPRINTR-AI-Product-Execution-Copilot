import React from 'react';

const AuthBackground = ({ isDark }) => {
  const gridColor   = isDark ? '#1e2440' : '#c8cee0';
  const connColor   = isDark ? '#2a3158' : '#c0c8dc';

  // Isometric icon palette — indigo/violet/rose/cyan tints
  const icons = [
    // top-left
    { x: '8%',  y: '12%', type: 'cube',    accent: isDark ? '#4f46e5' : '#818cf8', face: isDark ? '#312e81' : '#c7d2fe' },
    // top-right
    { x: '82%', y: '10%', type: 'gem',     accent: isDark ? '#7c3aed' : '#a78bfa', face: isDark ? '#4c1d95' : '#ddd6fe' },
    // mid-left
    { x: '5%',  y: '48%', type: 'stack',   accent: isDark ? '#db2777' : '#f9a8d4', face: isDark ? '#831843' : '#fce7f3' },
    // mid-right
    { x: '87%', y: '52%', type: 'cube',    accent: isDark ? '#059669' : '#6ee7b7', face: isDark ? '#064e3b' : '#d1fae5' },
    // bottom-left
    { x: '12%', y: '80%', type: 'gem',     accent: isDark ? '#0891b2' : '#67e8f9', face: isDark ? '#164e63' : '#cffafe' },
    // bottom-right
    { x: '78%', y: '78%', type: 'stack',   accent: isDark ? '#ea580c' : '#fdba74', face: isDark ? '#7c2d12' : '#ffedd5' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>

      {/* ── Isometric grid ─────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: isDark ? 0.55 : 0.65 }}
      >
        <defs>
          {/* Single diamond cell: two pairs of diagonal lines */}
          <pattern id="iso-grid" x="0" y="0" width="60" height="34.64" patternUnits="userSpaceOnUse">
            {/* ↗ lines */}
            <line x1="-30" y1="17.32" x2="30"  y2="-17.32" stroke={gridColor} strokeWidth="0.7" />
            <line x1="0"   y1="34.64" x2="60"  y2="0"      stroke={gridColor} strokeWidth="0.7" />
            <line x1="30"  y1="51.96" x2="90"  y2="17.32"  stroke={gridColor} strokeWidth="0.7" />
            {/* ↘ lines */}
            <line x1="-30" y1="17.32" x2="30"  y2="51.96"  stroke={gridColor} strokeWidth="0.7" />
            <line x1="0"   y1="0"     x2="60"  y2="34.64"  stroke={gridColor} strokeWidth="0.7" />
            <line x1="30"  y1="-17.32" x2="90" y2="17.32"  stroke={gridColor} strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-grid)" />
      </svg>

      {/* ── Connecting bezier curves ────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: isDark ? 0.35 : 0.45 }}
        preserveAspectRatio="none"
      >
        {/* top-left ↔ top-right */}
        <path
          d="M 8% 14% C 30% 5%, 60% 5%, 82% 12%"
          fill="none" stroke={connColor} strokeWidth="1.5"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
        {/* mid-left ↔ mid-right */}
        <path
          d="M 5% 50% C 30% 38%, 65% 62%, 87% 54%"
          fill="none" stroke={connColor} strokeWidth="1.5"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
        {/* bottom-left ↔ bottom-right */}
        <path
          d="M 12% 82% C 35% 92%, 58% 90%, 78% 80%"
          fill="none" stroke={connColor} strokeWidth="1.5"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
      </svg>

      {/* ── Floating isometric icons ────────────────────────────────── */}
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: icon.x,
            top:  icon.y,
            transform: 'translate(-50%, -50%)',
            animation: `authFloat${i % 3} ${3.5 + i * 0.4}s ease-in-out infinite`,
          }}
        >
          {icon.type === 'cube'  && <IsoCube  accent={icon.accent} face={icon.face} isDark={isDark} />}
          {icon.type === 'gem'   && <IsoGem   accent={icon.accent} face={icon.face} isDark={isDark} />}
          {icon.type === 'stack' && <IsoStack accent={icon.accent} face={icon.face} isDark={isDark} />}
        </div>
      ))}

      {/* ── Float keyframes injected once ───────────────────────────── */}
      <style>{`
        @keyframes authFloat0 { 0%,100%{ transform:translate(-50%,-50%) translateY(0px); } 50%{ transform:translate(-50%,-50%) translateY(-8px); } }
        @keyframes authFloat1 { 0%,100%{ transform:translate(-50%,-50%) translateY(0px); } 50%{ transform:translate(-50%,-50%) translateY(-6px); } }
        @keyframes authFloat2 { 0%,100%{ transform:translate(-50%,-50%) translateY(0px); } 50%{ transform:translate(-50%,-50%) translateY(-10px); } }
      `}</style>
    </div>
  );
};

/* ── Isometric cube ─────────────────────────────────────────────────── */
const IsoCube = ({ accent, face }) => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* top face */}
    <polygon points="28,6 50,18 28,30 6,18" fill={accent} opacity="0.90"/>
    {/* left face */}
    <polygon points="6,18 28,30 28,50 6,30"  fill={face}   opacity="0.85"/>
    {/* right face */}
    <polygon points="50,18 28,30 28,50 50,30" fill={accent} opacity="0.60"/>
    {/* edges */}
    <polyline points="28,6 50,18 28,30 6,18 28,6" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.5"/>
    <line x1="28" y1="30" x2="28" y2="50" stroke={accent} strokeWidth="0.8" opacity="0.4"/>
    <line x1="6"  y1="18" x2="6"  y2="30" stroke={accent} strokeWidth="0.8" opacity="0.4"/>
    <line x1="50" y1="18" x2="50" y2="30" stroke={accent} strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

/* ── Isometric gem / diamond ───────────────────────────────────────── */
const IsoGem = ({ accent, face }) => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* upper facets */}
    <polygon points="26,4 44,18 26,26 8,18"   fill={accent} opacity="0.90"/>
    <polygon points="26,4 8,18 26,26"          fill={face}   opacity="0.75"/>
    <polygon points="26,4 44,18 26,26"         fill={accent} opacity="0.55"/>
    {/* lower facets */}
    <polygon points="8,18 26,26 26,48"         fill={face}   opacity="0.80"/>
    <polygon points="44,18 26,26 26,48"        fill={accent} opacity="0.45"/>
    {/* centre highlight */}
    <polygon points="26,4 44,18 26,26 8,18"    stroke={accent} strokeWidth="0.8" fill="none" opacity="0.5"/>
    <line x1="26" y1="26" x2="26" y2="48"     stroke={accent} strokeWidth="0.8" opacity="0.35"/>
  </svg>
);

/* ── Isometric stack of layers ──────────────────────────────────────── */
const IsoStack = ({ accent, face }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* bottom slab */}
    <polygon points="30,36 52,24 52,30 30,42 8,30 8,24" fill={face}   opacity="0.80"/>
    <polygon points="30,36 52,24 30,12 8,24"            fill={accent} opacity="0.55"/>
    {/* middle slab */}
    <polygon points="30,28 52,16 52,22 30,34 8,22 8,16" fill={face}   opacity="0.85"/>
    <polygon points="30,28 52,16 30,4  8,16"            fill={accent} opacity="0.65"/>
    {/* top slab */}
    <polygon points="30,20 52,8  52,14 30,26 8,14 8,8"  fill={face}   opacity="0.90"/>
    <polygon points="30,20 52,8  30,-4 8,8"             fill={accent} opacity="0.75"/>
    {/* top face highlight */}
    <polygon points="30,20 52,8 30,-4 8,8"              stroke={accent} strokeWidth="0.8" fill="none" opacity="0.5"/>
  </svg>
);

export default AuthBackground;
