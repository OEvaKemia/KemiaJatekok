import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Clock, CheckCircle2, ChevronRight, Zap, Droplets, Award, Factory, Gauge, Camera, Maximize2, X, Eye } from 'lucide-react';
import { sound } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { ChemistAvatar } from '../../components/ChemistAvatar';
import { GameResult } from '../../types';
import { ASSETS } from '../../assets';

interface RefineryMissionProps {
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface MissionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export const RefineryMissionGame: React.FC<RefineryMissionProps> = ({ onComplete, onExit }) => {
  const [missionPhase, setMissionPhase] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [gradeScore, setGradeScore] = useState<number>(10.0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isRefineryPhotoModalOpen, setIsRefineryPhotoModalOpen] = useState<boolean>(false);
  const [phase1ViewMode, setPhase1ViewMode] = useState<'schematic' | 'photo'>('schematic');

  // Phase 1 state: Fraction ordering
  const INITIAL_FRACTIONS = [
    { id: 'f-diesel', name: 'Gázolaj (Dízel)', range: 'kb. C₁₅–C₂₀', correctRank: 5 },
    { id: 'f-lpg', name: 'PB-gáz (propán, bután)', range: 'C₃–C₄', correctRank: 2 },
    { id: 'f-bitumen', name: 'Bitumen', range: 'kb. C₃₅ felett', correctRank: 8 },
    { id: 'f-petrol', name: 'Benzin', range: 'kb. C₅–C₁₀', correctRank: 3 },
    { id: 'f-natural-gas', name: 'Földgáz (metán, etán)', range: 'C₁–C₄', correctRank: 1 },
    { id: 'f-kerosene', name: 'Petróleum (Kerozin, Jet A-1)', range: 'kb. C₁₀–C₁₆', correctRank: 4 },
    { id: 'f-wax', name: 'Paraffinviasz', range: 'kb. C₂₀–C₄₀', correctRank: 7 },
    { id: 'f-lube', name: 'Kenőolaj', range: 'kb. C₂₀–C₃₅', correctRank: 6 },
  ];

  const [fractions, setFractions] = useState(() => shuffleArray(INITIAL_FRACTIONS));
  const [isFractionsChecked, setIsFractionsChecked] = useState(false);

  // Phase 2 state: Engine duel sorting
  interface EngineCard {
    id: string;
    text: string;
    correctEngine: 'otto' | 'diesel';
  }

  const RAW_ENGINE_CARDS: EngineCard[] = [
    { id: 'ec-1', text: 'Gyújtógyertya elektromos szikrája gyújtja meg az üzemanyag-levegő elegyet', correctEngine: 'otto' },
    { id: 'ec-2', text: 'A hengerben csak forró levegőt sűrítenek 500 °C fölé, és abba porlasztják be az üzemanyagot', correctEngine: 'diesel' },
    { id: 'ec-3', text: 'Minőségmutatója az oktánszám (izooktán = 100, n-heptán = 0)', correctEngine: 'otto' },
    { id: 'ec-4', text: 'Minőségmutatója a cétszám (cetán = 100)', correctEngine: 'diesel' },
    { id: 'ec-5', text: 'Szénlánchossz: kb. C₅–C₁₀; forrástartomány: 30–200 °C', correctEngine: 'otto' },
    { id: 'ec-6', text: 'Szénlánchossz: kb. C₁₅–C₂₀; forrástartomány: 180–360 °C', correctEngine: 'diesel' },
    { id: 'ec-7', text: 'Alapvető elvárás: nehezen öngyulladó legyen a kopogás elkerülése érdekében', correctEngine: 'otto' },
    { id: 'ec-8', text: 'Alapvető elvárás: könnyen öngyulladjon a forró sűrített levegőben', correctEngine: 'diesel' },
  ];

  const engineCards = useMemo(() => shuffleArray(RAW_ENGINE_CARDS), []);
  const [engineCardIndex, setEngineCardIndex] = useState(0);

  // Phase 3 Options (SAF) - shuffled
  const RAW_PHASE_3_OPTIONS: MissionOption[] = [
    {
      id: 'p3-opt-1',
      text: 'A Jet A-1 a kőolaj C₁₀–C₁₆ frakciója; a 2025. jan. 1-től érvényes rendelet szerint a repülőterek kerozinjába fenntartható repülőtüzelőanyagot (SAF) kell keverni (2% 2025-től, 6% 2030-tól, 70% 2050-re), amelyet pl. használt sütőolajból és biomasszából készítenek.',
      isCorrect: true,
    },
    {
      id: 'p3-opt-2',
      text: 'A kerozin szobahőmérsékleten gáz halmazállapotú, és kizárólag szilárd paraffinviaszból szintetizálják.',
      isCorrect: false,
    },
    {
      id: 'p3-opt-3',
      text: 'A modern repülőgépek turbinái kizárólag tiszta hidrogéngázzal üzemelnek, a kerozint betiltották.',
      isCorrect: false,
    },
  ];
  const phase3Options = useMemo(() => shuffleArray(RAW_PHASE_3_OPTIONS), []);
  const [phase3SelectedId, setPhase3SelectedId] = useState<string | null>(null);
  const [phase3Checked, setPhase3Checked] = useState(false);

  // Phase 4 Options (n-hexane & insects) - shuffled
  const RAW_PHASE_4_OPTIONS: MissionOption[] = [
    {
      id: 'p4-opt-1',
      text: 'Az n-hexán károsíthatja az idegrendszert (ezért gyakran heptánra cserélik); a rovarok kutikuláját fedő C₂₁–C₃₅ alkán viaszréteg pedig gátolja a vízvesztést és a hangyák egyedi „vegyi névjegye”.',
      isCorrect: true,
    },
    {
      id: 'p4-opt-2',
      text: 'Az n-hexán teljesen ártalmatlan vitamin az emberi szervezet számára, a rovarok pedig metánt lélegeznek be oxigén helyett.',
      isCorrect: false,
    },
    {
      id: 'p4-opt-3',
      text: 'A rovarok kutikulája kizárólag szén-dioxidból áll, az alkánok pedig azonnal feloldják a kitint.',
      isCorrect: false,
    },
  ];
  const phase4Options = useMemo(() => shuffleArray(RAW_PHASE_4_OPTIONS), []);
  const [phase4SelectedId, setPhase4SelectedId] = useState<string | null>(null);
  const [phase4Checked, setPhase4Checked] = useState(false);

  // Phase 5 Options (Stoichiometry from slide 15) - shuffled
  const RAW_PHASE_5_OPTIONS: MissionOption[] = [
    {
      id: 'p5-opt-1',
      text: '44 g propán (1 mol propánból éppen 3 mol = 132 g CO₂ képződik a reakcióban)',
      isCorrect: true,
    },
    {
      id: 'p5-opt-2',
      text: '88 g propán (mert 2 mol propán szükséges 3 mol gázhoz)',
      isCorrect: false,
    },
    {
      id: 'p5-opt-3',
      text: '132 g propán (tömegmegmaradás miatt pontosan ugyanannyi gramm)',
      isCorrect: false,
    },
    {
      id: 'p5-opt-4',
      text: '22 g propán (a propán felének felel meg)',
      isCorrect: false,
    },
  ];
  const phase5Options = useMemo(() => shuffleArray(RAW_PHASE_5_OPTIONS), []);
  const [phase5SelectedId, setPhase5SelectedId] = useState<string | null>(null);
  const [phase5Checked, setPhase5Checked] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  // Countdown Timer
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handleTimeExpired = () => {
    setIsGameOver(true);
    finishMission(gradeScore - 1.5);
  };

  // Fraction movement handlers
  const moveFraction = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newFractions = [...fractions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFractions.length) return;

    const temp = newFractions[index];
    newFractions[index] = newFractions[targetIdx];
    newFractions[targetIdx] = temp;
    setFractions(newFractions);
    setIsFractionsChecked(false);
  };

