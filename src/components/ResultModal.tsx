import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, RotateCcw, Home, BookOpen, AlertCircle, Award } from 'lucide-react';
import { GameResult } from '../types';
import { sound } from '../utils/sound';

interface ResultModalProps {
  result: GameResult;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    sound.playFanfare();
    if (result.score >= 7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.score]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 my-auto">
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-lg shadow-emerald-950/50">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Célba Érés! Játék Értékelése
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {result.gameTitle} · {result.pdfTitle}
          </p>
        </div>

        {/* 10-point Grade Scale KPI Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-emerald-500/40 text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-400 block mb-1 font-bold">
              Érdemjegy / Pont
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {Number(result.score).toFixed(1)} <span className="text-base font-normal text-slate-400">/ 10</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              (Maximális: 10-es)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
              Százalék
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
              {result.percentage}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              sikerességi ráta
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Idő
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
              {formatTime(result.elapsedSeconds)}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              5 perces keret
            </span>
          </div>
        </div>

        {/* Teacher's Assessment Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/40 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Javaslat a Tanár Számára (Líceumi 10-es Skála)
              </h4>
              <p className="text-base sm:text-lg font-bold text-white">
                {result.teacherRecommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Practice Areas */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Erősségek a feladatban</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
              {result.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Gyakorlási javaslat</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
              {result.reviewAreas.map((rev, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0 font-bold">•</span>
                  <span>{rev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons: Independent game termination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Játék Újrajátszása</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Visszatérés a Főmenübe</span>
          </button>
        </div>
      </div>
    </div>
  );
};

