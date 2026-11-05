import React, { useState, useEffect } from 'react';
import { Layers, RotateCw, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { ChemistAvatar } from '../../components/ChemistAvatar';
import { GameResult } from '../../types';

interface DominoGameProps {
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface DominoTile {
  id: string;
  leftKey: string;
  leftText: string;
  leftCategory: 'structure' | 'name' | 'property' | 'formula';
  rightKey: string;
  rightText: string;
  rightCategory: 'structure' | 'name' | 'property' | 'formula';
  hint: string;
}

const DominoPips: React.FC<{ count: number }> = ({ count }) => {
  const pipPositions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  const active = pipPositions[count] || [4];

  return (
    <div className="w-5 h-5 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 rounded bg-amber-100/90 border border-amber-300/80 shadow-inner shrink-0 select-none">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {active.includes(i) && (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-sm" />
          )}
        </div>
      ))}
    </div>
  );
};

const getCategoryPips = (category: string): number => {
  switch (category) {
    case 'structure':
      return 4; // tetraéder
    case 'formula':
      return 2;
    case 'name':
      return 3;
    case 'property':
      return 5;
    default:
      return 1;
  }
};

// Pair mappings for validity
const VALID_MATCH_PAIRS: Record<string, string[]> = {
  // sp3 & 109°28'
  'sp3-hybrid': ['tetrahedral-angle', 'sp3-desc'],
  'tetrahedral-angle': ['sp3-hybrid'],
  'sp3-desc': ['sp3-hybrid'],

  // bond length
  'bond-length-154': ['cc-single-bond'],
  'cc-single-bond': ['bond-length-154'],

  // isopentane structure & name
  'struct-isopentane': ['name-2-methylbutane'],
  'name-2-methylbutane': ['struct-isopentane'],

  // neopentane structure & boiling point
  'struct-neopentane': ['bp-neopentane-9c'],
  'bp-neopentane-9c': ['struct-neopentane'],

  // branching effect on boiling point
  'branching-effect': ['lowers-boiling-point'],
  'lowers-boiling-point': ['branching-effect'],

  // isopropyl group
  'alkyl-isopropyl': ['ch3-ch-ch3-group'],
  'ch3-ch-ch3-group': ['alkyl-isopropyl'],

  // state of matter
  'c1-c4-state': ['gaseous-state'],
  'gaseous-state': ['c1-c4-state'],

  // polarity & solubility
  'apolar-molecules': ['floats-on-water-insoluble'],
  'floats-on-water-insoluble': ['apolar-molecules'],

  // number of isomers
  'c5h12-isomers': ['three-chain-isomers'],
  'three-chain-isomers': ['c5h12-isomers'],
};

