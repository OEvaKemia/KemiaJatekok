import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, CheckCircle2, AlertTriangle, Beaker, ChevronRight, Flame, ShieldAlert, Cpu, Sparkles, Wind, Maximize2, X, Camera } from 'lucide-react';
import { sound } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { ChemistAvatar } from '../../components/ChemistAvatar';
import { GameResult } from '../../types';
import { ASSETS } from '../../assets';

interface LabMysteryProps {
  onComplete: (result: GameResult) => void;
  onExit: () => void;
}

interface HypothesisItem {
  id: string;
  text: string;
  isCorrect: boolean;
  analysis: string;
}

interface MysteryStage {
  id: number;
  locationTitle: string;
  incidentReport: string;
  evidenceItems: string[];
  question: string;
  hypotheses: HypothesisItem[];
  educationalClue: string;
  lessonConcept: string;
}

const RAW_MYSTERY_STAGES: MysteryStage[] = [
  {
    id: 1,
    locationTitle: '1. Helyszín: A Ködös Lápvidék és a Lidércfény',
    incidentReport: 'A helyi lakosok kísérteties, kékes-zöldes lángok hirtelen fellobbanásáról számoltak be az állóvizek felett az éjszakában. A néphit kísértetek lelkeinek tulajdonítja a jelenséget.',
    evidenceItems: [
      'Gázmintavevő palack a tó fenekéről felszálló buborékokkal',
      'Anaerob cellulózbontó baktériumok jelenléte az iszapban',
      'Nyomokban kimutatott foszfor-hidrogének: PH₃ és P₂H₄',
    ],
    question: 'A kémiai vizsgálat alapján mi magyarázza tudományosan a mocsári lidércfény (palus-gáz) spontán fellobbanását?',
    hypotheses: [
      {
        id: 'h1-1',
        text: 'Az anaerob baktériumok által termelt metán mellett nyomokban képződő difoszfán (P₂H₄) szobahőmérsékleten öngyulladásra hajlamos a levegőn, ami azonnal meggyújtja a metánt.',
        isCorrect: true,
        analysis: 'Nyomozati siker! A difoszfán (P₂H₄) levegővel érintkezve szobahőmérsékleten magától meggyullad, és a fellobbanó szikra azonnal belobbantja a metángázt is.',
      },
      {
        id: 'h1-2',
        text: 'A mocsári víz felmelegszik 800 °C-ra a bomlástól, és ez közvetlenül termikusan meggyújtja a nitrogéngázt.',
        isCorrect: false,
        analysis: 'Kémiailag képtelenség: a mocsár vize hideg, a nitrogén pedig nem éghető gáz.',
      },
      {
        id: 'h1-3',
        text: 'A metán önmagában, tiszta állapotban szobahőmérsékleten bármilyen szikra vagy öngyulladó adalék nélkül is magától lángra kap a hideg levegőn.',
        isCorrect: false,
        analysis: 'Téves! A tiszta metán stabil, szobahőmérsékleten NEM gyullad meg magától; a gyulladást a nyomokban lévő difoszfán indítja el.',
      },
    ],
    educationalClue: 'A 4. dián szerepel: a bomláskor metán mellett difoszfán (P₂H₄) is képződik, ami szobahőmérsékleten öngyulladó!',
    lessonConcept: 'Mocsárgáz és lidércfény mechanizmusa',
  },
  {
    id: 2,
    locationTitle: '2. Helyszín: A Kőszénbánya Vészhelyzete',
    incidentReport: 'A kőszénbánya mélytárnájában detonáció rázta meg a vájatot. A bányafelügyelő a „sújtólég” berobbanására gyanakszik, amely a szénképződés során bezáródott metánból származik.',
    evidenceItems: [
      'Gázelemző műszer: metán és levegő keveréke a tárnában',
      'Történelmi relikvia: Humphry Davy-féle biztonsági bányászlámpa fémhálóval',
    ],
    question: 'Milyen térfogatszázalékos arányban képez a metán a levegővel heves robbanóelegyet (sújtólég), és hogyan akadályozza meg a robbanást a Davy-lámpa?',
    hypotheses: [
      {
        id: 'h2-1',
        text: '5–15 térfogatszázalék metán a levegővel robbanóelegy; a Davy-lámpa sűrű fémhálója elvezeti a hőt, így a belső láng nem melegíti fel a külső gázt a gyulladási hőmérsékletre.',
        isCorrect: true,
        analysis: 'Tökéletes detektívmunka! Az 5–15 tf% metán–levegő elegy heves detonációra képes. A fémháló kiváló hővezető, ezért a hálón kívül nem érhető el a gyulladáspont.',
      },
      {
        id: 'h2-2',
        text: 'Csak 80–98 térfogatszázalék között robban a metán; a Davy-lámpa teljesen hermetikusan kizárja az oxigént a lámpa belsejéből.',
        isCorrect: false,
        analysis: 'Hibás! A 80–98% a földgáz metántartalma, de ott nincs elegendő oxigén a robbanáshoz. A robbanási tartomány 5–15 tf% a levegőben!',
      },
      {
        id: 'h2-3',
        text: 'A metán 0,1% alatt robban; a Davy-lámpa üvegburája kémiai reakcióval semlegesíti a metánt szén-dioxiddá.',
        isCorrect: false,
        analysis: 'Téves adat és mechanizmus. A metán 5 tf% alatt túl híg, 15 tf% felett pedig oxigénhiányos a robbanáshoz.',
      },
    ],
    educationalClue: 'A lecke 4. és 5. diája: „5–15 tf% arányban rendkívül heves robbanóelegyet képez... Davy-lámpa fémhálóval”.',
    lessonConcept: 'Sújtólég robbanási tartomány és biztonsági lámpa',
  },
  {
    id: 3,
    locationTitle: '3. Helyszín: A Gőzös Reformáló Reaktor Csarnoka',
    incidentReport: 'A vegyi üzemben a metánt nem csupán eltüzelik, hanem értékes alapanyaggá alakítják (kemizálás). A reaktorcsőbe metánt és vízgőzt táplálnak be magas nyomáson.',
    evidenceItems: [
      'Reaktor paraméterek: 800–900 °C, 20–30 bar nyomás, nikkel (Ni) katalizátor',
      'Termékelemzés: 1:3 arányú szén-monoxid és hidrogén gázelegy',
    ],
    question: 'Mi a reakció egyenlete, és mi a keletkező gázelegy neve és fő felhasználási területe a vegyiparban?',
    hypotheses: [
      {
        id: 'h3-1',
        text: 'CH₄ + H₂O ⇌ CO + 3 H₂ (gőzös reformálás, endoterm egyensúly); a termék a szintézisgáz, amiből metanolt gyártanak és a Haber–Bosch ammóniaszintézishez ad hidrogént.',
        isCorrect: true,
        analysis: 'Briliáns következtetés! Ez a gőzös reformálás (steam reforming), az ipari szintézisgáz és hidrogén előállításának legfontosabb útja.',
      },
      {
        id: 'h3-2',
        text: 'CH₄ + 2 H₂O → CO₂ + 4 H₂; a termék neve vízgáz, amelyet kizárólag szódavíz gyártására használnak.',
        isCorrect: false,
        analysis: 'Nem ez a reformálás fő reakcióegyenlete: a gőzös reformálásnál CO és 3 H₂ keletkezik (szintézisgáz).',
      },
      {
        id: 'h3-3',
        text: 'CH₄ + H₂O → CH₃OH + H₂; a metánból közvetlenül egy lépésben metanol cseppfolyósodik katalizátor nélkül.',
        isCorrect: false,
        analysis: 'Téves: a metán és vízgőz reakciójában szén-monoxid és 3 mol hidrogén képződik (CO + 3 H₂), nem közvetlen alkohol.',
      },
    ],
    educationalClue: 'Lásd a 7. diát: CH₄ + H₂O ⇌ CO + 3 H₂ (Ni-katalizátor, 800–900 °C, 20–30 bar; szintézisgáz metanolhoz és Haber–Bosch eljáráshoz).',
    lessonConcept: 'Gőzös reformálás és szintézisgáz',
  },
  {
    id: 4,
    locationTitle: '4. Helyszín: Az Andrussow-Üzem Riasztása',
    incidentReport: 'A szintetikus szálakat előállító gyáregységben egy platina-ródium katalizátorhálón keresztül metánt, ammóniát és oxigént vezetnek át magas hőmérsékleten.',
    evidenceItems: [
      'Reagensek: 2 CH₄ + 2 NH₃ + 3 O₂',
      'Katalizátor: Pt–Rh fémháló izzó hőmérsékleten',
      'Végtermék: akrilnitril és szintetikus műanyagok alapanyaga',
    ],
    question: 'Melyik vegyipari eljárás zajlik a reaktorban, és mi a keletkező kulcsfontosságú termék képlete és neve?',
    hypotheses: [
      {
        id: 'h4-1',
        text: 'Andrussow-eljárás (oxidatív ammoxidálás): 2 CH₄ + 2 NH₃ + 3 O₂ → 2 HCN + 6 H₂O; a keletkező termék a ciánhidrogén (HCN).',
        isCorrect: true,
        analysis: 'Pontos azonosítás! Az Andrussow-eljárás során a metán ammóniával és oxigénnel ciánhidrogént (HCN) képez, ami az akrilnitril és műanyagok nyersanyaga.',
      },
      {
        id: 'h4-2',
        text: 'Haber–Bosch eljárás: CH₄ + NH₃ → CH₃NH₂ + H₂; a keletkező termék metil-amin.',
        isCorrect: false,
        analysis: 'Téves: a Haber–Bosch eljárás nitrogénből és hidrogénből ammóniát állít elő. A metán + NH₃ + O₂ az Andrussow-eljárás (HCN).',
      },
      {
        id: 'h4-3',
        text: 'Solvay-eljárás: 2 CH₄ + NH₃ + O₂ → (NH₄)₂CO₃; a keletkező termék szalmiákszesz.',
        isCorrect: false,
        analysis: 'Nem: a Solvay-módszer szódagyártásra szolgál; a Pt-Rh hálós oxidatív ammoxidálás ciánhidrogént termel.',
      },
    ],
    educationalClue: 'A lecke 8. diáján olvasható: Andrussow-eljárás: 2 CH₄ + 2 NH₃ + 3 O₂ → 2 HCN + 6 H₂O (Pt-Rh háló, oxidatív ammoxidálás).',
    lessonConcept: 'Andrussow-féle oxidatív ammoxidálás',
  },
  {
    id: 5,
    locationTitle: '5. Helyszín: A Fekete Por és a Vakító Hegesztőláng',
    incidentReport: 'A pirolízis üzemben a metánt 1600 °C-ra hevítik másodperc töredékére, majd gyorsan lehűtik. A szűrőkön finom fekete korom tapad meg, a gázelvezetőn pedig hegesztőgáz távozik.',
    evidenceItems: [
      'Gázláng hőmérséklete tiszta oxigénben: eléri a 3200 °C-ot',
      'Fekete por vizsgálata: ipari korom (aktív korom)',
      'Gumiabroncsgyár megrendelése: a gumi tömegének akár 30%-át teszi ki a kopásállóságért',
    ],
    question: 'Melyik két kulcstermék keletkezik a metán 1600 °C-os pirolízisekor, és mire használják őket?',
    hypotheses: [
      {
        id: 'h5-1',
        text: 'Acetilén (C₂H₂, autogén hegesztéshez és PVC műanyaggyártáshoz) és aktív korom (szén, ami a gumiabroncsok kopásállóságát növeli és tonerek fekete pigmentje).',
        isCorrect: true,
        analysis: 'Kiváló detektívmunka! 2 CH₄ → C₂H₂ + 3 H₂ (1600 °C-on), illetve CH₄ → C + 2 H₂. Az acetilén 3200 °C-on ég oxigénben, az aktív korom pedig a gumiipar kulcsanyaga.',
      },
      {
        id: 'h5-2',
        text: 'Etilén (C₂H₄) és grafit ceruzabél, amelyet kizárólag papírgyártásra használnak.',
        isCorrect: false,
        analysis: 'Téves: a metán 1600 °C-os pirolízisének terméke acetilén (C₂H₂) és finom eloszlású ipari korom, nem ceruzabél.',
      },
      {
        id: 'h5-3',
        text: 'Diklórmetán és mészkőpor a cementgyártáshoz.',
        isCorrect: false,
        analysis: 'Kémiailag hibás: klórozószer nélkül nem keletkezhet klórmetán, kalcium nélkül pedig nem képződhet mész.',
      },
    ],
    educationalClue: 'A lecke 11. diáján: 2 CH₄ (1600 °C) → C₂H₂ + 3 H₂ (3200 °C hegesztés, PVC) és CH₄ → C + 2 H₂ (aktív korom gumiabroncsokhoz 30%).',
    lessonConcept: 'Metán pirolízis, acetilén és aktív korom',
  },
  {
    id: 6,
    locationTitle: '6. Helyszín: A Szellőzetlen Helyiség Rejtélye',
    incidentReport: 'Egy lakóház elzáródott kéményű kazánjánál a lakók szédülésről és rosszullétről panaszkodtak. A gázégő nem kék, hanem kormozó sárga lánggal égett.',
    evidenceItems: [
      'Orvosi lelet: a vér oxigénszállító kapacitása drasztikusan lecsökkent',
      'Kémiai ok: oxigénhiányos, tökéletlen égés',
    ],
    question: 'Melyik veszélyes égéstermék keletkezett a tökéletlen égés során (2 CH₄ + 3 O₂ → ?), és miért halálosan mérgező az emberi szervezetre?',
    hypotheses: [
      {
        id: 'h6-1',
        text: 'Szén-monoxid (CO) keletkezik: 2 CH₄ + 3 O₂ → 2 CO + 4 H₂O. Színtelen, szagtalan, és a hemoglobinhoz több mint 200-szor erősebben kötődik, mint az oxigén!',
        isCorrect: true,
        analysis: 'A labor rejtélye teljes egészében megoldva! A szén-monoxid (CO) a hemoglobin vasához rendkívül stabilan kötődik, blokkolva a sejt szintű oxigénellátást.',
      },
      {
        id: 'h6-2',
        text: 'Szén-dioxid (CO₂), amely a hemoglobinhoz egyáltalán nem kötődik, csak kellemetlen szúrós szagot áraszt a szobában.',
        isCorrect: false,
        analysis: 'Téves: a tökéletes égés ad szén-dioxidot. A mérgezést a szén-monoxid (CO) okozza, amely ráadásul teljesen szagtalan!',
      },
      {
        id: 'h6-3',
        text: 'Ózon (O₃), amely a földgáz lángjában képződik és elnyeli az ultraibolya sugarakat a szobában.',
        isCorrect: false,
        analysis: 'Kémiailag hibás: a metán égésekor nem keletkezik ózon.',
      },
    ],
    educationalClue: 'A 12. dián: 2 CH₄ + 3 O₂ → 2 CO + 4 H₂O (tökéletlen égés, a CO a hemoglobinhoz >200-szor erősebben kötődik).',
    lessonConcept: 'Tökéletlen égés és szén-monoxid veszély',
  },
];

