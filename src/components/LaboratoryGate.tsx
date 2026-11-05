import React, { useState } from 'react';
import { DoorClosed, DoorOpen, KeyRound, Sparkles, Shield, ArrowRight, Atom } from 'lucide-react';
import { sound } from '../utils/sound';
import { ChemistAvatar } from './ChemistAvatar';

interface LaboratoryGateProps {
  labTitle: string;
  lessonName: string;
  instructionText: string;
  onEnter: () => void;
}

export const LaboratoryGate: React.FC<LaboratoryGateProps> = ({
  labTitle,
  lessonName,
  instructionText,
  onEnter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGate = () => {
    if (isOpening || isOpen) return;
    sound.playClick();
    setIsOpening(true);

    setTimeout(() => {
      sound.playCorrect();
    }, 200);

    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        onEnter();
      }, 700);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Top Banner Info with Animated Character Greeting */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 max-w-2xl w-full">
        <ChemistAvatar
          mood={isOpen ? 'cheering' : 'happy'}
          role="professor"
          speechText="Üdvözöllek a kémiai állomáson! Készen állsz az alkánok titkainak felfedezésére? Kattints a kapu kilincsére, és lépjünk be!"
          size="lg"
        />
      </div>

      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1.5">
          <Atom className="w-4 h-4" />
          <span>Líceumi Szerves Kémiai Kutatóállomás</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {labTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {lessonName}
        </p>
      </div>

      {/* Visual Laboratory Portal Container */}
      <div className="relative w-full max-w-2xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Arch Frame & Industrial Warning Header */}
        <div className="z-10 bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>BIZTONSÁGI ZÓNA · KÉMIAI LABORATÓRIUM</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-slate-400 text-[11px]">
            <span>NYOMÁS: 1.0 ATM</span>
            <span className="text-emerald-400 font-bold">STÁTUSZ: {isOpen ? 'NYITVA' : 'KÉSZENLÉTBEN'}</span>
          </div>
        </div>

        {/* The Laboratory Doors: Left and Right sliding leaves */}
        <div className="absolute inset-0 top-12 bottom-3 mx-3 overflow-hidden rounded-2xl flex">
          {/* Left Door Leaf (Real Chemical Lab Door with Vision Glass) */}
          <div
            className={`w-1/2 h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-850 border-r-2 border-slate-700 flex flex-col justify-between p-4 sm:p-6 transition-all duration-700 ease-in-out relative ${
              isOpen || isOpening ? '-translate-x-full opacity-30' : 'translate-x-0'
            }`}
          >
            {/* Top Lab Glass Vision Panel (Wire-reinforced safety glass) */}
            <div className="w-full h-24 sm:h-28 rounded-xl bg-cyan-950/40 border-2 border-slate-600 shadow-inner flex flex-col items-center justify-center p-2 relative overflow-hidden backdrop-blur-sm">
              <span className="text-2xl animate-pulse">🧪</span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1">SZERVES KÉMIA LABOR</span>
              {/* Glass glare line */}
              <div className="absolute -top-10 -left-10 w-40 h-8 bg-white/10 rotate-45 pointer-events-none"></div>
            </div>

            {/* GHS Chemical Safety Decals & Blue ISO Goggles Symbol */}
            <div className="flex items-center gap-2">
              {/* ISO Safety Goggles Blue Circle */}
              <div className="w-8 h-8 rounded-full bg-blue-600 border border-white flex items-center justify-center text-xs shadow" title="Védőszemüveg használata kötelező">
                👓
              </div>
              {/* GHS Flammable Diamond */}
              <div className="w-7 h-7 bg-white border-2 border-rose-600 rotate-45 flex items-center justify-center shadow" title="Tűzveszélyes alkánok">
                <span className="-rotate-45 text-[11px]">🔥</span>
              </div>
              <span className="text-[10px] text-slate-300 font-mono">MSZ ISO 7010</span>
            </div>

            {/* Stainless Steel Push Bar */}
            <div className="w-full h-4 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border border-slate-600 shadow-lg flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-widest">NYOMÓRÚD · PUSH</span>
            </div>
          </div>

          {/* Right Door Leaf */}
          <div
            className={`w-1/2 h-full bg-gradient-to-l from-slate-900 via-slate-800 to-slate-850 border-l-2 border-slate-700 flex flex-col justify-between p-4 sm:p-6 transition-all duration-700 ease-in-out relative ${
              isOpen || isOpening ? 'translate-x-full opacity-30' : 'translate-x-0'
            }`}
          >
            {/* Top Lab Glass Vision Panel */}
            <div className="w-full h-24 sm:h-28 rounded-xl bg-emerald-950/40 border-2 border-slate-600 shadow-inner flex flex-col items-center justify-center p-2 relative overflow-hidden backdrop-blur-sm">
              <span className="text-2xl animate-pulse">⚗️</span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold mt-1">CₙH₂ₙ₊₂ REAKCIÓZÓNA</span>
              <div className="absolute -top-10 -left-10 w-40 h-8 bg-white/10 rotate-45 pointer-events-none"></div>
            </div>

            {/* GHS Hazard Decals */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-[10px] text-slate-300 font-mono">ISO 17025</span>
              {/* GHS Corrosive / Caution Diamond */}
              <div className="w-7 h-7 bg-white border-2 border-rose-600 rotate-45 flex items-center justify-center shadow" title="Vegyipari előírás">
                <span className="-rotate-45 text-[11px]">⚠️</span>
              </div>
              {/* Lab Coat required */}
              <div className="w-8 h-8 rounded-full bg-blue-600 border border-white flex items-center justify-center text-xs shadow" title="Laboratóriumi köpeny kötelező">
                🥼
              </div>
            </div>

            {/* Stainless Steel Push Bar */}
            <div className="w-full h-4 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border border-slate-600 shadow-lg flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-widest">NYOMÓRÚD · PUSH</span>
            </div>
          </div>

          {/* Center Vault Door Handle & Lock Interface (overlaid) */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
              isOpening || isOpen ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-amber-500/80 shadow-2xl flex items-center justify-center mb-3">
              <Shield className="w-10 h-10 text-amber-400" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-slate-950/90 border border-slate-700 text-xs font-mono text-slate-300">
              ELEKTRONIKUS ZÁRSZERKEZET
            </div>
          </div>

          {/* Revealing Lab Interior behind the doors */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="w-12 h-12 text-emerald-400 animate-spin duration-1000 mb-2" />
            <h4 className="text-xl font-bold text-white mb-1">A Laboratórium Kapuja Kitárult!</h4>
            <p className="text-xs text-emerald-300">Belépés a feladatokhoz folyamatban...</p>
          </div>
        </div>

        {/* Bottom Interactive Trigger Area */}
        <div className="z-10 mt-auto pt-4 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm text-slate-300 text-center mb-3 font-medium">
            {instructionText}
          </p>

          <button
            onClick={handleOpenGate}
            disabled={isOpening || isOpen}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-base transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            {isOpening || isOpen ? (
              <>
                <DoorOpen className="w-5 h-5 text-slate-950" />
                <span>KAPU NYILIK... BELÉPÉS</span>
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5 text-slate-950" />
                <span>KATTINTS A KAPU NYITÁSÁHOZ ÉS A BELÉPÉSHEZ!</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
