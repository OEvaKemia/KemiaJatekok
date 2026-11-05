import React from 'react';
import { Check, Compass, Anchor, Mountain, Skull, Footprints, Sparkles } from 'lucide-react';

interface TreasureIslandMapProps {
  currentStation: number; // 0 to 5
  unlockedStations: boolean[];
  onSelectStation?: (index: number) => void;
}

export const TreasureIslandMap: React.FC<TreasureIslandMapProps> = ({
  currentStation,
  unlockedStations,
  onSelectStation,
}) => {
  const stations = [
    { id: 1, name: 'Kalózöböl & Part', x: 120, y: 195, icon: '⚓', label: '1. Partraszállás' },
    { id: 2, name: 'CₙH₂ₙ₊₂ Oltárkő', x: 235, y: 140, icon: '🗿', label: '2. Képlet-monolit' },
    { id: 3, name: 'Metilén-Kanyon Híd', x: 360, y: 205, icon: '🌉', label: '3. Homológ-híd' },
    { id: 4, name: 'Névadási Barlang', x: 485, y: 135, icon: '💎', label: '4. IUPAC-kristályok' },
    { id: 5, name: 'Szénatomok Keresztútja', x: 610, y: 195, icon: '🧭', label: '5. C-rendűség' },
    { id: 6, name: 'Koponya-hegy & Kincs', x: 715, y: 110, icon: '👑', label: '6. Kincsesláda (X)' },
  ];

  return (
    <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-600/40 bg-gradient-to-b from-sky-950 via-teal-950 to-slate-950 shadow-2xl relative mb-6">
      {/* Antique Map Header Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-amber-950/80 border-b border-amber-600/30 text-amber-200 text-xs font-serif">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
          <span className="font-bold tracking-widest uppercase">Alkán Kincses Sziget · Tengerésztérkép</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-sans text-amber-300/80">
          <span className="hidden sm:inline">Kövessd a szaggatott ösvényt az Arany Kincsesládáig!</span>
          <span className="font-bold font-mono px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700">
            {currentStation + 1} / 6 Állomás
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[8/3] min-h-[220px] max-h-[320px]">
        <svg
          viewBox="0 0 800 300"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Water Waves pattern */}
            <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="50%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>

            {/* Sand beach gradient */}
            <linearGradient id="sandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Lush jungle gradient */}
            <radialGradient id="jungleGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="70%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>

            {/* Mountain rock gradient */}
            <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Ocean Background */}
          <rect width="800" height="300" fill="url(#oceanGrad)" />

          {/* Decorative Sea Waves */}
          <g opacity="0.3" stroke="#5eead4" strokeWidth="1.5" fill="none">
            <path d="M 40 50 Q 60 40 80 50 T 120 50" />
            <path d="M 680 250 Q 700 240 720 250 T 760 250" />
            <path d="M 50 260 Q 70 250 90 260 T 130 260" />
            <path d="M 670 40 Q 690 30 710 40 T 750 40" />
            <path d="M 380 30 Q 400 20 420 30 T 460 30" />
          </g>

          {/* Pirate Ship in the Bay */}
          <g transform="translate(45, 175) scale(0.7)">
            <ellipse cx="35" cy="50" rx="30" ry="8" fill="#042f2e" opacity="0.4" />
            <path d="M 10 40 Q 35 55 65 40 L 58 48 Q 35 60 15 48 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <line x1="36" y1="45" x2="36" y2="10" stroke="#451a03" strokeWidth="2" />
            <path d="M 36 12 Q 52 18 36 28 Q 50 34 36 40" fill="#fef3c7" stroke="#b45309" />
            <circle cx="36" cy="8" r="3" fill="#dc2626" />
          </g>

          {/* The Island Landmass: Sand Coastline */}
          <path
            d="M 80 200 
               C 70 150, 110 90, 190 70 
               C 270 50, 360 65, 450 60 
               C 550 55, 660 70, 750 100 
               C 780 130, 770 190, 720 230 
               C 660 270, 560 275, 470 265 
               C 380 255, 300 270, 200 260 
               C 120 250, 90 230, 80 200 Z"
            fill="url(#sandGrad)"
            stroke="#b45309"
            strokeWidth="3"
            filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.4))"
          />

          {/* Island Interior: Lush Jungle */}
          <path
            d="M 105 190 
               C 95 155, 130 105, 200 88 
               C 270 72, 355 80, 440 78 
               C 530 75, 640 88, 725 112 
               C 745 140, 740 180, 695 215 
               C 645 248, 550 252, 465 242 
               C 385 235, 310 248, 215 240 
               C 145 232, 115 215, 105 190 Z"
            fill="url(#jungleGrad)"
            stroke="#14532d"
            strokeWidth="2"
          />

          {/* Volcanic Crag & Mountain Ridge in center */}
          <g>
            <polygon points="370,120 330,170 410,170" fill="url(#rockGrad)" stroke="#1e293b" />
            <polygon points="430,110 390,165 470,165" fill="url(#rockGrad)" stroke="#1e293b" />
            <polygon points="390,100 360,150 420,150" fill="#475569" />
            {/* Crater smoke */}
            <path d="M 390 100 Q 380 85 395 70 Q 405 55 390 40" stroke="#cbd5e1" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="3,3" />
          </g>

          {/* Palm Trees dotted around */}
          {[
            { cx: 160, cy: 130 },
            { cx: 280, cy: 220 },
            { cx: 530, cy: 90 },
            { cx: 660, cy: 150 },
            { cx: 220, cy: 230 },
          ].map((pt, i) => (
            <g key={i} transform={`translate(${pt.cx}, ${pt.cy}) scale(0.6)`}>
              <path d="M 0 20 Q 5 10 2 0" stroke="#78350f" strokeWidth="3" fill="none" />
              <circle cx="2" cy="-2" r="10" fill="#15803d" />
              <path d="M 2 -2 Q -8 -10 -15 -5 M 2 -2 Q 12 -10 19 -5 M 2 -2 Q 0 -16 2 -22 M 2 -2 Q -10 6 -16 10 M 2 -2 Q 14 6 20 10" stroke="#22c55e" strokeWidth="2" fill="none" />
            </g>
          ))}

          {/* Skull Mountain near Station 6 */}
          <g transform="translate(680, 80) scale(0.7)">
            <ellipse cx="20" cy="20" rx="16" ry="14" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
            <circle cx="14" cy="18" r="3.5" fill="#0f172a" />
            <circle cx="26" cy="18" r="3.5" fill="#0f172a" />
            <polygon points="20,22 18,26 22,26" fill="#0f172a" />
            <rect x="15" y="29" width="10" height="5" fill="#cbd5e1" stroke="#334155" />
            <line x1="18" y1="29" x2="18" y2="34" stroke="#334155" />
            <line x1="22" y1="29" x2="22" y2="34" stroke="#334155" />
          </g>

          {/* Dashed Golden Expedition Trail */}
          <path
            d="M 120 195 
               Q 175 160 235 140 
               Q 295 160 360 205 
               Q 420 160 485 135 
               Q 545 160 610 195 
               Q 665 145 715 110"
            fill="none"
            stroke="#fef08a"
            strokeWidth="3.5"
            strokeDasharray="6,6"
            strokeLinecap="round"
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.6))"
          />

          {/* Station Markers on the Map */}
          {stations.map((st, idx) => {
            const isCurrent = idx === currentStation;
            const isCompleted = idx < currentStation;
            const isUnlocked = unlockedStations[idx];

            return (
              <g
                key={st.id}
                transform={`translate(${st.x}, ${st.y})`}
                className={`transition-all select-none ${
                  isUnlocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => {
                  if (onSelectStation && isUnlocked) {
                    onSelectStation(idx);
                  }
                }}
              >
                {/* Station Glow Ring when active */}
                {isCurrent && (
                  <circle
                    r="28"
                    fill="#eab308"
                    opacity="0.35"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Outer Ring on Hover / Active */}
                {isCurrent && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin"
                    style={{ animationDuration: '10s' }}
                  />
                )}

                {/* Base Marker Circle */}
                <circle
                  r={isCurrent ? "18" : "14"}
                  fill={
                    isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? '#f59e0b'
                      : isUnlocked
                      ? '#334155'
                      : '#1e293b'
                  }
                  stroke={isCurrent ? '#ffffff' : '#0f172a'}
                  strokeWidth="2.5"
                  filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.5))"
                />

                {/* Inner Icon / Status */}
                {isCompleted ? (
                  <path
                    d="M -5 0 L -1 4 L 6 -3"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                ) : isCurrent ? (
                  <text
                    y="4"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="#0f172a"
                  >
                    ★
                  </text>
                ) : (
                  <text
                    y="4"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#94a3b8"
                  >
                    {idx + 1}
                  </text>
                )}

                {/* Explorer Avatar Pin on active station */}
                {isCurrent && (
                  <g transform="translate(0, -32)">
                    {/* Bouncing Prompt Tooltip */}
                    <g className="animate-bounce" style={{ animationDuration: '1.5s' }}>
                      <rect x="-38" y="-24" width="76" height="17" rx="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      <text y="-12" textAnchor="middle" fontSize="9" fontWeight="900" fill="#0f172a">KATTINTS IDE!</text>
                      <polygon points="0,-7 -4,-3 4,-3" fill="#f59e0b" />
                    </g>
                    <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text y="4" textAnchor="middle" fontSize="11">🤠</text>
                  </g>
                )}

                {/* Red X for the Treasure at Station 6 */}
                {idx === 5 && (
                  <g transform="translate(18, -14)">
                    <text fontSize="18" fontWeight="black" fill="#ef4444">✖</text>
                    <text x="14" y="0" fontSize="15">💎</text>
                  </g>
                )}

                {/* Station Title Label Pill */}
                <g transform={`translate(0, ${idx % 2 === 0 ? 25 : -24})`}>
                  <rect
                    x="-45"
                    y="-9"
                    width="90"
                    height="18"
                    rx="5"
                    fill={isCurrent ? '#78350f' : '#0f172a'}
                    stroke={isCurrent ? '#fde047' : '#334155'}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    textAnchor="middle"
                    y="3"
                    fontSize="9"
                    fontWeight="bold"
                    fill={isCurrent ? '#fef08a' : '#e2e8f0'}
                  >
                    {st.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Compass Rose in Top Left */}
          <g transform="translate(60, 45) scale(0.65)">
            <circle cx="0" cy="0" r="22" fill="#78350f" stroke="#fde047" strokeWidth="2" opacity="0.8" />
            <polygon points="0,-18 4,-4 0,0 -4,-4" fill="#ef4444" />
            <polygon points="0,18 4,4 0,0 -4,4" fill="#e2e8f0" />
            <polygon points="18,0 4,4 0,0 4,-4" fill="#e2e8f0" />
            <polygon points="-18,0 -4,4 0,0 -4,-4" fill="#e2e8f0" />
            <circle cx="0" cy="0" r="3" fill="#fde047" />
            <text x="0" y="-22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fef08a">É</text>
          </g>
        </svg>
      </div>
    </div>
  );
};