// Raw initial tiles
const RAW_HAND: DominoTile[] = [
  {
    id: 'tile-1',
    leftKey: 'tetrahedral-angle',
    leftText: '109°28\' vegyértékszög',
    leftCategory: 'structure',
    rightKey: 'bond-length-154',
    rightText: '1,54 Å kötéstávolság',
    rightCategory: 'structure',
    hint: 'A tetraéderes vegyértékszög (109°28\') az sp³ hibridállapotú szénatomhoz tartozik.',
  },
  {
    id: 'tile-2',
    leftKey: 'cc-single-bond',
    leftText: 'C–C egyszeres σ-kötés',
    leftCategory: 'structure',
    rightKey: 'struct-isopentane',
    rightText: 'CH₃–CH(CH₃)–CH₂–CH₃',
    rightCategory: 'formula',
    hint: 'Az 1,54 Å az alkánok C–C egyszeres kötésének hossza, körülötte szabad forgás van.',
  },
  {
    id: 'tile-3',
    leftKey: 'name-2-methylbutane',
    leftText: '2-metilbután (izopentán)',
    leftCategory: 'name',
    rightKey: 'branching-effect',
    rightText: 'Elágazó szénváz hatása',
    rightCategory: 'property',
    hint: 'A CH₃–CH(CH₃)–CH₂–CH₃ IUPAC neve 2-metilbután (más néven izopentán, C₅H₁₂).',
  },
  {
    id: 'tile-4',
    leftKey: 'lowers-boiling-point',
    leftText: 'Kisebb felület, alacsonyabb f.p.',
    leftCategory: 'property',
    rightKey: 'struct-neopentane',
    rightText: 'CH₃–C(CH₃)₂–CH₃',
    rightCategory: 'formula',
    hint: 'Az elágazás csökkenti az érintkezési felületet és a diszperziós erőt, így csökkenti a forráspontot.',
  },
  {
    id: 'tile-5',
    leftKey: 'bp-neopentane-9c',
    leftText: 'Forráspontja csak 9,5 °C',
    leftCategory: 'property',
    rightKey: 'alkyl-isopropyl',
    rightText: 'Izopropilcsoport',
    rightCategory: 'name',
    hint: 'A 2,2-dimetilpropán (neopentán) gömbszerűbb alakja miatt már 9,5 °C-on forr.',
  },
  {
    id: 'tile-6',
    leftKey: 'ch3-ch-ch3-group',
    leftText: 'CH₃–CH(–)–CH₃ gyök',
    leftCategory: 'formula',
    rightKey: 'c1-c4-state',
    rightText: 'C₁–C₄ alkánok állapota',
    rightCategory: 'property',
    hint: 'A propánból a középső hidrogén elvételével az izopropilcsoport képződik.',
  },
  {
    id: 'tile-7',
    leftKey: 'gaseous-state',
    leftText: 'Szobahőmérsékleten gáz',
    leftCategory: 'property',
    rightKey: 'apolar-molecules',
    rightText: 'Apoláris molekulák (0,6–0,8 g/cm³)',
    rightCategory: 'property',
    hint: 'A metán, etán, propán és bután (C₁–C₄) normál körülmények között gáz.',
  },
];

const INITIAL_CHAIN: DominoTile[] = [
  {
    id: 'starter-tile',
    leftKey: 'three-chain-isomers',
    leftText: 'C₅H₁₂ 3 izomerje',
    leftCategory: 'structure',
    rightKey: 'sp3-hybrid',
    rightText: 'sp³ hibridizált C atomok',
    rightCategory: 'structure',
    hint: 'Kiinduló dominó: az alkánokban a szén sp³ hibridállapotú.',
  },
];

