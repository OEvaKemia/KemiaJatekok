/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeMenu } from './components/HomeMenu';
import { ResultModal } from './components/ResultModal';
import { TreasureHuntGame } from './games/TreasureHunt/TreasureHuntGame';
import { ChemicalDominoGame } from './games/ChemicalDomino/ChemicalDominoGame';
import { LabMysteryGame } from './games/LabMystery/LabMysteryGame';
import { ErrorHunterGame } from './games/ErrorHunter/ErrorHunterGame';
import { RefineryMissionGame } from './games/RefineryMission/RefineryMissionGame';
import { GameId, GameResult } from './types';
import { sound } from './utils/sound';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleSelectGame = (gameId: GameId | null) => {
    setActiveGameId(gameId);
    setGameResult(null);
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
  };

  const handleRestart = () => {
    setGameResult(null);
    // Trigger re-mount of current game
    const current = activeGameId;
    setActiveGameId(null);
    setTimeout(() => {
      setActiveGameId(current);
    }, 10);
  };

  const handleHome = () => {
    sound.playClick();
    setActiveGameId(null);
    setGameResult(null);
  };

  const handleNextGame = (nextId: GameId) => {
    sound.playClick();
    setGameResult(null);
    setActiveGameId(nextId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar adhering to Top Bar contract */}
      <Navbar
        activeGameId={activeGameId}
        onSelectGame={handleSelectGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {activeGameId === null && (
          <HomeMenu onSelectGame={handleSelectGame} />
        )}

        {activeGameId === 'treasure-hunt' && (
          <TreasureHuntGame
            onComplete={handleGameComplete}
            onExit={handleHome}
          />
        )}

        {activeGameId === 'chemical-domino' && (
          <ChemicalDominoGame
            onComplete={handleGameComplete}
            onExit={handleHome}
          />
        )}

        {activeGameId === 'lab-mystery' && (
          <LabMysteryGame
            onComplete={handleGameComplete}
            onExit={handleHome}
          />
        )}

        {activeGameId === 'error-hunter' && (
          <ErrorHunterGame
            onComplete={handleGameComplete}
            onExit={handleHome}
          />
        )}

        {activeGameId === 'refinery-mission' && (
          <RefineryMissionGame
            onComplete={handleGameComplete}
            onExit={handleHome}
          />
        )}
      </main>

      {/* End-Game Result Modal */}
      {gameResult && (
        <ResultModal
          result={gameResult}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Subtle classroom footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-900 bg-slate-950 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Alkánok Kémiai Játékbirodalom · Líceumi szerves kémia tananyag</p>
        <p className="font-mono text-slate-400">Időtartam: ~5–6 perc / játék</p>
      </footer>
    </div>
  );
}