export const LabMysteryGame: React.FC<LabMysteryProps> = ({ onComplete, onExit }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [isExamined, setIsExamined] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gradeScore, setGradeScore] = useState(10.0);
  const [mistakes, setMistakes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Shuffle hypotheses so the correct choice is NEVER consistently in position 1
  const shuffledStages = useMemo(() => {
    return RAW_MYSTERY_STAGES.map((stg) => ({
      ...stg,
      hypotheses: shuffleArray(stg.hypotheses),
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

  const stage = shuffledStages[currentStageIdx];

  const handleSelectHypothesis = (id: string) => {
    if (isExamined && feedback?.isCorrect) return;
    sound.playClick();
    setSelectedHypothesisId(id);
    setIsExamined(false);
    setFeedback(null);
  };

  const handleTestEvidence = () => {
    if (!selectedHypothesisId) return;
    const hyp = stage.hypotheses.find((h) => h.id === selectedHypothesisId);
    if (!hyp) return;

    if (hyp.isCorrect) {
      sound.playCorrect();
      setIsExamined(true);
      setFeedback({ isCorrect: true, text: hyp.analysis });
    } else {
      sound.playWrong();
      setMistakes((prev) => prev + 1);
      setGradeScore((prev) => Math.max(3.0, Number((prev - 0.7).toFixed(1))));
      setIsExamined(true);
      setFeedback({ isCorrect: false, text: hyp.analysis });
    }
  };

  const handleNextStage = () => {
    sound.playClick();
    if (currentStageIdx + 1 < shuffledStages.length) {
      setCurrentStageIdx((prev) => prev + 1);
      setSelectedHypothesisId(null);
      setIsExamined(false);
      setFeedback(null);
    } else {
      setIsGameOver(true);
      const finalScore = Math.max(3.0, Math.min(10.0, Number(gradeScore.toFixed(1))));
      const percentage = Math.round((finalScore / 10.0) * 100);

      const strengths: string[] = [
        'Mocsárgáz lidércfény (metán + difoszfán P₂H₄) tisztázása',
        'Sújtólég robbanóelegy (5–15 tf%) és Davy-lámpa fémháló szerepe',
        'Gőzös reformálás (CO + 3 H₂) és Andrussow ciánhidrogén szintézis',
        '1600 °C-os pirolízis (acetilén 3200 °C láng + aktív korom abroncsokba)',
      ];

      const reviewAreas: string[] = [];
      if (mistakes > 0) {
        reviewAreas.push('Tökéletlen égés (CO képződés, 200× hemoglobin kötődés) átismétlése');
      } else {
        reviewAreas.push('Mesterdetektív fokozat: az összes ipari és természeti metánreakció pontos ismerete!');
      }

      let teacherRecommendation = '';
      if (finalScore >= 9.5) {
        teacherRecommendation = 'Mesteri nyomozás! Javaslat: 10-es érdemjegy beírása a katalógusba / naplóba.';
      } else if (finalScore >= 8.5) {
        teacherRecommendation = 'Nagyon jó analitikai munka! Javaslat: 9-es érdemjegy vagy piros pont adása.';
      } else if (finalScore >= 7.0) {
        teacherRecommendation = 'Jó eredmény! Javaslat: 7-es vagy 8-as érdemjegy adása.';
      } else {
        teacherRecommendation = 'Közepes szint, a metán kemizálásának reakcióegyenleteit érdemes még átnézni.';
      }

      onComplete({
        gameId: 'lab-mystery',
        gameTitle: 'A Rejtélyes Gáz és a Vegyi Gyár Esete',
        pdfTitle: 'A metán kémiai feldolgozása (Kemizálás)',
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-slate-900/90 border border-purple-500/40 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block font-serif">
              3. Játéktípus · Mesebeli alkimista rejtély
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-serif">
              A Varázslatos Labor Rejtélye – A Metán Krónikája
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-200">
            Krónika: <span className="text-amber-400 font-bold tabular-nums">{currentStageIdx + 1}</span> / {shuffledStages.length}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Idő: <span className="text-amber-400 font-bold tabular-nums">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-purple-500/40 text-slate-300">
            Érdemjegy: <span className="text-emerald-400 font-bold tabular-nums">{gradeScore.toFixed(1)}</span> / 10
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            title="Ködös lápvidék és mocsárgáz fotó megtekintése"
            className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-cyan-300 hover:text-white transition-colors text-xs font-sans font-medium cursor-pointer flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Lápvidék fotó</span>
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 hover:text-white transition-colors text-xs font-sans font-medium cursor-pointer"
          >
            Főmenü
          </button>
        </div>
      </div>

      {/* Detective/Alchemist Character Assistant */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <ChemistAvatar
          role="detective"
          mood={
            feedback
              ? feedback.isCorrect
                ? 'cheering'
                : 'warning'
              : selectedHypothesisId
              ? 'thinking'
              : 'idle'
          }
          speechText={
            feedback
              ? feedback.isCorrect
                ? 'Varázslatos dedukció! A krónika titkos pecsétje feltárult a helyes kémiai tudásoddal!'
                : 'Hoppá! Ez a varázslat megbicsaklott. Olvasd el a tanári tekercset és vizsgáld meg a lombikokat!'
              : 'Köszöntelek a mesebeli laboratóriumban! Vizsgáld meg a mágikus bizonyítékokat, és találd meg az igazi magyarázatot!'
          }
          size="md"
        />
      </div>

      {/* Fairytale Chapters Indicator */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {shuffledStages.map((s, idx) => (
          <div
            key={s.id}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-all font-serif ${
              idx === currentStageIdx
                ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-md scale-105'
                : idx < currentStageIdx
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            {idx < currentStageIdx ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span>📜 {idx + 1}.</span>
            )}
            <span>{s.locationTitle.split(':')[1]?.trim() || s.locationTitle}</span>
          </div>
        ))}
      </div>

      {/* Storybook Dossier Card with Fairytale Alchemist Aesthetic */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c122c] via-[#140e24] to-[#0c0717] border-2 border-purple-500/40 shadow-2xl mb-6 relative overflow-hidden">
        {/* Fairytale Magic Glow & Bubbling Potions Illustration */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
              🧙‍♂️
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 block font-bold">
                Mesebeli Krónika #{currentStageIdx + 1}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-amber-200 font-serif">
                {stage.locationTitle}
              </h3>
            </div>
          </div>

          {/* SVG Animated Alchemist Retorts & Flasks */}
          <div className="hidden sm:flex items-center gap-3 select-none">
            {/* Glowing Violet Retort */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center text-lg shadow-lg shadow-purple-500/30">
                🧪
              </div>
              <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
            </div>
            {/* Glowing Emerald Elixir */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-lg shadow-lg shadow-emerald-500/30">
                🔮
              </div>
            </div>
            {/* Blue Gas Flame */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/30">
                🔥
              </div>
            </div>
          </div>
        </div>

        {/* Stage 1: Misty Marshland Photo Evidence */}
        {stage.id === 1 && (
          <div className="mb-6 rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-slate-950 shadow-2xl">
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-900 group">
              <img
                src={ASSETS.marshlandPhoto}
                alt="A ködös lápvidék és a felszálló mocsárgáz buborékok fotója"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-950/90 border border-purple-400 text-purple-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-purple-300" />
                  <span>Ködös lápvidék és mocsárgáz fotó</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>CH₄ (metán) buborékgyűrűk a vízben</span>
                </span>
              </div>

              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 border border-purple-400 text-purple-100 text-xs font-medium backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Kivetítő nagyítás</span>
              </button>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-slate-950/90 to-purple-950/80 border-t border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
              <span className="text-base select-none mt-0.5">🌫️</span>
              <p className="leading-relaxed font-serif">
                <strong className="text-amber-300">Természeti megfigyelés a fotón:</strong> A hűvös, hajnali ködben a láp állóvizének felszínére sűrű buborékok törnek fel a mélyből. Az iszapban anaerob cellulózbontó baktériumok termelik a <strong>metánt (CH₄, mocsárgáz / palus-gáz)</strong>, és nyomokban a szobahőmérsékleten öngyulladó <strong>difoszfánt (P₂H₄)</strong>, amely spontán kék lidércfényként villan fel az éjszakában.
              </p>
            </div>
          </div>
        )}

        {/* Incident Summary Storybook Scroll */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-600/30 mb-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-serif">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>A Krónika feljegyzése:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-900/50 border border-amber-600 text-amber-200 text-[11px] font-serif">
              📜 Ősi tekercs
            </span>
          </div>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-serif italic mb-4">
            „{stage.incidentReport}”
          </p>

          <div className="pt-3 border-t border-amber-700/30">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300/80 block mb-2 font-serif">
              Feltárt mágikus és kémiai bizonyítékok:
            </span>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {stage.evidenceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-700/50 text-xs text-purple-200 flex items-start gap-2 shadow-inner"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deduction Question */}
        <div className="mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-1.5 block">
            {stage.lessonConcept}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {stage.question}
          </h3>
        </div>

        {/* Shuffled Hypotheses */}
        <div className="space-y-3 mb-6">
          {stage.hypotheses.map((hyp, idx) => {
            const isSelected = selectedHypothesisId === hyp.id;
            let cardStyles = 'bg-slate-800/70 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-200';

            if (isSelected) {
              if (isExamined) {
                cardStyles = hyp.isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md';
              } else {
                cardStyles = 'bg-amber-600/20 border-amber-500 text-white shadow-sm';
              }
            }

            return (
              <button
                key={hyp.id}
                onClick={() => handleSelectHypothesis(hyp.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${cardStyles}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? isExamined
                        ? hyp.isCorrect
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'bg-rose-500 border-rose-400 text-white'
                        : 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-sm sm:text-base leading-relaxed">{hyp.text}</span>
              </button>
            );
          })}
        </div>

        {/* Analysis Result Banner */}
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
              <p className="font-semibold mb-1">
                {feedback.isCorrect ? 'Bizonyíték igazolva!' : 'Téves hipotézis!'}
              </p>
              <p>{feedback.text}</p>
              {!feedback.isCorrect && (
                <p className="mt-2 text-xs text-amber-300 font-medium bg-amber-950/40 p-2 rounded-lg border border-amber-600/30">
                  🔍 Nyomozati segítség: {stage.educationalClue}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {stage.locationTitle} · Szakmai következtetés
          </div>

          <div className="flex items-center gap-3">
            {(!isExamined || !feedback?.isCorrect) && (
              <button
                disabled={!selectedHypothesisId}
                onClick={handleTestEvidence}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-950/40 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Hipotézis ellenőrzése</span>
              </button>
            )}

            {isExamined && feedback?.isCorrect && (
              <button
                onClick={handleNextStage}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>
                  {currentStageIdx + 1 === shuffledStages.length
                    ? 'Ügy lezárása és végső jegyzőkönyv'
                    : 'Következő helyszín vizsgálata'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Marshland Photo Lightbox / Projector Fullscreen Modal */}
      {isPhotoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 border-2 border-purple-500/60 rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-purple-950/80 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                    Ködös Lápvidék és Mocsárgáz – Valós Természeti Fotó
                  </h3>
                  <span className="text-xs text-purple-300 font-mono">
                    Anaerob cellulózbontás · Metán (CH₄) képződés és lidércfény
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <img
                src={ASSETS.marshlandPhoto}
                alt="Ködös lápvidék kiterjesztett fotó"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-purple-500/40 text-xs sm:text-sm text-purple-100 flex items-start gap-3">
                <span className="text-xl shrink-0">🔬</span>
                <div>
                  <strong className="text-amber-300 font-serif">Kémiai tananyag összefüggés:</strong>
                  <p className="mt-1 leading-relaxed">
                    A lápvidékek sekély, oxigénmentes vizeiben anaerob mikroorganizmusok bontják le az elpusztult növények cellulóztartalmát. A keletkező gáz zöme <strong>metán (CH₄)</strong>, amely a víz alól buborékok formájában tör fel. A gázkeverékben nyomokban lévő <strong>difoszfán (P₂H₄)</strong> a hűvös levegő oxigénjével érintkezve szobahőmérsékleten azonnal öngyullad, ami meggyújtja a metángázt is – ez a természetben megfigyelhető <em>mocsári lidércfény</em> (palus-gáz).
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800">
              <span>Vetítési nézet az osztálytermi interaktív táblára</span>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors cursor-pointer"
              >
                Vissza a nyomozáshoz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