  const checkFractionOrder = () => {
    const isCorrect = fractions.every((f, idx) => f.correctRank === idx + 1);
    if (isCorrect) {
      sound.playCorrect();
      setIsFractionsChecked(true);
      setFeedback('Kiváló! A kőolajlepárló kolonna frakciói a növekvő forráspont és szénatomszám szerint pontos sorrendben vannak!');
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback('A sorrend még nem tökéletes! Emlékezz: Földgáz (C₁–₄) → PB-gáz → Benzin → Kerozin → Gázolaj → Kenőolaj → Paraffin → Bitumen (C₃₅+)!');
    }
  };

  // Phase 2 engine card sorter
  const handleSortEngineCard = (chosen: 'otto' | 'diesel') => {
    const card = engineCards[engineCardIndex];
    if (card.correctEngine === chosen) {
      sound.playCorrect();
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.5).toFixed(1))));
    }

    if (engineCardIndex + 1 < engineCards.length) {
      setEngineCardIndex((prev) => prev + 1);
    } else {
      sound.playCorrect();
      setMissionPhase(3);
      setFeedback(null);
    }
  };

  // Phase 3 handler (SAF)
  const handleCheckPhase3 = (id: string) => {
    setPhase3SelectedId(id);
    const opt = phase3Options.find((o) => o.id === id);
    if (opt?.isCorrect) {
      sound.playCorrect();
      setPhase3Checked(true);
      setFeedback('Pontos! Az EU ReFuelEU Aviation rendelet kötelezi az üzemanyag-ellátókat fenntartható SAF keverésére: 2% 2025-től, 70% 2050-ig!');
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback('Nem jó válasz. Nézd meg a 8. diát: a SAF-ot sütőolajból, biomasszából állítják elő és 2025-től 2%-ot, 2050-re 70%-ot ír elő az EU!');
    }
  };

  // Phase 4 handler (n-hexane & insects)
  const handleCheckPhase4 = (id: string) => {
    setPhase4SelectedId(id);
    const opt = phase4Options.find((o) => o.id === id);
    if (opt?.isCorrect) {
      sound.playCorrect();
      setPhase4Checked(true);
      setFeedback('Helyes! Az n-hexán neurotoxikus (idegrendszer-károsító), míg a rovarok C₂₁–C₃₅ alkán viaszrétege védi a testüket a kiszáradástól és hangyák vegyi névjegye!');
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback('Nem helyes. Tekintsd át a 12. és 13. diát: n-hexán károsítja az idegrendszert (gyakran heptánra cserélik), a rovarok kutikulája pedig C₂₁–C₃₅ alkán viasz.');
    }
  };

  // Phase 5 handler (Stoichiometry calculation from slide 15)
  const handleCheckPhase5 = (id: string) => {
    setPhase5SelectedId(id);
    const opt = phase5Options.find((o) => o.id === id);
    if (opt?.isCorrect) {
      sound.playCorrect();
      setPhase5Checked(true);
      setFeedback('Zseniális számítás! C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. 132 g CO₂ = 3 mol CO₂. 3 mol CO₂ pontosan 1 mol propánból (44 g) keletkezik!');
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback('Számolási hiba! 132 g CO₂ moláris tömege 44 g/mol, azaz pontosan 3 mól. 1 mol propánból épp 3 mol CO₂ képződik, tehát 1 mol = 44 g propán égett el!');
    }
  };

  const finishMission = (finalScore: number) => {
    setIsGameOver(true);
    const validScore = Math.max(3.0, Math.min(10.0, Number(finalScore.toFixed(1))));
    const percentage = Math.round((validScore / 10.0) * 100);
    const elapsedSeconds = 300 - timeLeft;

    const strengths: string[] = [
      'Kőolajlepárlási frakciók forráspont szerinti helyes sorrendje',
      'Otto-motor (oktánszám, szikra) vs. Dízelmotor (cétszám, sűrítés)',
      'Kerozin és a modern EU ReFuelEU SAF fenntartható szabályozás',
      'Sztöchiometriai égésszámítás (132 g CO₂ keletkezése 44 g propánból)',
    ];

    const reviewAreas: string[] = [];
    if (mistakes > 0) {
      reviewAreas.push('n-hexán munkavédelmi kockázata és az üzemanyagok forrástartománya');
    } else {
      reviewAreas.push('Minden finomítói és üzemanyag-technológiai feladat hibátlanul megoldva!');
    }

    let teacherRecommendation = '';
    if (validScore >= 9.5) {
      teacherRecommendation = 'Kiváló finomítói vezetés az időkeretben! Javaslat: 10-es érdemjegy beírása a katalógusba.';
    } else if (validScore >= 8.5) {
      teacherRecommendation = 'Nagyon jó munka az időnyomás alatt! Javaslat: 9-es érdemjegy vagy piros pont adása.';
    } else if (validScore >= 7.0) {
      teacherRecommendation = 'Jó eredmény! Javaslat: 7-es vagy 8-as érdemjegy adása.';
    } else {
      teacherRecommendation = 'Közepes szint, a frakciók és a motorok tulajdonságainak átismétlése szükséges.';
    }

    onComplete({
      gameId: 'refinery-mission',
      gameTitle: 'Finomító és Üzemanyag Mester',
      pdfTitle: 'Alkánok a gyakorlatban – Kőolajfrakciók és üzemanyagok',
      score: validScore,
      maxScore: 10,
      percentage,
      elapsedSeconds,
      completedAt: new Date().toLocaleTimeString(),
      strengths,
      reviewAreas,
      teacherRecommendation,
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Industrial Hazard Warning Strip */}
      <div
        className="h-2.5 w-full rounded-full mb-4 shadow-md"
        style={{
          background: 'repeating-linear-gradient(45deg, #eab308, #eab308 14px, #18181b 14px, #18181b 28px)',
        }}
      />

      {/* Top Header & Mission HUD with Industrial Steel Plate Styling */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 border-2 border-zinc-700 mb-6 shadow-2xl relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Factory className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                IPARI FINOMÍTÓ VEZÉRLŐKÖZPONT · 5. JÁTÉK
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase font-mono">
              Petrokémiai Frakcionáló & Motor Diagnosztika
            </h2>
          </div>
        </div>

        {/* Industrial Analog Pressure & Sensor Readings */}
        <div className="flex items-center gap-3 text-sm font-mono">
          {/* Mini Analog Manometer Dial */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-black border border-zinc-700 text-zinc-300">
            <Gauge className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-xs">NYOMÁS: <span className="text-cyan-400 font-bold">24.5 BAR</span></span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border font-bold tabular-nums flex items-center gap-1.5 ${
            timeLeft < 60 ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' : 'bg-zinc-900 border-zinc-700 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
            Fázis: <span className="text-cyan-400 font-bold tabular-nums">{missionPhase}</span> / 5
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/40 text-zinc-300">
            Érdemjegy: <span className="text-emerald-400 font-bold tabular-nums">{gradeScore.toFixed(1)}</span> / 10
          </div>

          <button
            onClick={() => setIsRefineryPhotoModalOpen(true)}
            title="Kőolajfinomító komplexum valós ipari fotója"
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 hover:text-white transition-colors text-xs font-sans font-bold cursor-pointer flex items-center gap-1.5"
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Finomító fotó</span>
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs font-sans font-bold cursor-pointer"
          >
            Főmenü
          </button>
        </div>
      </div>

      {/* Mission Phases Navigator */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[
          '1. Kőolajlepárló oszlop',
          '2. Otto vs. Dízel párbaj',
          '3. Kerozin & SAF repülés',
          '4. Biztonság & Élővilág',
          '5. Sztöchiometriai zárás',
        ].map((title, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all ${
              idx + 1 === missionPhase
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                : idx + 1 < missionPhase
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="truncate">{title}</div>
          </div>
        ))}
      </div>

      {/* Engineer Character Guide */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <ChemistAvatar
          role="engineer"
          mood={
            feedback
              ? feedback.includes('Kiváló') ||
                feedback.includes('Pontos') ||
                feedback.includes('Helyes') ||
                feedback.includes('Zseniális')
                ? 'happy'
                : 'warning'
              : 'idle'
          }
          speechText={
            feedback
              ? feedback
              : missionPhase === 1
              ? 'Üdvözöllek a finomítóban! Állítsd be a frakcionáló torony tálcáit növekvő forráspont szerint: alul a legnehezebb bitumen, legfelül a legkönnyebb földgáz!'
              : missionPhase === 2
              ? 'Készülj a motorpárbajra! Döntsd el villámgyorsan: Otto-motor (szikra, oktánszám) vagy Dízelmotor (kompresszió, cetánszám)?'
              : missionPhase === 3
              ? 'A Jet A-1 kerozin és a modern ReFuelEU Aviation SAF szabályozás következik. Figyelj az előírt arányokra!'
              : missionPhase === 4
              ? 'Munkavédelem és biológia: az n-hexán idegrendszeri hatása és az alkánok jelenléte a rovarok kutikuláján!'
              : 'Záró sztöchiometriai mérnöki számítás a 15. diáról: 132 g CO₂ képződött. Hány gramm propán égett el?'
          }
          size="md"
        />
      </div>

      {/* Real Petrochemical Refinery Photo Card */}
      <div className="mb-6 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-2xl">
        <div className="relative aspect-video sm:aspect-[24/8] w-full overflow-hidden bg-slate-900 group">
          <img
            src={ASSETS.refineryPhoto}
            alt="Valós nehézipari petrolkémiai finomító komplexum frakcionáló tornyokkal"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Factory className="w-3.5 h-3.5 text-cyan-300" />
              <span>Valós Petrolkémiai Finomító Komplexum</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Folyamatos frakcionált kondenzáció & krakkolás</span>
            </span>
          </div>

          <button
            onClick={() => setIsRefineryPhotoModalOpen(true)}
            className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-cyan-900/90 hover:bg-cyan-800 border border-cyan-400 text-cyan-100 text-xs font-medium backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Kivetítő nagyítás</span>
          </button>
        </div>

        {/* Industrial telemetry indicators */}
        <div className="p-3 bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 border-t border-cyan-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-200">
            <span className="text-[10px] text-slate-400 block uppercase">1. Frakcionálás</span>
            Többtálcás desztilláló tornyok
          </div>
          <div className="p-2 rounded-lg bg-black/60 border border-amber-500/30 text-amber-200">
            <span className="text-[10px] text-slate-400 block uppercase">2. Krakkolás</span>
            Hő- és katalitikus C–C hasítás
          </div>
          <div className="p-2 rounded-lg bg-black/60 border border-emerald-500/30 text-emerald-200">
            <span className="text-[10px] text-slate-400 block uppercase">3. Jet A-1 & SAF</span>
            Kerozin & fenntartható keverés
          </div>
          <div className="p-2 rounded-lg bg-black/60 border border-rose-500/30 text-rose-200">
            <span className="text-[10px] text-slate-400 block uppercase">4. Motorbenzin</span>
            Oktánszám & izomerizáció
          </div>
        </div>
      </div>

      {/* Main Mission Active Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-6">
        {/* PHASE 1: Fraction Ordering */}
        {missionPhase === 1 && (
          <div>
            <div className="mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 block">
                1. Küldetésfázis: A Frakcionált Desztillációs Torony Rendezése
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Rendezd sorba a kőolajpárlatokat NÖVEKVŐ forráspont és szénatomszám szerint (1 = legkisebb f.p., 8 = legnagyobb f.p.)!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                A torony tetején a legalacsonyabb forráspontú gázok távoznak (20 °C), alján a legnehezebb maradék (350+ °C).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Visual Distillation Column Graphic */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between shadow-inner">
                <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-slate-800 pb-2 mb-2">
                  <span className="flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5" />
                    <span>Lepárló Kolonna</span>
                  </span>
                  <span className="text-slate-400">T: 20 °C → 380 °C</span>
                </div>

                <div className="relative w-full py-2 flex flex-col items-center">
                  {/* Gas exit at top */}
                  <div className="w-24 py-1 rounded-t-lg bg-cyan-500/30 border border-cyan-400 text-[10px] text-cyan-200 text-center font-bold">
                    ↑ Gázok (20 °C)
                  </div>

                  {/* Tower Body with Trays */}
                  <div className="w-48 border-2 border-cyan-500/40 rounded-xl bg-gradient-to-b from-cyan-950 via-slate-900 to-amber-950/80 p-2.5 my-1 space-y-1.5 shadow-lg">
                    {fractions.map((f, i) => (
                      <div
                        key={f.id}
                        className={`py-1 px-2 rounded text-[11px] font-mono flex items-center justify-between border transition-all ${
                          isFractionsChecked
                            ? f.correctRank === i + 1
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950/80 border-rose-500 text-rose-300'
                            : 'bg-slate-900/80 border-slate-700/60 text-slate-300'
                        }`}
                      >
                        <span className="font-bold text-cyan-400 mr-1">#{i + 1}</span>
                        <span className="truncate max-w-[100px] text-left">{f.name}</span>
                        <span className="text-[9px] text-slate-400">{f.range}</span>
                      </div>
                    ))}
                  </div>

                  {/* Crude oil injection & bottom residue */}
                  <div className="w-32 py-1 rounded-b-lg bg-amber-950/60 border border-amber-600/60 text-[10px] text-amber-200 text-center font-bold">
                    ↓ Maradék (&gt;350 °C)
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                  🔥 Forró kőolajgőzök felszállnak, tálcákon kondenzálódnak
                </div>
              </div>

              {/* Fraction Reordering Interactive Controls */}
              <div className="lg:col-span-7 space-y-2">
                {fractions.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-sm hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-white mr-2">{f.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({f.range})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={idx === 0 || isFractionsChecked}
                        onClick={() => moveFraction(idx, 'up')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-xs cursor-pointer transition-colors"
                        title="Mozgatás felfelé"
                      >
                        ▲ Fel
                      </button>
                      <button
                        disabled={idx === fractions.length - 1 || isFractionsChecked}
                        onClick={() => moveFraction(idx, 'down')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-xs cursor-pointer transition-colors"
                        title="Mozgatás lefelé"
                      >
                        ▼ Le
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Frakciók: Földgáztól a Bitumenig (C₁–C₄ → C₃₅+)
              </span>
              {!isFractionsChecked ? (
                <button
                  onClick={checkFractionOrder}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
                >
                  Torony ellenőrzése
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    setMissionPhase(2);
                    setFeedback(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>2. Fázis: Motorpárbaj</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE 2: Otto vs Diesel Duel */}
        {missionPhase === 2 && (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 block">
                2. Küldetésfázis: Otto-motor (Benzin) vs. Dízelmotor Gyorspárbaj
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                Kártya {engineCardIndex + 1} / {engineCards.length}: Melyik motortípusra igaz az állítás?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Kattints a megfelelő motor gombjára a kivetítőn!
              </p>
            </div>

            {/* Current card display */}
            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 text-center mb-8 shadow-inner">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
                Tulajdonság / Működési elv
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto leading-relaxed">
                „{engineCards[engineCardIndex].text}”
              </p>
            </div>

            {/* Choice buttons with visual engine schema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleSortEngineCard('otto')}
                className="p-6 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 hover:bg-amber-900/50 hover:border-amber-400 text-amber-200 font-bold text-base sm:text-lg transition-all flex flex-col items-center justify-center gap-3 shadow-lg cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-lg sm:text-xl block font-extrabold">BENZINMOTOR (Otto-motor)</span>
                  <span className="text-xs font-mono text-amber-300/80 block mt-1">
                    ⚡ Gyújtógyertya · Oktánszám (100 = izooktán)
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Szénlánc: C₅–C₁₀ · Forrástartomány: 30–200 °C
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleSortEngineCard('diesel')}
                className="p-6 rounded-2xl bg-blue-950/40 border-2 border-blue-500/50 hover:bg-blue-900/50 hover:border-blue-400 text-blue-200 font-bold text-base sm:text-lg transition-all flex flex-col items-center justify-center gap-3 shadow-lg cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Droplets className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-lg sm:text-xl block font-extrabold">DÍZELMOTOR</span>
                  <span className="text-xs font-mono text-blue-300/80 block mt-1">
                    💨 Kompressziógyújtás (&gt;500 °C) · Cétszám (100 = cetán)
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Szénlánc: C₁₅–C₂₀ · Forrástartomány: 180–360 °C
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: Sustainable Aviation Fuel */}
        {missionPhase === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 block">
                3. Küldetésfázis: Kerozin (Jet A-1) és a Fenntartható Repülés (SAF)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Az EU ReFuelEU Aviation rendelete és a kerozin tananyaga alapján melyik állítás pontos?
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {phase3Options.map((opt, idx) => {
                const isSelected = phase3SelectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleCheckPhase3(opt.id)}
                    disabled={phase3Checked}
                    className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg border border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {phase3Checked && (
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    sound.playClick();
                    setMissionPhase(4);
                    setFeedback(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>4. Fázis: Biztonság és Élővilág</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: Safety & Biology */}
        {missionPhase === 4 && (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 block">
                4. Küldetésfázis: Ipari Biztonság és az Élővilág Alkánjai
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Miért kockázatos az n-hexán oldószer, és milyen szerepet töltenek be az alkánok a rovarok világában?
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {phase4Options.map((opt, idx) => {
                const isSelected = phase4SelectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleCheckPhase4(opt.id)}
                    disabled={phase4Checked}
                    className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg border border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {phase4Checked && (
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    sound.playClick();
                    setMissionPhase(5);
                    setFeedback(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>5. Fázis: Záró Égésszámítás</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 5: Stoichiometry calculation */}
        {missionPhase === 5 && (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 block">
                5. Záró Küldetésfázis: Szerves Kémiai Sztöchiometria (15. dia feladata)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Hány gramm propán (C₃H₈, M = 44 g/mol) ég el tökéletesen, ha a reakcióban 132 g szén-dioxid (CO₂, M = 44 g/mol) keletkezik?
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono mb-6">
              Reakcióegyenlet: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O
            </div>

            <div className="space-y-3 mb-6">
              {phase5Options.map((opt, idx) => {
                const isSelected = phase5SelectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleCheckPhase5(opt.id)}
                    disabled={phase5Checked}
                    className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base font-semibold leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg border border-slate-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {phase5Checked && (
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => finishMission(gradeScore)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Küldetés befejezése és 10-es érdemjegy értékelése</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="mt-6 p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-200 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="font-medium">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};
