import React, { useState, useEffect, useMemo } from 'react';
import { FileQuestion, AlertCircle, CheckCircle2, Check, ChevronRight, PenTool, BookOpen, Award, Stamp } from 'lucide-react';
import { sound } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { ChemistAvatar } from '../../components/ChemistAvatar';
import { GameResult } from '../../types';

interface ErrorHunterProps {
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface FixOptionItem {
  id: string;
  text: string;
  isCorrect: boolean;
  scientificReason: string;
}

interface LogEntry {
  id: number;
  entryTitle: string;
  notebookSnippet: {
    lineIndex: number;
    text: string;
    isTheFlawedLine: boolean;
  }[];
  errorHighlightExplanation: string;
  fixOptions: FixOptionItem[];
  topic: string;
}

const RAW_NOTEBOOK_ENTRIES: LogEntry[] = [
  {
    id: 1,
    entryTitle: '1. Jegyzőkönyv: A halogénezés (szubsztitúció) indítási feltételei',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'Kísérleti leírás: Metángáz és klórgáz elegyét zárt lombikban vizsgáltuk szobahőmérsékleten.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Megfigyelés: A lombikot teljes sötétségbe helyezve a szubsztitúciós reakció azonnal és hevesen végbement, mert az alkánok fény nélkül sokkal reaktívabbak.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A keletkező gázelegy savas kémhatású hidrogén-kloridot (HCl) tartalmaz.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'A sötétségben a klórozás NEM megy végbe! A reakció indításához fény (hν) vagy 250–400 °C hő szükséges.',
    fixOptions: [
      {
        id: 'f1-1',
        text: 'Az alkánok stabil kötéseik miatt szobahőmérsékleten, sötétben nem reagálnak klórral; a halogénezést fény (hν) vagy 250–400 °C-os melegítés indítja el!',
        isCorrect: true,
        scientificReason: 'Pontos javítás! A fény (hν) vagy hő szükséges a klórmolekula homolitikus hasításához és a gyökös láncreakció elindításához.',
      },
      {
        id: 'f1-2',
        text: 'A reakció sötétben azért nem megy, mert a metánt kizárólag folyékony állapotban lehet klórozni –180 °C-on.',
        isCorrect: false,
        scientificReason: 'Nem helyes: a klórozást gázfázisban végzik, az aktiváláshoz viszont sugárzás vagy hőenergia szükséges.',
      },
      {
        id: 'f1-3',
        text: 'A metán klórozásához nem fény kell, hanem tömény kénsav mint katalizátor.',
        isCorrect: false,
        scientificReason: 'Téves: az alkánok radikális szubsztitúcióját fény (hν) fotokémiailag vagy hő indítja be, nem savas közeg.',
      },
    ],
    topic: 'Szubsztitúció feltételei (fény, hő)',
  },
  {
    id: 2,
    entryTitle: '2. Jegyzőkönyv: A különböző halogének reakciókészsége',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'Összehasonlító teszt: Különböző halogénelemek (F₂, Cl₂, Br₂, I₂) reakcióját vizsgáltuk propánnal.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Kísérleti következtetés: A jódolás rendkívül robbanásszerű és heves folyamat, míg a fluorozás termodinamikailag kedvezőtlen, ezért egyáltalán nem megy végbe.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A gyakorlatban leginkább a klórozás és a brómozás szabályozható jól.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'Pontosan fordítva szerepel a jegyzőkönyvben! A fluorozás a túl heves és robbanásveszélyes, a jódolás viszont nem megy végbe.',
    fixOptions: [
      {
        id: 'f2-1',
        text: 'A valóságban a fluorozás rendkívül heves és nehezen szabályozható, míg a jódolás termodinamikailag kedvezőtlen, a gyenge C–I kötés miatt gyakorlatilag nem játszódik le.',
        isCorrect: true,
        scientificReason: 'Tökéletes audit! A 3. dián egyértelműen látható: fluorozás rendkívül heves, a jódolás termodinamikailag kedvezőtlen, nem megy végbe.',
      },
      {
        id: 'f2-2',
        text: 'Valójában mind a négy halogén (F₂, Cl₂, Br₂, I₂) pontosan azonos sebességgel reagál az alkánokkal.',
        isCorrect: false,
        scientificReason: 'Hibás: a halogének elektronegativitása és kötési energiája drasztikusan különbözik.',
      },
      {
        id: 'f2-3',
        text: 'A jód és a fluor kizárólag vízzel reagál, alkánokkal egyáltalán nem érintkezhetnek.',
        isCorrect: false,
        scientificReason: 'Téves: a fluornak nagy affinitása van az alkánokhoz, éppen ezért kezelhetetlenül heves a reakció.',
      },
    ],
    topic: 'Halogének reaktivitása (fluor vs. jód)',
  },
  {
    id: 3,
    entryTitle: '3. Jegyzőkönyv: Hőbontás – Krakkolás vs. Dehidrogénezés',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'A bután (C₄H₁₀) termikus átalakítását vizsgáltuk két különböző hőmérsékleti tartományban.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Jegyzőkönyvi megállapítás: 650 °C felett a C–C kötések hasadnak (krakkolás), míg 650 °C alatt kizárólag a C–H kötések szakadnak el hidrogéngáz (H₂) képződésével.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A termékek között alkéneket (butént, etént és propént) is azonosítottunk.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'A hőmérsékleti tartományok és kötéshasadások fel vannak cserélve a jegyzőkönyvben!',
    fixOptions: [
      {
        id: 'f3-1',
        text: '650 °C alatt játszódik le a krakkolás (C–C hasadás: kisebb alkán + alkén), míg 650 °C felett a dehidrogénezés a jellemző (C–H hasadás: alkén + H₂)!',
        isCorrect: true,
        scientificReason: 'Kiváló javítás! A 6. dián lévő táblázat szerint: <650 °C krakkolás (C–C hasad), >650 °C dehidrogénezés (C–H hasad, H₂ távozik).',
      },
      {
        id: 'f3-2',
        text: 'A hőbontás során soha nem hasadhat sem C–C, sem C–H kötés, csak szénatomok válnak ki azonnal.',
        isCorrect: false,
        scientificReason: 'Téves: mindkét típusú hasadás valós és iparilag alapvető reakció.',
      },
      {
        id: 'f3-3',
        text: 'A dehidrogénezés szobahőmérsékleten megy végbe, a krakkoláshoz pedig 3000 °C feletti hőmérséklet szükséges.',
        isCorrect: false,
        scientificReason: 'Nem igaz: a határérték 650 °C, az alkánok szobahőmérsékleten nem dehidrogéneződnek spontán.',
      },
    ],
    topic: 'Krakkolás vs. dehidrogénezés (650 °C határa)',
  },
  {
    id: 4,
    entryTitle: '4. Jegyzőkönyv: Nenițescu professzor és az izomerizáció',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'Irodalmi hivatkozás: Costin D. Nenițescu (1902–1970) román szerves kémikus kutatta az alkánok AlCl₃-dal katalizált izomerizációját.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Kutatási összefoglaló: Nenițescu csoportja azt bizonyította be, hogy a reakció kizárólag tökéletesen abszolút száraz, 100%-ig vízmentes közegben indul el, a legkisebb nyomnyi víz is azonnal leállítja a katalizátort.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A reakcióban egyenes szénláncú alkánokból elágazó izomerek keletkeznek változatlan összegképlet mellett.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'Óriási tévedés a híres kutatásról! Nenițescu éppen azt írta le elsőként, hogy nyomnyi víz NÉLKÜL el sem indul a folyamat!',
    fixOptions: [
      {
        id: 'f4-1',
        text: 'Nenițescu kutatócsoportja elsőként mutatta ki, hogy nyomnyi víz nélkül az izomerizáció el sem indul – ez a katalizátor ko-katalitikus működésének alapja!',
        isCorrect: true,
        scientificReason: 'Fantasztikus tudománytörténeti és kémiai korrekció! A 12. dia pontosan rögzíti: nyomnyi víz nélkül az AlCl₃-dal katalizált reakció el sem indul.',
      },
      {
        id: 'f4-2',
        text: 'Nenițescu professzor valójában azt mutatta ki, hogy AlCl₃ helyett közönséges konyhasóval kell izomerizálni.',
        isCorrect: false,
        scientificReason: 'Téves: a konyhasó (NaCl) nem Lewis-sav, nem katalizálja a szénhidrogének izomerizációját.',
      },
      {
        id: 'f4-3',
        text: 'Az izomerizáció során a molekulák összegképlete megváltozik és oxigéntartalmú vegyületek keletkeznek.',
        isCorrect: false,
        scientificReason: 'Nem: az izomerizációban a molekulaképlet változatlan marad, csak a szénváz rendeződik át.',
      },
    ],
    topic: 'Nenițescu kutatása: nyomnyi víz szerepe',
  },
  {
    id: 5,
    entryTitle: '5. Jegyzőkönyv: Üzemanyag-minőség és az oktánszám skála',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'A benzin kopogásállóságának vizsgálatára a nemzetközi oktánszám-skálát alkalmazzuk.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Mérési referencia: A könnyen kopogó, egyenes láncú n-heptán jelenti az oktánszám-skála 100-as pontját, míg a rendkívül elágazó izooktán a skála 0 pontja.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A 95-ös benzin 95 térfogatszázalék jó kopogásállóságú komponenst jelentő viszonyítási keveréknek felel meg.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'A referencia-vegyületek értékei fel vannak cserélve! Az n-heptán a 0, az izooktán a 100!',
    fixOptions: [
      {
        id: 'f5-1',
        text: 'A könnyen kopogó n-heptán az oktánszám-skála 0 pontja, míg a jól elágazó, kopogástűrő 2,2,4-trimetilpentán (izooktán) az oktánszám 100-as referenciaanyaga!',
        isCorrect: true,
        scientificReason: 'Pontos javítás! Az elágazó izooktán ég egyenletesen (100), míg a hosszú n-heptán könnyen öngyullad és kopogást okoz a motorban (0).',
      },
      {
        id: 'f5-2',
        text: 'A skála 0 pontja a tiszta metán, míg a 100-as pontja a szilárd gyertyaparaffin.',
        isCorrect: false,
        scientificReason: 'Téves: a benzin oktánszámának referenciaanyagai a folyékony C₇ n-heptán és a C₈ izooktán.',
      },
      {
        id: 'f5-3',
        text: 'A 95-ös benzin azt jelenti, hogy a benzin pontosan 95 °C-on forr fel a motorban.',
        isCorrect: false,
        scientificReason: 'Nem: az oktánszám nem forráspont, hanem a motor kopogásállóságát jelző kompressziótűrési mutató.',
      },
    ],
    topic: 'Oktánszám skála (izooktán 100 vs. n-heptán 0)',
  },
  {
    id: 6,
    entryTitle: '6. Jegyzőkönyv: A propán monoklórozási szelektivitása',
    notebookSnippet: [
      {
        lineIndex: 0,
        text: 'A propán (CH₃–CH₂–CH₃) és a klór fotokémiai szubsztitúciós reakcióját vizsgáltuk 1:1 mólarány mellett.',
        isTheFlawedLine: false,
      },
      {
        lineIndex: 1,
        text: 'Mérési eredmény: Kizárólag 1-klórpropán keletkezett 100%-os tisztaságban, mert a molekula két végén lévő 6 darab hidrogén miatt a szekunder szénatom egyáltalán nem tud reagálni.',
        isTheFlawedLine: true,
      },
      {
        lineIndex: 2,
        text: 'A reakcióban melléktermékként hidrogén-klorid (HCl) gáz távozik.',
        isTheFlawedLine: false,
      },
    ],
    errorHighlightExplanation: 'A reakció nem 100%-ban 1-klórpropánt ad! A propán klórozásakor két izomer keletkezik: 55% 2-klórpropán és 45% 1-klórpropán.',
    fixOptions: [
      {
        id: 'f6-1',
        text: 'A propán monoklórozása izomerkeveréket ad: 55% 2-klórpropán (izopropil-klorid) és 45% 1-klórpropán (propil-klorid) képződik a szekunder C–H kötések nagyobb reakciókészsége miatt!',
        isCorrect: true,
        scientificReason: 'Kiváló szerves kémiai észrevétel! Az 5. dián szereplő diagram pontosan mutatja: 55% 2-klórpropán és 45% 1-klórpropán.',
      },
      {
        id: 'f6-2',
        text: 'A propánból kizárólag hexaklórpropán képződhet, mert az összes hidrogén egyszerre cserélődik ki.',
        isCorrect: false,
        scientificReason: 'Téves: a monoklórozás lépésenként történik, 1:1 arányban túlnyomórészt monoklór-származékok keletkeznek.',
      },
      {
        id: 'f6-3',
        text: 'A klór egyáltalán nem kapcsolódhat a szénatomokhoz, csak a szénláncot vágja ketté metánra és etánra.',
        isCorrect: false,
        scientificReason: 'Nem: a halogénezés szubsztitúció, a hidrogént cseréli ki klórra a C-C lánc elvágása nélkül.',
      },
    ],
    topic: 'Propán klórozási szelektivitás (55% vs. 45%)',
  },
];

export const ErrorHunterGame: React.FC<ErrorHunterProps> = ({ onComplete, onExit }) => {
  const [currentEntryIdx, setCurrentEntryIdx] = useState(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [isLineConfirmed, setIsLineConfirmed] = useState(false);
  const [selectedFixId, setSelectedFixId] = useState<string | null>(null);
  const [isFixEvaluated, setIsFixEvaluated] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gradeScore, setGradeScore] = useState(10.0);
  const [mistakes, setMistakes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Shuffle fixOptions on load so correct answer is NOT always option A!
  const shuffledEntries = useMemo(() => {
    return RAW_NOTEBOOK_ENTRIES.map((entry) => ({
      ...entry,
      fixOptions: shuffleArray(entry.fixOptions),
    }));
  }, []);

  // Timer starts immediately
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const entry = shuffledEntries[currentEntryIdx];

  const handleSelectLine = (lineIdx: number) => {
    if (isLineConfirmed) return;
    sound.playClick();
    setSelectedLineIndex(lineIdx);
  };

  const handleConfirmLine = () => {
    if (selectedLineIndex === null) return;
    const line = entry.notebookSnippet[selectedLineIndex];

    if (line.isTheFlawedLine) {
      sound.playCorrect();
      setIsLineConfirmed(true);
      setFeedback({
        isCorrect: true,
        text: `Helyesen megtaláltad a hibás állítást! ${entry.errorHighlightExplanation} Most válaszd ki a szakmailag helyes javítást!`,
      });
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback({
        isCorrect: false,
        text: 'Ez a sor szakmailag helytálló a lecke szerint. Olvasd át újra a többi sort, és keresd meg a téves állítást!',
      });
    }
  };

  const handleSelectFix = (id: string) => {
    if (isFixEvaluated && feedback?.isCorrect) return;
    sound.playClick();
    setSelectedFixId(id);
  };

  const handleConfirmFix = () => {
    if (!selectedFixId) return;
    const fix = entry.fixOptions.find((f) => f.id === selectedFixId);
    if (!fix) return;

    if (fix.isCorrect) {
      sound.playCorrect();
      setIsFixEvaluated(true);
      setFeedback({ isCorrect: true, text: fix.scientificReason });
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setFeedback({ isCorrect: false, text: fix.scientificReason });
    }
  };

  const handleNextEntry = () => {
    sound.playClick();
    if (currentEntryIdx + 1 < shuffledEntries.length) {
      setCurrentEntryIdx((prev) => prev + 1);
      setSelectedLineIndex(null);
      setIsLineConfirmed(false);
      setSelectedFixId(null);
      setIsFixEvaluated(false);
      setFeedback(null);
    } else {
      setIsGameOver(true);
      const finalScore = Math.max(3.0, Math.min(10.0, Number(gradeScore.toFixed(1))));
      const percentage = Math.round((finalScore / 10.0) * 100);

      const strengths: string[] = [
        'Szubsztitúciós reakciók indítási feltételei (fény hν vagy 250–400 °C hő)',
        'Krakkolás (<650 °C, C–C hasad) és dehidrogénezés (>650 °C, C–H hasad) megkülönböztetése',
        'Costin D. Nenițescu román kémiai felfedezése (nyomnyi víz elengedhetetlensége)',
        'Oktánszám-skála referenciák és szelektivitási arányok (propán klórozása)',
      ];

      const reviewAreas: string[] = [];
      if (mistakes > 0) {
        reviewAreas.push('Halogének reaktivitásának (fluor vs. jód) alaposabb átnézése');
      } else {
        reviewAreas.push('Hibátlan laborjegyzőkönyv-audit! Kiváló szakmai figyelem és kritikai látásmód.');
      }

      let teacherRecommendation = '';
      if (finalScore >= 9.5) {
        teacherRecommendation = 'Kiváló hibajavítás! Javaslat: 10-es érdemjegy beírása a katalógusba / naplóba.';
      } else if (finalScore >= 8.5) {
        teacherRecommendation = 'Nagyon jó szakmai látásmód! Javaslat: 9-es érdemjegy vagy piros pont adása.';
      } else if (finalScore >= 7.0) {
        teacherRecommendation = 'Jó felkészültség! Javaslat: 7-es vagy 8-as érdemjegy adása.';
      } else {
        teacherRecommendation = 'Közepes szint, a reakciófeltételek átismétlése szükséges.';
      }

      onComplete({
        gameId: 'error-hunter',
        gameTitle: 'A Laboratóriumi Jegyzőkönyv Auditja',
        pdfTitle: 'Az alkánok kémiai tulajdonságai',
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
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
              4. Játéktípus · Hibavadászat
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              A Kémiai Laboratóriumi Jegyzőkönyv Auditja
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Jegyzőkönyv: <span className="text-rose-400 font-bold tabular-nums">{currentEntryIdx + 1}</span> / {shuffledEntries.length}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Idő: <span className="text-amber-400 font-bold tabular-nums">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-rose-500/40 text-slate-300">
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

      {/* Auditor Character Guide */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <ChemistAvatar
          role="auditor"
          mood={
            isFixEvaluated
              ? feedback?.isCorrect
                ? 'cheering'
                : 'warning'
              : isLineConfirmed
              ? 'thinking'
              : selectedLineIndex !== null
              ? 'thinking'
              : 'idle'
          }
          speechText={
            isFixEvaluated && feedback?.isCorrect
              ? 'Hibátlan javítás! Látod, a kísérleti jegyzőkönyv most már megfelel a szerves kémiai tényeknek!'
              : isLineConfirmed
              ? 'Megvan a hibás sor! Most válassz egy szakmailag megalapozott helyesbítést!'
              : 'Olvasd el alaposan a laboráns jegyzőkönyvét, és kattints rá a szakmailag téves megállapításra!'
          }
          size="md"
        />
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {shuffledEntries.map((e, idx) => (
          <div
            key={e.id}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 ${
              idx === currentEntryIdx
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : idx < currentEntryIdx
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            {idx < currentEntryIdx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span>{idx + 1}.</span>}
            <span>{e.topic}</span>
          </div>
        ))}
      </div>

      {/* Notebook Audit Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-6">
        {/* Authentic Chemistry Lab Bench Reagent Shelf */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 mb-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span>🔬 SZERVES KÉMIAI REAGENS ASZTAL</span>
            </span>
            <span className="text-[11px] text-amber-300">Biztonsági előírás: MSZ EN ISO 17025</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-center">
            {/* Amber Reagent Bottle 1: Br2 */}
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-700/60 flex flex-col items-center text-center shadow-md">
              <span className="text-xl">🧴</span>
              <span className="text-[11px] font-bold text-amber-300 font-mono mt-0.5">Br₂ / CCl₄</span>
              <span className="text-[9px] text-amber-200/70">5% Brómos víz</span>
            </div>

            {/* Amber Reagent Bottle 2: KMnO4 */}
            <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-700/60 flex flex-col items-center text-center shadow-md">
              <span className="text-xl">🧪</span>
              <span className="text-[11px] font-bold text-purple-300 font-mono mt-0.5">KMnO₄</span>
              <span className="text-[9px] text-purple-200/70">0.1 M oldat</span>
            </div>

            {/* Reagent Bottle 3: HNO3 */}
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-700/60 flex flex-col items-center text-center shadow-md">
              <span className="text-xl">⚗️</span>
              <span className="text-[11px] font-bold text-rose-300 font-mono mt-0.5">cc. HNO₃</span>
              <span className="text-[9px] text-rose-200/70">Salétromsav</span>
            </div>

            {/* Reagent Bottle 4: H2SO4 */}
            <div className="p-2 rounded-xl bg-yellow-950/40 border border-yellow-700/60 flex flex-col items-center text-center shadow-md">
              <span className="text-xl">🧪</span>
              <span className="text-[11px] font-bold text-yellow-300 font-mono mt-0.5">cc. H₂SO₄</span>
              <span className="text-[9px] text-yellow-200/70">Kénsav</span>
            </div>

            {/* Test Tube Rack */}
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center text-center shadow-md">
              <span className="text-xl">🧪🧪</span>
              <span className="text-[11px] font-bold text-emerald-300 font-mono mt-0.5">Kémcsőállvány</span>
              <span className="text-[9px] text-slate-400">Reakciópróbák</span>
            </div>

            {/* Bunsen Burner with Blue Flame */}
            <div className="p-2 rounded-xl bg-sky-950/40 border border-sky-600/60 flex flex-col items-center text-center shadow-md relative overflow-hidden">
              <div className="text-xl animate-pulse">🔥</div>
              <span className="text-[11px] font-bold text-cyan-300 font-mono mt-0.5">Bunsen-égő</span>
              <span className="text-[9px] text-cyan-200/70">Kék láng (hν/hő)</span>
            </div>
          </div>
        </div>

        {/* Laboratory Audit Clipboard */}
        <div className="mb-6 rounded-3xl bg-[#2a1b12] p-2.5 sm:p-4 border-4 border-[#5c3a21] shadow-2xl relative">
          {/* Metallic Stainless Steel Clip at Top */}
          <div className="w-32 h-6 mx-auto -mt-6 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-lg border-2 border-slate-600 shadow-md flex items-center justify-center">
            <div className="w-16 h-2 rounded-full bg-slate-700/40"></div>
          </div>

          <div className="flex items-center justify-between gap-3 mb-3 px-2 pt-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-200 flex items-center gap-1.5 font-mono">
              <PenTool className="w-3.5 h-3.5 text-rose-400" />
              1. Lépés: Kattints a jegyzőkönyv szakmailag HIBÁS sorára!
            </span>
            {isLineConfirmed && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" /> HIBA FELTÁRVA
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-amber-100 mb-3 px-2 font-serif">
            📋 {entry.entryTitle}
          </h3>

          {/* Laboratory Notebook Graph Paper Page */}
          <div className="p-5 rounded-2xl bg-[#faf9f5] border-2 border-[#d6cfbe] font-sans space-y-3 text-slate-900 shadow-inner [background-image:radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:16px_16px]">
            {entry.notebookSnippet.map((line, idx) => {
              const isSelected = selectedLineIndex === idx;

              let lineStyle = 'p-3.5 rounded-xl border-2 text-sm sm:text-base leading-relaxed transition-all cursor-pointer text-left w-full font-medium ';
              if (isSelected) {
                if (isLineConfirmed) {
                  lineStyle += 'bg-rose-100 border-rose-500 text-rose-950 line-through decoration-rose-600 decoration-2 shadow-md';
                } else {
                  lineStyle += 'bg-amber-100/90 border-amber-600 text-slate-900 shadow-md ring-2 ring-amber-400';
                }
              } else {
                lineStyle += 'bg-white/80 border-slate-300 hover:border-slate-500 hover:bg-white text-slate-800 shadow-sm';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectLine(idx)}
                  disabled={isLineConfirmed}
                  className={lineStyle}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-500 mt-1 shrink-0 px-1.5 py-0.5 rounded bg-slate-200">
                      §{idx + 1}
                    </span>
                    <span className="flex-1 font-serif text-slate-900 leading-normal">{line.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {!isLineConfirmed && (
            <div className="mt-4 flex justify-end">
              <button
                disabled={selectedLineIndex === null}
                onClick={handleConfirmLine}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-semibold text-sm transition-all shadow-md shadow-rose-950/40 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Hiba kijelölése és megerősítése</span>
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Choose the Correct Fix */}
        {isLineConfirmed && (
          <div className="pt-6 border-t border-slate-800 animate-in fade-in duration-200">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              2. Lépés: Válaszd ki a szakmailag helyes javítást a tananyag alapján!
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4">
              Hogyan kell helyesen átfogalmazni ezt a kémiai összefüggést?
            </h4>

            {/* Shuffled fix options */}
            <div className="space-y-3 mb-6">
              {entry.fixOptions.map((opt, idx) => {
                const isSelected = selectedFixId === opt.id;
                let optStyle = 'p-4 rounded-xl border text-left transition-all flex items-start gap-3 w-full ';

                if (isSelected) {
                  if (isFixEvaluated) {
                    optStyle += opt.isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500 text-rose-200';
                  } else {
                    optStyle += 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm';
                  }
                } else {
                  optStyle += 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 text-slate-200';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectFix(opt.id)}
                    disabled={isFixEvaluated && feedback?.isCorrect}
                    className={optStyle}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? isFixEvaluated
                            ? opt.isCorrect
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-rose-500 border-rose-400 text-white'
                            : 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm sm:text-base leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Evaluation & Next */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                {entry.topic}
              </div>

              <div className="flex items-center gap-3">
                {(!isFixEvaluated || !feedback?.isCorrect) && (
                  <button
                    disabled={!selectedFixId}
                    onClick={handleConfirmFix}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Javítás jóváhagyása</span>
                  </button>
                )}

                {isFixEvaluated && feedback?.isCorrect && (
                  <button
                    onClick={handleNextEntry}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <span>
                      {currentEntryIdx + 1 === shuffledEntries.length
                        ? 'Teljes jegyzőkönyv audit lezárása'
                        : 'Következő jegyzőkönyv auditálása'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback notification */}
        {feedback && (
          <div
            className={`mt-6 p-4 rounded-xl border flex items-start gap-3 text-sm leading-relaxed ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{feedback.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};
