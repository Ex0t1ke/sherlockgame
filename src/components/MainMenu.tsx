import React, { useEffect } from 'react';
import { Search, Play, FolderArchive, Settings, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
  hasSavedGame: boolean;
  completedCount: number;
  totalCount: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onOpenArchive,
  onOpenSettings,
  hasSavedGame,
  completedCount,
  totalCount,
}) => {
  // Start atmospheric rain and noir theme
  useEffect(() => {
    soundEngine.startRainAmbience();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-slate-950 text-amber-50 select-none">
      {/* City Panorama Background with Glowing Windows & Streetlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient with deep evening twilight */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#0f172a] to-[#1e1b4b]/60" />

        {/* Distant skyline buildings with glowing yellow windows */}
        <svg
          className="absolute bottom-0 w-full h-48 sm:h-72 opacity-35 object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1000 400"
        >
          {/* Back layer buildings */}
          <rect x="20" y="80" width="80" height="320" fill="#020617" />
          <rect x="130" y="140" width="70" height="260" fill="#020617" />
          <rect x="240" y="60" width="90" height="340" fill="#020617" />
          <rect x="360" y="110" width="85" height="290" fill="#020617" />
          <rect x="480" y="40" width="110" height="360" fill="#020617" />
          <rect x="620" y="95" width="80" height="305" fill="#020617" />
          <rect x="730" y="150" width="90" height="250" fill="#020617" />
          <rect x="850" y="70" width="100" height="330" fill="#020617" />

          {/* Glowing Windows Grid */}
          <g fill="#fbbf24" opacity="0.6">
            <rect x="35" y="100" width="6" height="8" rx="1" />
            <rect x="55" y="100" width="6" height="8" rx="1" />
            <rect x="35" y="125" width="6" height="8" rx="1" />
            <rect x="75" y="125" width="6" height="8" rx="1" />
            <rect x="55" y="150" width="6" height="8" rx="1" />
            <rect x="260" y="90" width="7" height="10" rx="1" />
            <rect x="285" y="120" width="7" height="10" rx="1" />
            <rect x="260" y="160" width="7" height="10" rx="1" />
            <rect x="500" y="70" width="8" height="12" rx="1" />
            <rect x="530" y="100" width="8" height="12" rx="1" />
            <rect x="560" y="140" width="8" height="12" rx="1" />
            <rect x="640" y="120" width="6" height="8" rx="1" />
            <rect x="870" y="100" width="7" height="9" rx="1" />
            <rect x="910" y="140" width="7" height="9" rx="1" />
          </g>

          {/* Streetlights with golden glow cones */}
          <g>
            <line x1="200" y1="280" x2="200" y2="400" stroke="#475569" strokeWidth="4" />
            <circle cx="200" cy="280" r="6" fill="#fde047" />
            <polygon points="170,400 230,400 200,280" fill="#fef08a" opacity="0.12" />

            <line x1="800" y1="290" x2="800" y2="400" stroke="#475569" strokeWidth="4" />
            <circle cx="800" cy="290" r="6" fill="#fde047" />
            <polygon points="770,400 830,400 800,290" fill="#fef08a" opacity="0.12" />
          </g>
        </svg>

        {/* Rain particles */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-200 to-transparent"
              style={{
                left: `${(i * 3.3) % 100}%`,
                top: `${(i * 7) % 100}%`,
                height: `${20 + (i % 15)}px`,
                transform: 'rotate(15deg)',
                animation: `pulse ${1.5 + (i % 3) * 0.4}s infinite ease-in-out`,
                opacity: 0.25 + (i % 5) * 0.1,
              }}
            />
          ))}
        </div>

        {/* Rolling fog layer */}
        <div className="absolute -bottom-8 left-0 right-0 h-28 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* Split-View Landscape Main Menu Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8 items-center max-h-full">
        {/* Left Column: Visual Silhouette & Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3">
            {/* Animated Detective Silhouette */}
            <div className="relative w-20 h-24 sm:w-28 sm:h-32 shrink-0 flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-amber-500/20 filter blur-xl animate-pulse" />
              <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
                <circle cx="100" cy="90" r="70" fill="url(#lamp-glow-menu)" opacity="0.4" />
                <defs>
                  <radialGradient id="lamp-glow-menu" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Silhouette: Coat & Shoulders */}
                <path d="M 30 220 C 45 155 75 145 100 145 C 125 145 155 155 170 220 Z" fill="#090d16" />
                <polygon points="72,148 100,165 78,122" fill="#0f172a" />
                <polygon points="128,148 100,165 122,122" fill="#0f172a" />
                <path d="M 90 90 C 85 110 115 110 110 90 Z" fill="#090d16" />

                {/* Deerstalker Hat */}
                <ellipse cx="100" cy="74" rx="34" ry="14" fill="#090d16" />
                <path d="M 66 74 C 66 45 134 45 134 74 Z" fill="#090d16" />
                <path d="M 64 74 Q 50 78 45 84 Q 70 82 82 76 Z" fill="#04070e" />
                <path d="M 136 74 Q 150 78 155 84 Q 130 82 118 76 Z" fill="#04070e" />
                <circle cx="100" cy="46" r="3" fill="#1e293b" />

                {/* Pipe */}
                <path d="M 85 108 Q 70 116 64 105 Q 60 92 56 94" stroke="#04070e" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M 52 92 L 60 92 L 58 102 L 50 102 Z" fill="#b45309" />
                <path d="M 54 88 Q 50 75 58 65 T 52 45" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="2,2" className="animate-pulse" />

                {/* Magnifier */}
                <circle cx="140" cy="165" r="16" stroke="#f59e0b" strokeWidth="2.5" fill="#38bdf8" fillOpacity="0.15" />
                <line x1="152" y1="177" x2="168" y2="198" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
                <circle cx="136" cy="160" r="3" fill="#ffffff" opacity="0.7" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)]" />
                <h1 className="text-2xl sm:text-4xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase">
                  Шерлок Холмс
                </h1>
              </div>
              <p className="text-amber-200/80 text-[11px] sm:text-xs tracking-widest font-medium uppercase mt-0.5">
                Тайны викторианского Лондона
              </p>
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] sm:text-xs text-slate-300">
                Раскрыто дел: <span className="text-amber-300 font-bold">{completedCount}/{totalCount}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block h-[1px] w-full bg-gradient-to-r from-amber-500/40 via-amber-500/20 to-transparent my-3" />
          
          <p className="hidden md:block text-[11px] text-slate-400 italic max-w-sm">
            «Отбросьте всё невозможное; то, что останется, и будет ответом, каким бы невероятным он ни казался.»
          </p>
        </div>

        {/* Right Column: Sleek Landscape Action Buttons */}
        <div className="flex flex-col gap-2 w-full max-w-sm mx-auto md:mx-0">
          {hasSavedGame ? (
            <>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  soundEngine.startNoirMusic();
                  onContinue();
                }}
                id="menu-btn-continue"
                className="group w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.4)] border border-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>ПРОДОЛЖИТЬ ДЕЛО</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  soundEngine.startNoirMusic();
                  onNewGame();
                }}
                id="menu-btn-new-case"
                className="w-full py-2 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/40 tracking-wider text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>КАРТА ГОРОДА (ДЕЛА)</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                soundEngine.playClick();
                soundEngine.startNoirMusic();
                onNewGame();
              }}
              id="menu-btn-start"
              className="group w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(245,158,11,0.4)] border border-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>НАЧАТЬ РАССЛЕДОВАНИЕ</span>
            </button>
          )}

          {/* Secondary Row: Archive & Settings */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenArchive();
              }}
              id="menu-btn-archive"
              className="py-2 px-3 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 text-amber-100/90 border border-stone-700/80 hover:border-amber-500/40 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>АРХИВ ({completedCount})</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSettings();
              }}
              id="menu-btn-settings"
              className="py-2 px-3 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 text-stone-300 border border-stone-700/80 hover:border-amber-500/40 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>НАСТРОЙКИ</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 text-center tracking-wider mt-1">
            Бейкер-стрит, 221B • Лондон 1895
          </div>
        </div>
      </div>
    </div>
  );
};
