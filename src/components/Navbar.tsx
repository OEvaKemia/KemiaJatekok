import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Home } from 'lucide-react';
import { sound } from '../utils/sound';
import { GameId } from '../types';

interface NavbarProps {
  activeGameId: GameId | null;
  onSelectGame: (id: GameId | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeGameId, onSelectGame }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const handleToggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectGame(null);
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
            C<sub>n</sub>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
            Alkánok Kémiai Játékbirodalom
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame(null);
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === null ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Főmenü</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame('treasure-hunt');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === 'treasure-hunt' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            1. Kincskeresés
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame('chemical-domino');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === 'chemical-domino' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            2. Dominó
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame('lab-mystery');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === 'lab-mystery' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            3. A labor rejtélye
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame('error-hunter');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === 'error-hunter' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            4. Hibavadászat
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectGame('refinery-mission');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeGameId === 'refinery-mission' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            5. Időküldetés
          </button>
        </nav>

        {/* Zone 3: Primary Action / Projector Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Hang bekapcsolása' : 'Hang némítása'}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Hang beállítása"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Kilépés a teljes képernyőből' : 'Teljes képernyő (Kivetítéshez)'}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Teljes képernyő váltása"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-emerald-400" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
