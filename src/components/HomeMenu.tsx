import React from 'react';
import { Compass, Layers, Search, FileQuestion, Flame, Clock, Award, Sparkles, Play, ChevronRight, GraduationCap } from 'lucide-react';
import { GameId, GameMetadata } from '../types';
import { sound } from '../utils/sound';

export const GAMES_CATALOG: GameMetadata[] = [
  {
    id: 'treasure-hunt',
    title: 'Alkán Kincses Sziget',
    gameType: '1. Kincskeresés a kémiai szigeten',
    pdfTitle: 'Alkánok 1. óra – Bevezetés, homológ sor, általános képlet',
    lessonNumber: 1,
    durationMinutes: 5,
    shortDescription: 'Járd be a karibi Alkán Kincses Sziget ösvényét a Kalózöböltől az Arany Kincsesládáig! CₙH₂ₙ₊₂ képlet, homológ sor differencia és tömegszázalék.',
    learningFocus: [
      'Általános képlet: CₙH₂ₙ₊₂ és M = 14n + 2 g/mol',
      'Homológ differencia: –CH₂– (14 g/mol)',
      'Metán, PB-gáz és szilárd paraffin (C₁₈+) tulajdonságai',
      'Propán szén- és hidrogén-tömegszázaléka (81,8% C)',
    ],
    themeColor: 'from-emerald-500/20 to-teal-900/30 border-emerald-500/40 text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    id: 'chemical-domino',
    title: 'Alkán Dominóasztal',
    gameType: '2. Kémiai dominó (Zöld posztó & Csontdominók)',
    pdfTitle: 'Alkánok 2. óra – Szerkezet, izoméria és fizikai tulajdonságok',
    lessonNumber: 2,
    durationMinutes: 5,
    shortDescription: 'Játssz igazi rézszegecses csontdominókkal a zöld posztó asztalon! Kapcsold össze az sp³ szerkezetet, izomereket és forráspontokat a fa tartósínről.',
    learningFocus: [
      'sp³ hibridállapot, tetraéderes forma és 109°28\' szög',
      'C–C kötéshossz (1,54 Å) és szabad forgás a σ-kötés körül',
      'Láncizomérek és elágazás hatása a forráspontra (n-pentán vs. izopentán)',
      'IUPAC nevezéktan és alkilgyökök (metil, etil, propil, izopropil)',
    ],
    themeColor: 'from-blue-500/20 to-indigo-900/30 border-blue-500/40 text-blue-400',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    badgeBorder: 'border-blue-500/30',
  },
  {
    id: 'lab-mystery',
    title: 'A Varázslatos Labor Rejtélye',
    gameType: '3. Mesebeli alkimista rejtély',
    pdfTitle: 'A metán kémiai feldolgozása (Kemizálás)',
    lessonNumber: 4,
    durationMinutes: 5,
    shortDescription: 'Mesebeli alkimista krónika és varázslatos elixírek: fejtsd meg a mocsári kék lidércfényt, a bányai sújtólég robbanását és az Andrussow-titkot!',
    learningFocus: [
      'Mocsárgáz lidércfény: anaerob baktériumok + difoszfán öngyulladás',
      'Bányabeli sújtólég robbanóelegye (5–15 tf%) és Davy-lámpa',
      'Gőzös reformálás: CH₄ + H₂O ⇌ CO + 3 H₂ (szintézisgáz, Ni, 800–900 °C)',
      'Andrussow-eljárás (HCN) és 1600 °C-os pirolízis (acetilén + aktív korom)',
    ],
    themeColor: 'from-purple-500/20 to-indigo-900/30 border-purple-500/40 text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    badgeBorder: 'border-purple-500/30',
  },
  {
    id: 'error-hunter',
    title: 'A Kémiai Laboratórium Auditja',
    gameType: '4. Igazi laboratóriumi hibavadászat',
    pdfTitle: 'Az alkánok kémiai tulajdonságai',
    lessonNumber: 3,
    durationMinutes: 5,
    shortDescription: 'Igazi kémia laboratórium reagens polccal, Bunsen-égővel és vizsgáló vágólappal! Találd meg a hibákat a jegyzőkönyvben és állítsd helyre a kémiát.',
    learningFocus: [
      'Szubsztitúció (fény/hő kell, jód nem megy, fluor robban)',
      'Hőbontás: 650 °C alatt krakkolás (C–C), 650 °C felett dehidrogénezés (C–H)',
      'Costin D. Nenițescu román kémikus: izomerizációhoz nyomnyi víz elengedhetetlen',
      'Oktánszám skála: izooktán = 100, n-heptán = 0',
    ],
    themeColor: 'from-rose-500/20 to-pink-900/30 border-rose-500/40 text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    badgeBorder: 'border-rose-500/30',
  },
  {
    id: 'refinery-mission',
    title: 'Ipari Finomító Vezérlőközpont',
    gameType: '5. Kémiai küldetés időre (Nehézipar)',
    pdfTitle: 'Alkánok a gyakorlatban – Kőolajfrakciók és üzemanyagok',
    lessonNumber: 5,
    durationMinutes: 5,
    shortDescription: 'Nehézipari finomító vezérlőterem acéllemezekkel és manométerekkel: állítsd be a lepárló tornyot, vívd meg az Otto vs. Dízel párbajt és számolj sztöchiometriát!',
    learningFocus: [
      'Kőolajfrakciók szénatomszám szerint (Földgáztól a Bitumenig)',
      'Otto-motor (kopogásgátlás, oktánszám) vs. Dízel (öngyulladás, cétszám)',
      'Kerozin Jet A-1 és EU ReFuelEU SAF kvóták (2% 2025-től, 70% 2050-re)',
      'n-hexán idegméreg kockázata és rovarok viaszos kutikulája',
    ],
    themeColor: 'from-amber-500/20 to-zinc-900/40 border-amber-500/40 text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    badgeBorder: 'border-amber-500/30',
  },
];

