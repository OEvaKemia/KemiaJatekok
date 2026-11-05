import React from 'react';

export type AvatarMood = 'idle' | 'happy' | 'thinking' | 'surprised' | 'cheering' | 'warning';
export type AvatarRole = 'explorer' | 'professor' | 'detective' | 'auditor' | 'engineer';

interface ChemistAvatarProps {
  mood?: AvatarMood;
  role?: AvatarRole;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChemistAvatar: React.FC<ChemistAvatarProps> = ({
  mood = 'idle',
  role = 'professor',
  speechText,
  size = 'md',
  className = '',
}) => {
  // Dimensions
  const dim = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-20 h-20 sm:w-24 sm:h-24';

  const getMoodEyeStyle = () => {
    switch (mood) {
      case 'happy':
      case 'cheering':
        return (
          <>
            {/* Joyful curved eyes ^ ^ */}
            <path d="M38 46 Q44 40 50 46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M60 46 Q66 40 72 46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Blushing cheeks */}
            <circle cx="34" cy="53" r="4" fill="#f43f5e" opacity="0.6" />
            <circle cx="76" cy="53" r="4" fill="#f43f5e" opacity="0.6" />
            {/* Wide smiling mouth */}
            <path d="M44 56 Q55 68 66 56" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="#be123c" />
          </>
        );
      case 'surprised':
      case 'warning':
        return (
          <>
            {/* Wide open eyes O O */}
            <circle cx="44" cy="46" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="45" cy="46" r="2.5" fill="#0f172a" />
            <circle cx="66" cy="46" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="67" cy="46" r="2.5" fill="#0f172a" />
            {/* Small open mouth o */}
            <circle cx="55" cy="58" r="4.5" fill="#be123c" stroke="#0f172a" strokeWidth="2" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* One eye squinting, one eye looking up */}
            <line x1="39" y1="46" x2="49" y2="46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="66" cy="44" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <circle cx="67" cy="42" r="2" fill="#0f172a" />
            {/* Wavy mouth ~ */}
            <path d="M46 58 Q52 55 58 59" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            {/* Friendly round eyes */}
            <circle cx="44" cy="46" r="4.5" fill="#0f172a" />
            <circle cx="42.5" cy="44.5" r="1.5" fill="#ffffff" />
            <circle cx="66" cy="46" r="4.5" fill="#0f172a" />
            <circle cx="64.5" cy="44.5" r="1.5" fill="#ffffff" />
            {/* Gentle smile */}
            <path d="M46 56 Q55 63 64 56" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  const getRoleHeadwear = () => {
    switch (role) {
      case 'explorer':
        // Explorer / Miner pith helmet with headlamp
        return (
          <g>
            <path d="M30 32 Q55 10 80 32 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <ellipse cx="55" cy="32" rx="32" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            {/* Mining headlamp */}
            <circle cx="55" cy="24" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="55" cy="24" r="3" fill="#ffffff" />
          </g>
        );
      case 'detective':
        // Detective fedora hat
        return (
          <g>
            <path d="M32 28 Q55 12 78 28 L72 20 Q55 16 38 20 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <ellipse cx="55" cy="28" rx="30" ry="5" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="40" y="24" width="30" height="3" fill="#0ea5e9" />
          </g>
        );
      case 'engineer':
        // Hardhat helmet
        return (
          <g>
            <path d="M32 30 Q55 12 78 30 Z" fill="#eab308" stroke="#a16207" strokeWidth="2" />
            <ellipse cx="55" cy="31" rx="28" ry="4" fill="#ca8a04" />
            <rect x="52" y="16" width="6" height="12" fill="#facc15" />
          </g>
        );
      case 'auditor':
      case 'professor':
      default:
        // Professor hair + green/cyan safety goggles on forehead
        return (
          <g>
            {/* Goggles strap and lenses */}
            <rect x="30" y="24" width="50" height="4" fill="#0f172a" rx="2" />
            <circle cx="43" cy="25" r="9" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" opacity="0.9" />
            <circle cx="41" cy="23" r="3" fill="#ffffff" opacity="0.8" />
            <circle cx="67" cy="25" r="9" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" opacity="0.9" />
            <circle cx="65" cy="23" r="3" fill="#ffffff" opacity="0.8" />
          </g>
        );
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated Character Avatar SVG */}
      <div className={`relative shrink-0 ${dim} filter drop-shadow-md`}>
        <svg
          viewBox="0 0 110 110"
          className="w-full h-full overflow-visible transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle Glow aura */}
          <circle cx="55" cy="55" r="48" fill="#10b981" opacity="0.12" />

          {/* Character Body (Lab coat) */}
          <g>
            {/* Blue inner shirt */}
            <path d="M38 72 L72 72 L76 102 L34 102 Z" fill="#0284c7" />
            {/* White Lab Coat */}
            <path d="M26 76 L42 72 L48 95 L22 98 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M84 76 L68 72 L62 95 L88 98 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Green Bowtie */}
            <polygon points="50,71 60,71 57,75 60,79 50,79 53,75" fill="#10b981" />
            <circle cx="55" cy="75" r="2" fill="#047857" />
          </g>

          {/* Character Head */}
          <g>
            {/* Hair */}
            <path d="M28 46 Q24 25 45 20 Q55 18 68 20 Q86 25 82 46 Z" fill="#f59e0b" />
            {/* Face base */}
            <circle cx="55" cy="48" r="26" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />
            {/* Ears */}
            <circle cx="28" cy="48" r="5" fill="#fde047" />
            <circle cx="82" cy="48" r="5" fill="#fde047" />

            {/* Eyes and Mouth based on mood */}
            {getMoodEyeStyle()}

            {/* Role specific hat/goggles */}
            {getRoleHeadwear()}
          </g>

          {/* Chemical Erlenmeyer Flask in hand */}
          <g className="animate-pulse">
            <path d="M85 86 L95 86 L102 98 L78 98 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="88" y="78" width="4" height="8" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            {/* Bubbles in flask */}
            <circle cx="88" cy="94" r="2" fill="#ffffff" />
            <circle cx="94" cy="91" r="1.5" fill="#ffffff" />
            <circle cx="91" cy="88" r="1" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Comic Speech Bubble */}
      {speechText && (
        <div className="relative bg-slate-900 border-2 border-emerald-500/60 text-slate-100 px-4 py-2.5 rounded-2xl shadow-xl max-w-sm sm:max-w-md text-xs sm:text-sm font-medium leading-snug">
          {/* Arrow pointing to character */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-emerald-500/80"></div>
          <span className="font-bold text-emerald-400 block mb-0.5 text-[11px] uppercase tracking-wider">
            {role === 'explorer' ? 'Kalandor Kémikus' : role === 'detective' ? 'Labor Detektív' : role === 'auditor' ? 'Vegyész Auditor' : role === 'engineer' ? 'Finomító Mérnök' : 'Alkán Professzor'} mondja:
          </span>
          <p>{speechText}</p>
        </div>
      )}
    </div>
  );
};