export const ChemicalDominoGame: React.FC<DominoGameProps> = ({ onComplete, onExit }) => {
  const [chain, setChain] = useState<DominoTile[]>(INITIAL_CHAIN);
  const [hand, setHand] = useState<DominoTile[]>(() => shuffleArray(RAW_HAND));
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState(10.0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer starts immediately
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Check victory condition
  useEffect(() => {
    if (hand.length === 0 && chain.length > 1 && !isCompleted) {
      setIsCompleted(true);
      const finalScore = Math.max(3.0, Math.min(10.0, Number(gradeScore.toFixed(1))));
      const percentage = Math.round((finalScore / 10.0) * 100);

      const strengths: string[] = [
        'sp³ hibridizáció és tetraéderes térszerkezet (109°28\')',
        'C–C kötéstávolság (1,54 Å) és láncizoméria összefüggései',
        'IUPAC nevezéktan és az elágazás forráspont-csökkentő hatása',
      ];
      const reviewAreas: string[] = [];

      if (mistakes > 0) {
        reviewAreas.push('Alkilgyökök és az izomerek forráspontjának pontos áttekintése');
      } else {
        reviewAreas.push('Hibátlan dominólánc-építés! Kiváló térbeli és fizikai kémiai tudás.');
      }

      let teacherRecommendation = '';
      if (finalScore >= 9.5) {
        teacherRecommendation = 'Kiváló dominólánc-építés! Javaslat: 10-es érdemjegy beírása a katalógusba.';
      } else if (finalScore >= 8.5) {
        teacherRecommendation = 'Nagyon jó munka! Javaslat: 9-es érdemjegy vagy piros pont adása.';
      } else if (finalScore >= 7.0) {
        teacherRecommendation = 'Jó teljesítmény! Javaslat: 7-es vagy 8-as érdemjegy adása.';
      } else {
        teacherRecommendation = 'Gyakorlás javasolt az elágazások forráspontra gyakorolt hatásából.';
      }

      onComplete({
        gameId: 'chemical-domino',
        gameTitle: 'Alkán Dominólánc',
        pdfTitle: 'Alkánok 2. óra – Szerkezet, izoméria és fizikai tulajdonságok',
        score: finalScore,
        maxScore: 10,
        percentage,
        elapsedSeconds,
        completedAt: new Date().toLocaleTimeString(),
        strengths,
        reviewAreas,
        teacherRecommendation,
      });
    }
  }, [hand.length, chain.length, isCompleted, gradeScore, mistakes, elapsedSeconds, onComplete]);

  const selectedTile = hand.find((t) => t.id === selectedTileId) || null;

  const leftEndTile = chain[0];
  const rightEndTile = chain[chain.length - 1];

  const handleRotateSelected = () => {
    if (!selectedTileId) return;
    sound.playClick();
    setHand((prev) =>
      prev.map((t) => {
        if (t.id === selectedTileId) {
          return {
            ...t,
            leftKey: t.rightKey,
            leftText: t.rightText,
            leftCategory: t.rightCategory,
            rightKey: t.leftKey,
            rightText: t.leftText,
            rightCategory: t.leftCategory,
          };
        }
        return t;
      })
    );
  };

  const checkMatch = (keyA: string, keyB: string): boolean => {
    if (keyA === keyB) return true;
    const allowed = VALID_MATCH_PAIRS[keyA];
    if (allowed && allowed.includes(keyB)) return true;
    const allowedB = VALID_MATCH_PAIRS[keyB];
    if (allowedB && allowedB.includes(keyA)) return true;
    return false;
  };

  const handlePlaceToRight = () => {
    if (!selectedTile) return;

    if (checkMatch(rightEndTile.rightKey, selectedTile.leftKey)) {
      sound.playCorrect();
      setChain([...chain, selectedTile]);
      setHand(hand.filter((t) => t.id !== selectedTile.id));
      setSelectedTileId(null);
      setFeedback({
        isSuccess: true,
        message: `Helyes illesztés! [${rightEndTile.rightText}] 🔗 [${selectedTile.leftText}]`,
      });
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback({
        isSuccess: false,
        message: `A dominók nem kapcsolódnak! Próbáld elforgatni a dominót (⟲ Forgatás gomb), vagy válassz másikat! Tipp: ${selectedTile.hint}`,
      });
    }
  };

  const handlePlaceToLeft = () => {
    if (!selectedTile) return;

    if (checkMatch(leftEndTile.leftKey, selectedTile.rightKey)) {
      sound.playCorrect();
      setChain([selectedTile, ...chain]);
      setHand(hand.filter((t) => t.id !== selectedTile.id));
      setSelectedTileId(null);
      setFeedback({
        isSuccess: true,
        message: `Helyes illesztés a bal oldalon! [${selectedTile.rightText}] 🔗 [${leftEndTile.leftText}]`,
      });
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback({
        isSuccess: false,
        message: `A bal szél nem egyezik ezzel a dominóval! Próbáld elforgatni vagy a jobb véghez illeszteni! Tipp: ${selectedTile.hint}`,
      });
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'structure':
        return 'text-cyan-300 bg-cyan-950/40 border-cyan-800/40';
      case 'name':
        return 'text-emerald-300 bg-emerald-950/40 border-emerald-800/40';
      case 'property':
        return 'text-amber-300 bg-amber-950/40 border-amber-800/40';
      case 'formula':
        return 'text-purple-300 bg-purple-950/40 border-purple-800/40';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
              2. Játéktípus · Kémiai dominó
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Alkán Szerkezet, Izoméria és Tulajdonság Dominó
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Kézben: <span className="text-blue-400 font-bold tabular-nums">{hand.length}</span> db
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Idő: <span className="text-amber-400 font-bold tabular-nums">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-blue-500/40 text-slate-300">
            Érdemjegy: <span className="text-emerald-400 font-bold tabular-nums">{gradeScore.toFixed(1)}</span> / 10
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-sans font-medium"
          >
            Főmenü
          </button>
        </div>
      </div>

      {/* Professor Character Guide */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <ChemistAvatar
          role="professor"
          mood={feedback ? (feedback.isSuccess ? 'happy' : 'warning') : selectedTile ? 'thinking' : 'idle'}
          speechText={
            feedback
              ? feedback.isSuccess
                ? 'Kiváló kapcsolódás! A lánc szépen bővül a helyes szerves kémiai fogalmakkal!'
                : 'Ez a két vég nem kapcsolódik! Forgasd meg a dominót (⟲), vagy válassz másikat a kézből!'
              : selectedTile
              ? 'Kiválasztottál egy dominót. Csatold a bal vagy jobb nyitott véghez, ha egyezik a fogalom!'
              : 'Építsük meg az alkánok dominóláncát! Válassz egy dominót alulról!'
          }
          size="md"
        />
      </div>

      {/* Classroom Instruction Strip */}
      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs sm:text-sm text-blue-200 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Válassz ki egy dominót a lenti készletből, forgasd el ha szükséges, majd illeszd a dominólánc megfelelő nyitott végéhez!
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 shrink-0 font-medium">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Szerkezet</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Név</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Képlet</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Tulajdonság</span>
        </div>
      </div>

      {/* The Domino Board (The Chain on the Green Felt Table) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border-8 border-amber-950/90 shadow-2xl mb-8 relative overflow-hidden">
        {/* Table Felt Texture & Gold Corner Accents */}
        <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-serif font-bold">♠ KÉMIAI DOMINÓASZTAL ♠</div>
        <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-serif font-bold">Alkánok 2. Lecke</div>

        <div className="flex items-center justify-between mb-4 mt-2">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-200/90 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            A játékasztal dominólánca ({chain.length} db lerakva)
          </span>

          {selectedTile && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <button
                onClick={handlePlaceToLeft}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-transform hover:scale-105 flex items-center gap-1.5 shadow-lg border border-blue-400 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Bal szélhez csatolás</span>
              </button>
              <button
                onClick={handlePlaceToRight}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-transform hover:scale-105 flex items-center gap-1.5 shadow-lg border border-emerald-400 cursor-pointer"
              >
                <span>Jobb szélhez csatolás</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Realistic Domino Chain Horizontal Train */}
        <div className="overflow-x-auto pb-4 pt-2 flex items-center gap-3">
          {/* Left Snap Slot Button */}
          <button
            onClick={handlePlaceToLeft}
            disabled={!selectedTile}
            className={`shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed transition-all select-none cursor-pointer min-w-[130px] max-w-[150px] min-h-[92px] ${
              selectedTile && (selectedTile.rightKey === chain[0].leftKey || selectedTile.leftKey === chain[0].leftKey)
                ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200 animate-pulse ring-4 ring-cyan-400/40 shadow-lg scale-105'
                : selectedTile
                ? 'border-amber-400/60 bg-amber-500/10 text-amber-200 hover:border-amber-300 hover:bg-amber-500/20'
                : 'border-emerald-700/40 bg-emerald-950/30 text-emerald-600/60 opacity-60'
            }`}
            title="Kattints ide a kiválasztott dominó bal véghez illesztéséhez"
          >
            <ArrowLeft className={`w-6 h-6 mb-1 ${selectedTile ? 'text-cyan-300 animate-bounce' : 'text-emerald-600'}`} />
            <span className="text-[11px] font-bold text-center leading-tight">
              {selectedTile ? '⬅️ BAL SZÉLRE' : 'Bal nyitott vég'}
            </span>
            <span className="text-[9px] font-mono text-cyan-300/90 mt-0.5 truncate max-w-full px-1">
              Igény: {chain[0].leftText}
            </span>
          </button>

          {chain.map((tile) => (
            <div
              key={tile.id}
              className="shrink-0 flex items-stretch rounded-2xl bg-gradient-to-b from-[#fffefc] via-[#f8f3e8] to-[#ede2cb] border-2 border-[#cbb694] shadow-xl overflow-hidden text-xs sm:text-sm select-none relative transition-all"
              style={{ minWidth: '260px', maxWidth: '340px', minHeight: '92px' }}
            >
              {/* Left Domino Half */}
              <div className="flex-1 p-3 flex flex-col justify-center items-center text-center text-slate-900 font-semibold relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <DominoPips count={getCategoryPips(tile.leftCategory)} />
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-600 font-bold">
                    {tile.leftCategory === 'structure' ? 'Szerkezet' : tile.leftCategory === 'name' ? 'Név' : tile.leftCategory === 'formula' ? 'Képlet' : 'Tulajdonság'}
                  </span>
                </div>
                <span className="leading-snug text-xs sm:text-sm font-bold text-slate-900">{tile.leftText}</span>
              </div>

              {/* Authentic Center Seam & Brass Spinner Pin */}
              <div className="w-4 flex flex-col items-center justify-center relative bg-[#e2d5bd]">
                <div className="w-0.5 h-full bg-[#b89f78]"></div>
                {/* Brass Center Spinner Pin (Sárgaréz szegecs) */}
                <div
                  className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-900 shadow-md absolute z-10"
                  title="Sárgaréz dominó szegecs"
                ></div>
              </div>

              {/* Right Domino Half */}
              <div className="flex-1 p-3 flex flex-col justify-center items-center text-center text-slate-900 font-semibold relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <DominoPips count={getCategoryPips(tile.rightCategory)} />
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-600 font-bold">
                    {tile.rightCategory === 'structure' ? 'Szerkezet' : tile.rightCategory === 'name' ? 'Név' : tile.rightCategory === 'formula' ? 'Képlet' : 'Tulajdonság'}
                  </span>
                </div>
                <span className="leading-snug text-xs sm:text-sm font-bold text-slate-900">{tile.rightText}</span>
              </div>
            </div>
          ))}

          {/* Right Snap Slot Button */}
          <button
            onClick={handlePlaceToRight}
            disabled={!selectedTile}
            className={`shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed transition-all select-none cursor-pointer min-w-[130px] max-w-[150px] min-h-[92px] ${
              selectedTile && (selectedTile.leftKey === chain[chain.length - 1].rightKey || selectedTile.rightKey === chain[chain.length - 1].rightKey)
                ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 animate-pulse ring-4 ring-emerald-400/40 shadow-lg scale-105'
                : selectedTile
                ? 'border-amber-400/60 bg-amber-500/10 text-amber-200 hover:border-amber-300 hover:bg-amber-500/20'
                : 'border-emerald-700/40 bg-emerald-950/30 text-emerald-600/60 opacity-60'
            }`}
            title="Kattints ide a kiválasztott dominó jobb véghez illesztéséhez"
          >
            <ArrowRight className={`w-6 h-6 mb-1 ${selectedTile ? 'text-emerald-300 animate-bounce' : 'text-emerald-600'}`} />
            <span className="text-[11px] font-bold text-center leading-tight">
              {selectedTile ? 'JOBB SZÉLRE ➡️' : 'Jobb nyitott vég'}
            </span>
            <span className="text-[9px] font-mono text-emerald-300/90 mt-0.5 truncate max-w-full px-1">
              Igény: {chain[chain.length - 1].rightText}
            </span>
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-center gap-3 text-sm leading-relaxed animate-in fade-in duration-150 ${
              feedback.isSuccess
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200'
            }`}
          >
            {feedback.isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <p className="font-medium">{feedback.message}</p>
          </div>
        )}
      </div>

      {/* The Player's Wooden Tile Rack (Fa Dominótartó Sín) */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2e180f] via-[#221008] to-[#160a04] border-4 border-amber-800/80 shadow-2xl relative">
        {/* Wood Grain Label Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-2 border-b border-amber-800/40">
          <div>
            <h3 className="text-base font-bold text-amber-200 tracking-tight flex items-center gap-2">
              <span>🪵 A te dominótartó síned</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-600 text-amber-300 font-mono font-normal">
                {hand.length} db maradt
              </span>
            </h3>
            <p className="text-xs text-amber-300/70">
              Válaszd ki a megfelelő csontdominót, forgasd meg szükség szerint, és csatold a zöld posztóra!
            </p>
          </div>

          {selectedTile && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRotateSelected}
                className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold text-xs transition-transform hover:scale-105 flex items-center gap-1.5 border border-amber-600 shadow-md cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>⟲ Dominó megfordítása</span>
              </button>
              <button
                onClick={handlePlaceToLeft}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Bal szélre</span>
              </button>
              <button
                onClick={handlePlaceToRight}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-transform hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Jobb szélre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Hand Grid: Slanted 3D Wooden Tile Rack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hand.map((tile) => {
            const isSelected = selectedTileId === tile.id;

            return (
              <button
                key={tile.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedTileId(tile.id);
                  setFeedback(null);
                }}
                className={`rounded-2xl border-2 transition-all flex flex-col justify-between text-left group focus:outline-none cursor-pointer select-none ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 shadow-2xl -translate-y-2 ring-4 ring-amber-400/30'
                    : 'border-[#b89f78]/60 bg-gradient-to-b from-[#fffdf8] to-[#ebdcc0] hover:border-amber-400 hover:-translate-y-1 shadow-lg'
                }`}
              >
                {/* 3D Ivory Domino Surface */}
                <div className="flex items-stretch rounded-2xl overflow-hidden bg-gradient-to-b from-[#fffefc] via-[#f7f1e5] to-[#ece1ca] text-xs font-medium min-h-[82px] text-slate-900">
                  {/* Left Side */}
                  <div className="flex-1 p-2 flex flex-col justify-center items-center text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <DominoPips count={getCategoryPips(tile.leftCategory)} />
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-500">
                        {tile.leftCategory === 'structure' ? '📐' : tile.leftCategory === 'name' ? '🏷️' : tile.leftCategory === 'formula' ? '🧪' : '⚡'}
                      </span>
                    </div>
                    <span className="font-bold leading-tight text-slate-900 text-xs">{tile.leftText}</span>
                  </div>

                  {/* Brass Pin Seam */}
                  <div className="w-3.5 flex flex-col items-center justify-center relative bg-[#dfd0b5]">
                    <div className="w-0.5 h-full bg-[#af966f]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border border-amber-900 shadow absolute"></div>
                  </div>

                  {/* Right Side */}
                  <div className="flex-1 p-2 flex flex-col justify-center items-center text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <DominoPips count={getCategoryPips(tile.rightCategory)} />
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-500">
                        {tile.rightCategory === 'structure' ? '📐' : tile.rightCategory === 'name' ? '🏷️' : tile.rightCategory === 'formula' ? '🧪' : '⚡'}
                      </span>
                    </div>
                    <span className="font-bold leading-tight text-slate-900 text-xs">{tile.rightText}</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] bg-amber-950/60 rounded-b-xl border-t border-amber-900/40 text-amber-200">
                  <span className="truncate">{isSelected ? 'Kiválasztva (kész illesztésre)' : 'Kattints ide'}</span>
                  {isSelected && <span className="text-amber-300 font-bold">★ AKTÍV</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