interface HomeMenuProps {
  onSelectGame: (gameId: GameId) => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({ onSelectGame }) => {
  const getGameIcon = (id: GameId) => {
    switch (id) {
      case 'treasure-hunt':
        return <Compass className="w-6 h-6 text-emerald-400" />;
      case 'chemical-domino':
        return <Layers className="w-6 h-6 text-blue-400" />;
      case 'lab-mystery':
        return <Search className="w-6 h-6 text-amber-400" />;
      case 'error-hunter':
        return <FileQuestion className="w-6 h-6 text-rose-400" />;
      case 'refinery-mission':
        return <Flame className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Banner for Classroom Projection */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-4">
          <GraduationCap className="w-4 h-4" />
          <span>Romániai Líceumi Szerves Kémia Tananyag · Tanóra végi összefoglalók</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance leading-tight mb-4">
          Alkánok Kémiai Játékbirodalom
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Öt különleges, 5–6 perces interaktív játék a tanóra végi élményszerű ismétléshez. Válassz leckét a kivetítőn, hívj ki egy önkéntes diákot a tanári géphez, és értékeld a teljesítményét plusz jeggyel!
        </p>

        {/* Teacher's quick guide metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>5–6 perc játékonként</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Külön célbaérés és 10-es érdemjegy skála</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>100% tankönyvhű, szakmai tartalom</span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES_CATALOG.map((game, index) => (
          <div
            key={game.id}
            className={`group flex flex-col justify-between rounded-2xl bg-gradient-to-b ${game.themeColor} border p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.01]`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
                  {getGameIcon(game.id)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${game.badgeBg}`}>
                    {game.gameType.split('.')[0]}. JÁTÉK
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" /> ~{game.durationMinutes} perc
                  </span>
                </div>
              </div>

              {/* Title and Lesson Reference */}
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5 leading-snug">
                {game.title}
              </h2>
              <div className="text-xs font-semibold text-emerald-400/90 mb-3 flex items-center gap-1.5">
                <span>Lecke {game.lessonNumber}:</span>
                <span className="text-slate-300 font-normal">{game.pdfTitle}</span>
              </div>

              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                {game.shortDescription}
              </p>

              {/* Learning Focus Checklist */}
              <div className="pt-3 border-t border-slate-800/80 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Kiemelt tananyagpontok:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {game.learningFocus.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => {
                sound.playClick();
                onSelectGame(game.id);
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-emerald-600 text-white font-semibold text-sm transition-all border border-slate-700 hover:border-emerald-500 shadow-md flex items-center justify-center gap-2 group-hover:shadow-emerald-950/40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Játék Indítása ({game.durationMinutes} perc)</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}

        {/* Info card for the Teacher */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">
              <GraduationCap className="w-5 h-5" />
              <span>Módszertani Segédlet Tanároknak</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Hogyan használd az óra utolsó 5 percében?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              A játékok célja nem a feleltetés miatti stressz, hanem a közös, pozitív osztályélmény:
            </p>
            <ul className="space-y-2 text-xs text-slate-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">1.</span>
                <span>Vetítsd ki a játékot és kérj egy önként jelentkezőt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">2.</span>
                <span>Az osztály közösen figyel, de a diák kattint és dönt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">3.</span>
                <span>A játék végi összefoglaló alapján azonnal adhatsz plusz jegyet vagy piros pontot.</span>
              </li>
            </ul>
          </div>
          <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            Készült a romániai líceumi szerves kémia tankönyvi követelményeknek és az 5 feltöltött bemutatónak megfelelően.
          </div>
        </div>
      </div>
    </div>
  );
};
