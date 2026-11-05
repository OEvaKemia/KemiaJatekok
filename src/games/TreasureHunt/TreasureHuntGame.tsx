import React, { useState, useEffect, useMemo } from 'react';
import { Compass, CheckCircle2, AlertTriangle, Key, Unlock, Lock, Sparkles, ChevronRight, Coins, Gem, MapPin } from 'lucide-react';
import { sound } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { ChemistAvatar, AvatarMood } from '../../components/ChemistAvatar';
import { TreasureIslandMap } from './TreasureIslandMap';
import { GameResult } from '../../types';

interface TreasureHuntProps {
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface OptionItem {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface RoomQuestion {
  id: number;
  roomName: string;
  lore: string;
  question: string;
  options: OptionItem[];
  educationalHint: string;
  topicTag: string;
}

const RAW_ROOMS_DATA: RoomQuestion[] = [
  {
    id: 1,
    roomName: '1. Állomás: Partraszállás a Kalózöbölben',
    lore: 'Hajód horgonyt vetett a titokzatos Alkán Kincses Sziget öblében. A pálmafák tövében talált kőtábla őrzi az első szigeti rejtvényt: mi az alkánok valódi természete?',
    question: 'A bemutatott tananyag alapján mit jelent pontosan, hogy az alkánok „telített, nyílt láncú szénhidrogének”?',
    options: [
      {
        id: 'r1-opt-1',
        text: 'Csak szén és hidrogén atomokat tartalmaznak, molekuláikban csak egyszeres kötések vannak, és a szénlánc nyílt.',
        isCorrect: true,
        explanation: 'Helyes! Az alkánok csak C és H atomokból állnak, kizárólag egyszeres kovalens σ-kötéseket tartalmaznak nyílt szénláncban.',
      },
      {
        id: 'r1-opt-2',
        text: 'Szén-, hidrogén- és oxigénatomokat tartalmaznak kör alakú gyűrűkbe rendeződve.',
        isCorrect: false,
        explanation: 'Nem megfelelő: a szénhidrogének nem tartalmaznak oxigént, a nyílt lánc pedig nem gyűrűs.',
      },
      {
        id: 'r1-opt-3',
        text: 'Tartalmaznak legalább egy szén-szén kettős kötést is a szénlánc mentén.',
        isCorrect: false,
        explanation: 'Téves: a kettős kötést tartalmazó vegyületek telítetlenek (alkének), az alkánokban csak egyszeres kötés van.',
      },
      {
        id: 'r1-opt-4',
        text: 'Olyan molekulák, amelyekben a szénatomok nem tudnak több hidrogént felvenni, de tartalmaznak aromás gyűrűt.',
        isCorrect: false,
        explanation: 'Téves: az aromás vegyületek gyűrűsek és telítetlenek, az alkánok viszont nyílt láncúak.',
      },
    ],
    educationalHint: 'Emlékezz a lecke 8. diájára: „• csak egyszeres kötés • nyílt lánc • csak szén és hidrogén”.',
    topicTag: 'Alkánok definíciója',
  },
  {
    id: 2,
    roomName: '2. Állomás: Az Ősi CₙH₂ₙ₊₂ Oltárkő',
    lore: 'A homokos partról a dzsungel belseje felé indulsz. Egy elfeledett monolit áll az ösvény mellett rovásokkal: CₙH₂ₙ₊₂. Az oltár a moláris tömegképletet és a pentán adatait követeli a továbbjutáshoz.',
    question: 'Ha az alkánok általános összegképlete CₙH₂ₙ₊₂, hogyan számolható a moláris tömegük (M), és mi a pentán (n=5) összegképlete és moláris tömege?',
    options: [
      {
        id: 'r2-opt-1',
        text: 'M = 14n + 2 g/mol; a pentán képlete C₅H₁₂, moláris tömege: 72 g/mol',
        isCorrect: true,
        explanation: 'Tökéletes! M = 12n + (2n+2)·1 = 14n + 2. n=5 esetén: C₅H₁₂, M = 14·5 + 2 = 72 g/mol.',
      },
      {
        id: 'r2-opt-2',
        text: 'M = 12n + 2 g/mol; a pentán képlete C₅H₁₀, moláris tömege: 62 g/mol',
        isCorrect: false,
        explanation: 'Hibás! A hidrogének moláris tömege is hozzáadódik (2n+2), így 14n+2 a helyes összefüggés, a C₅H₁₀ pedig alkén.',
      },
      {
        id: 'r2-opt-3',
        text: 'M = 14n g/mol; a pentán képlete C₅H₁₄, moláris tömege: 70 g/mol',
        isCorrect: false,
        explanation: 'Nem jó: a +2 tag a két láncvégi hidrogén miatt elengedhetetlen (14n + 2), pentánnál pedig 2n+2 = 12.',
      },
      {
        id: 'r2-opt-4',
        text: 'M = 16n + 2 g/mol; a pentán képlete C₅H₁₂, moláris tömege: 82 g/mol',
        isCorrect: false,
        explanation: 'Téves számolás: a szén relatív atomtömege 12, a hidrogéné 1, így a metiléncsoport 12+2=14 g/mol.',
      },
    ],
    educationalHint: 'Tekintsd át a 9. diát: M = 12·n + 1·(2n+2) = 14n + 2 g/mol. Pentán esetén n = 5.',
    topicTag: 'Általános képlet és moláris tömeg',
  },
  {
    id: 3,
    roomName: '3. Állomás: A Metilén-Kanyon Függőhídja',
    lore: 'Egy mély kanyon szakadékához érsz, ahol zúgó hegyi patak zubog. A kötélhíd deszkái csak akkor záródnak össze biztonságosan, ha ismered a szomszédos alkánok metilén differenciáját.',
    question: 'Mi a homológ sor differenciája az alkánoknál, és miért pontosan akkora a moláris tömeg ugrása, amekkora?',
    options: [
      {
        id: 'r3-opt-1',
        text: 'A differencia egy –CH₂– (metilén) csoport, a tömegkülönbség pedig Δ = 14 g/mol (szén: 12 + két hidrogén: 2).',
        isCorrect: true,
        explanation: 'Pontos! Minden egymást követő alkán pontosan egy –CH₂– (metilén) csoporttal hosszabb, ami 12 + 2 = 14 g/mol növekedést jelent.',
      },
      {
        id: 'r3-opt-2',
        text: 'A differencia egy –CH₃ (metil) csoport, a tömegkülönbség pedig Δ = 15 g/mol.',
        isCorrect: false,
        explanation: 'Nem: ha egy metilcsoport ékelődne be, a hidrogének száma nem felelne meg a nyílt lánc kétértékű beépülésének.',
      },
      {
        id: 'r3-opt-3',
        text: 'A differencia két hidrogénatom (H₂), a tömegkülönbség pedig Δ = 2 g/mol.',
        isCorrect: false,
        explanation: 'Hibás: a szénatomok száma is eggyel nő minden tagnál, nemcsak a hidrogéneké.',
      },
      {
        id: 'r3-opt-4',
        text: 'A differencia egy C–C egyszeres kötés hidrogének nélkül, Δ = 12 g/mol.',
        isCorrect: false,
        explanation: 'Hibás: a szén 4 vegyértékű, a láncba épülő szénhez 2 hidrogénatom tartozik (–CH₂–).',
      },
    ],
    educationalHint: 'A 11. és 14. dia szerint: a homológ sor tagjai egy –CH₂– (metilén) csoportban különböznek, Δ = 14 g/mol.',
    topicTag: 'Homológ sor differenciája',
  },
  {
    id: 4,
    roomName: '4. Állomás: A Gázok és Paraffinok Barlangja',
    lore: 'A kanyon túloldalán barlang nyílik, melyben természetes gázok lobognak és szilárd viaszcseppkövek csillognak. A barlang bejárata teszteli a mindennapi alkánok ismeretét.',
    question: 'A lecke mindennapi példái alapján melyik állítás IGAZ a propán-bután PB-gázra és a paraffinra?',
    options: [
      {
        id: 'r4-opt-1',
        text: 'A PB-gáz propánból (C₃H₈) és butánból (C₄H₁₀) áll, a palackban nyomás alatt cseppfolyós, míg a gyertya paraffinja szilárd, C₁₈ feletti alkánok keveréke.',
        isCorrect: true,
        explanation: 'Kiváló válasz! A PB-gáz szobahőmérsékleten gáz, de a palackban lévő nyomás miatt folyékony; a paraffin szilárd alkán (C₁₈ felett, olvadáspont 50–60 °C).',
      },
      {
        id: 'r4-opt-2',
        text: 'A PB-gáz kizárólag metánt tartalmaz folyékony állapotban nyomás nélkül, a paraffin pedig gáz halmazállapotú.',
        isCorrect: false,
        explanation: 'Téves: a metán a földgáz fő része, a PB-gáz propán-bután, a paraffin pedig szilárd gyertyaanyag.',
      },
      {
        id: 'r4-opt-3',
        text: 'A bután (C₄H₁₀) szobahőmérsékleten szilárd, ezért csak felmelegítve tölthető öngyújtókba.',
        isCorrect: false,
        explanation: 'Nem: a bután forráspontja –0,5 °C, szobahőmérsékleten gáz, az öngyújtóban nyomás alatt cseppfolyós.',
      },
      {
        id: 'r4-opt-4',
        text: 'A paraffin kizárólag metánból és etánból áll, amelyeket fagyasztással tartanak szilárdan.',
        isCorrect: false,
        explanation: 'Téves: a metán és etán kis szénatomszámú gázok; a szilárd paraffin nagyszénatomszámú (C₁₈ feletti) molekulákból áll.',
      },
    ],
    educationalHint: 'Lásd a 4., 5. és 6. diákat: propán f.p. –42 °C, bután –0,5 °C (nyomás alatt folyadék a palackban), paraffin: C₁₈ felett szilárd.',
    topicTag: 'Mindennapi alkánok és állapotok',
  },
  {
    id: 5,
    roomName: '5. Állomás: A Szénatomok Keresztútja',
    lore: 'Az ösvény a sziget sziklás gerincéhez érkezik. Két ősi arany mérleg áll a sziklán: a metán és a bután széntartalmának aránya mutatja a helyes utat a csúcs felé.',
    question: 'A lecke 12. és 13. diájának számításai szerint a propán széntartalma 81,8%. Melyik tartalmaz több szenet 1 g anyagban: a metán (CH₄) vagy a bután (C₄H₁₀), és miért?',
    options: [
      {
        id: 'r5-opt-1',
        text: 'A bután (kb. 82,8% C), mert a homológ sorban a szénatomszám növekedésével a szén tömeghányada növekszik (metánnál csak 75% C).',
        isCorrect: true,
        explanation: 'Briliáns gondolkodás! Metán: 12/16 = 75,0% C. Bután: 48/58 = 82,76% C. A lánc hosszabbodásával a szén aránya nő.',
      },
      {
        id: 'r5-opt-2',
        text: 'A metán, mert abban van a legkevesebb hidrogén (csak 4 H atom), így ott a legnagyobb a szén tömeghányada.',
        isCorrect: false,
        explanation: 'Gyakori tévedés! Bár abszolút értékben 4 H van, arányaiban a metánban van a legtöbb H a szénhez képest.',
      },
      {
        id: 'r5-opt-3',
        text: 'Mindkettőben pontosan ugyanannyi szén van 1 grammban (50%), mert mindkettő telített alkán.',
        isCorrect: false,
        explanation: 'Téves: a különböző alkánok szén/hidrogén aránya eltér a molekulatömeg függvényében.',
      },
      {
        id: 'r5-opt-4',
        text: 'A földgáz és az öngyújtógáz széntartalma azonos (81,8%), pontosan mint a propáné.',
        isCorrect: false,
        explanation: 'Nem: 81,8% specifikusan a propán (C₃H₈) széntartalma, a metáné 75%, a butáné ~82,8%.',
      },
    ],
    educationalHint: 'Számolás a 12. dia alapján: metánban 12/16 = 75% C; butánban 48/58 = 82,8% C. A bután széntartalma nagyobb!',
    topicTag: 'Tömegszázalékos összetétel',
  },
  {
    id: 6,
    roomName: '6. Állomás: Koponya-szikla & Az Arany Kincsesláda (X)',
    lore: 'Felértél a Koponya-szikla fennsíkjára! Egy drágakövekkel kirakott, színarany kincsesláda áll a sziklán. A láda lakatjának végső kombinációja az oktán képlete és a homológ sor összefoglaló törvénye!',
    question: 'A homológ sor első 12 tagjának ismeretében mi az oktán (8 szénatomos) összegképlete, és melyik alkánsor-tulajdonság zárja le a lecke összefoglalóját?',
    options: [
      {
        id: 'r6-opt-1',
        text: 'Az oktán képlete C₈H₁₈ (M = 114 g/mol), és minden alkán telített nyílt láncú, ahol CₙH₂ₙ₊₂ a képlet és Δ = 14 g/mol a lépésköz.',
        isCorrect: true,
        explanation: 'A KINCSET MEGTALÁLTAD! n=8: C₈H₁₈, M = 14·8 + 2 = 114 g/mol. A homológ sor törvényei hibátlanul érvényesülnek.',
      },
      {
        id: 'r6-opt-2',
        text: 'Az oktán képlete C₈H₁₆, és a homológ sor tagjai aromás jellegűek.',
        isCorrect: false,
        explanation: 'Hibás: a C₈H₁₆ alkén vagy cikloalkán lenne, az alkán oktán C₈H₁₈.',
      },
      {
        id: 'r6-opt-3',
        text: 'Az oktán képlete C₈H₂₀, mert a hidrogének száma mindig a szénatomok számának háromszorosa mínusz négy.',
        isCorrect: false,
        explanation: 'Téves: a helyes képlet 2n+2 = 2·8+2 = 18 hidrogén.',
      },
      {
        id: 'r6-opt-4',
        text: 'Az oktán képlete C₈H₁₄, és a homológ sorban nincsenek hidrogénkötések, mert csak szilárd anyagok léteznek.',
        isCorrect: false,
        explanation: 'Nem: C₈H₁₄ alkin lenne, ráadásul az első tagok gázok és folyadékok.',
      },
    ],
    educationalHint: 'Tekintsd át a 10. és 14. dia összefoglalását: CₙH₂ₙ₊₂, M = 14n + 2, n=8 esetén 2·8+2=18.',
    topicTag: 'Homológ sor összefoglalás',
  },
];

export const TreasureHuntGame: React.FC<TreasureHuntProps> = ({ onComplete, onExit }) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [gradeScore, setGradeScore] = useState(10.0); // 10-point scale
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [roomAttempts, setRoomAttempts] = useState<number[]>(new Array(RAW_ROOMS_DATA.length).fill(0));
  const [unlockedRooms, setUnlockedRooms] = useState<boolean[]>([true, false, false, false, false, false]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Shuffle options for all rooms on game mount so answer is NEVER predictable or always A
  const shuffledRooms = useMemo(() => {
    return RAW_ROOMS_DATA.map((room) => ({
      ...room,
      options: shuffleArray(room.options),
    }));
  }, []);

  // Timer starts immediately on the island map
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const currentRoom = shuffledRooms[currentRoomIndex];

  const handleSelectOption = (id: string) => {
    if (isAnswerChecked && feedback?.isCorrect) return;
    sound.playClick();
    setSelectedOptionId(id);
    setIsAnswerChecked(false);
    setFeedback(null);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionId === null) return;
    const opt = currentRoom.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    const newAttempts = [...roomAttempts];
    newAttempts[currentRoomIndex] += 1;
    setRoomAttempts(newAttempts);

    if (opt.isCorrect) {
      sound.playCorrect();
      setIsAnswerChecked(true);
      setFeedback({ isCorrect: true, text: opt.explanation });

      if (currentRoomIndex + 1 < shuffledRooms.length) {
        const newUnlocked = [...unlockedRooms];
        newUnlocked[currentRoomIndex + 1] = true;
        setUnlockedRooms(newUnlocked);
      }
    } else {
      sound.playWrong();
      setIsAnswerChecked(true);
      setFeedback({ isCorrect: false, text: opt.explanation });
      // Deduct from 10-point scale
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
    }
  };

  const handleNextRoom = () => {
    sound.playClick();
    if (currentRoomIndex + 1 < shuffledRooms.length) {
      setCurrentRoomIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
      setFeedback(null);
    } else {
      setIsGameOver(true);
      const finalScore = Math.max(3.0, Math.min(10.0, Number(gradeScore.toFixed(1))));
      const percentage = Math.round((finalScore / 10.0) * 100);

      const strengths: string[] = [];
      const reviewAreas: string[] = [];

      if (roomAttempts[0] === 1) strengths.push('Alkán definíció (telített nyílt lánc) biztos ismerete');
      else reviewAreas.push('Alkánok definíciójának és kötésszerkezetének ismétlése');

      if (roomAttempts[1] === 1) strengths.push('CₙH₂ₙ₊₂ és M = 14n + 2 képletek alkalmazása');
      else reviewAreas.push('Moláris tömegképlet (14n + 2 g/mol) levezetése');

      if (roomAttempts[2] === 1) strengths.push('Homológ sor metilén (–CH₂–, Δ=14) különbsége');
      else reviewAreas.push('A homológ sor differencia jelentése és oka');

      if (roomAttempts[4] === 1) strengths.push('Tömegszázalékos összefüggések (metán vs. bután)');
      else reviewAreas.push('Alkánok széntartalmának növekedése a lánchosszal');

      if (strengths.length === 0) strengths.push('Sikeres végighaladás a kincskeresés mind a 6 kamráján');
      if (reviewAreas.length === 0) reviewAreas.push('Kiváló, hibátlan tudás az 1. lecke teljes anyagából!');

      let teacherRecommendation = '';
      if (finalScore >= 9.5) {
        teacherRecommendation = 'Kiváló teljesítmény! Javaslat: 10-es érdemjegy beírása a katalógusba / naplóba.';
      } else if (finalScore >= 8.5) {
        teacherRecommendation = 'Nagyon jó munka! Javaslat: 9-es érdemjegy vagy piros pont adása.';
      } else if (finalScore >= 7.0) {
        teacherRecommendation = 'Jó felkészültség! Javaslat: 7-es vagy 8-as érdemjegy adása.';
      } else {
        teacherRecommendation = 'Közepes szint, a homológ sor és képletek átismétlése szükséges.';
      }

      onComplete({
        gameId: 'treasure-hunt',
        gameTitle: 'Kincskeresés az Alkánok Barlangjában',
        pdfTitle: 'Alkánok 1. óra – Bevezetés, homológ sor, általános képlet',
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
      {/* Top Game Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              1. Játéktípus · Kincskeresés a kémiai szigeten
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentRoom.roomName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Idő: <span className="text-amber-400 font-bold tabular-nums">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-emerald-500/40 text-slate-300">
            Érdemjegy: <span className="text-emerald-400 font-bold tabular-nums">{gradeScore.toFixed(1)}</span> / 10
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-sans font-medium cursor-pointer"
          >
            Főmenü
          </button>
        </div>
      </div>

      {/* Interactive Chemist Character Guide in the Dungeon */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <ChemistAvatar
          role="explorer"
          mood={
            feedback
              ? feedback.isCorrect
                ? 'cheering'
                : 'warning'
              : selectedOptionId
              ? 'thinking'
              : 'idle'
          }
          speechText={
            feedback
              ? feedback.isCorrect
                ? 'Zseniális, feltárult az állomás titka! Kattints a következő szigeti állomásra a térképen!'
                : 'Hoppá, nem nyílt ki a zár! Olvasd el a tanári tippet és gondold át a kémiát!'
              : currentRoomIndex === 5
              ? 'Elértük a Koponya-hegyet és a fő kincseskamrát! Az alkánok végső kódja nyitja a színarany ládát!'
              : 'Kattints az állomásokra a fenti térképen, vagy oldd meg a feladványt a szigeten való előrejutáshoz!'
          }
          size="md"
        />

        {/* Visual Map Progress */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
          <span className="text-[11px] font-mono uppercase text-slate-400 mr-1">Haladás:</span>
          {shuffledRooms.map((_, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                idx === currentRoomIndex
                  ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/50 animate-bounce'
                  : idx < currentRoomIndex
                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 text-slate-600'
              }`}
            >
              {idx === currentRoomIndex ? '🏃' : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Illustrated Treasure Island Map with Direct Click Selection */}
      <TreasureIslandMap
        currentStation={currentRoomIndex}
        unlockedStations={unlockedRooms}
        onSelectStation={(idx) => {
          if (unlockedRooms[idx]) {
            sound.playClick();
            setCurrentRoomIndex(idx);
            setSelectedOptionId(null);
            setIsAnswerChecked(false);
            setFeedback(null);
          }
        }}
      />

      {/* Island Interaction Instruction Banner */}
      <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 mb-6 shadow-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>
            <strong>Alkán Kincses Sziget:</strong> A játék közvetlenül innen, a térképről nyílik! Kattints a térkép állomásaira vagy oldd meg a feladványt!
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-amber-300 shrink-0 hidden sm:inline px-2.5 py-1 rounded-lg bg-amber-900/60 border border-amber-700">
          📍 {currentRoomIndex + 1}. Állomás aktív
        </span>
      </div>

      {/* Active Chamber Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-6 relative overflow-hidden">
        {/* Subtle Treasure chest background illustration for room 6 */}
        {currentRoomIndex === 5 && (
          <div className="absolute top-4 right-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-400 animate-pulse">
            <Coins className="w-6 h-6" />
            <Gem className="w-6 h-6 text-cyan-400" />
            <span className="text-xs font-bold font-mono">ARANYKINCSTÁR</span>
          </div>
        )}

        {/* Lore / Context */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-6 text-sm text-slate-300 leading-relaxed">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p>{currentRoom.lore}</p>
        </div>

        {/* Question Header */}
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-1.5 block">
            {currentRoom.topicTag}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentRoom.question}
          </h3>
        </div>

        {/* Shuffled Options */}
        <div className="space-y-3 mb-6">
          {currentRoom.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyles = 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-200';

            if (isSelected) {
              if (isAnswerChecked) {
                optionStyles = opt.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md';
              } else {
                optionStyles = 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${optionStyles}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? isAnswerChecked
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

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border mb-6 flex items-start gap-3 text-sm leading-relaxed ${
              feedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold mb-1">{feedback.isCorrect ? 'Sikeres kulcsolás!' : 'A zár nem nyílt ki!'}</p>
              <p>{feedback.text}</p>
              {!feedback.isCorrect && (
                <p className="mt-2 text-xs text-amber-300 font-medium bg-amber-950/40 p-2 rounded-lg border border-amber-600/30">
                  💡 Tanári segítség: {currentRoom.educationalHint}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {roomAttempts[currentRoomIndex] > 0 && !feedback?.isCorrect && (
              <span>Próbálkozások száma: {roomAttempts[currentRoomIndex]}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {(!isAnswerChecked || !feedback?.isCorrect) && (
              <button
                disabled={selectedOptionId === null}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Zár ellenőrzése</span>
              </button>
            )}

            {isAnswerChecked && feedback?.isCorrect && (
              <button
                onClick={handleNextRoom}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>
                  {currentRoomIndex + 1 === shuffledRooms.length ? 'Kincsesláda kinyitása' : 'Tovább a következő kapuhoz'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
