import React, { useEffect } from 'react';
import { Search, Play, FolderArchive, Settings, FileCode2, Sparkles, Music } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
  onOpenAndroidCode: () => void;
  hasSavedGame: boolean;
  completedCount: number;
  totalCount: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onOpenArchive,
  onOpenSettings,
  onOpenAndroidCode,
  hasSavedGame,
  completedCount,
  totalCount,
}) => {
  // Start atmospheric rain and noir theme
  useEffect(() => {
    soundEngine.startRainAmbience();
  }, []);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col items-center justify-between p-6 sm:p-10 overflow-hidden bg-slate-950 text-amber-50 select-none">
      {/* City Panorama Background with Glowing Windows & Streetlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient with deep evening twilight */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#0f172a] to-[#1e1b4b]/60" />

        {/* Distant skyline buildings with glowing yellow windows */}
        <svg
          className="absolute bottom-0 w-full h-72 sm:h-96 opacity-40 object-cover"
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
            {/* Street lamp 1 */}
            <line x1="200" y1="280" x2="200" y2="400" stroke="#475569" strokeWidth="4" />
            <circle cx="200" cy="280" r="6" fill="#fde047" />
            <polygon points="170,400 230,400 200,280" fill="#fef08a" opacity="0.12" />

            {/* Street lamp 2 */}
            <line x1="800" y1="290" x2="800" y2="400" stroke="#475569" strokeWidth="4" />
            <circle cx="800" cy="290" r="6" fill="#fde047" />
            <polygon points="770,400 830,400 800,290" fill="#fef08a" opacity="0.12" />
          </g>
        </svg>

        {/* Rain particles */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-200 to-transparent"
              style={{
                left: `${(i * 2.3) % 100}%`,
                top: `${(i * 7) % 100}%`,
                height: `${25 + (i % 20)}px`,
                transform: 'rotate(15deg)',
                animation: `pulse ${1.5 + (i % 3) * 0.4}s infinite ease-in-out`,
                opacity: 0.3 + (i % 5) * 0.12,
              }}
            />
          ))}
        </div>

        {/* Rolling fog layer */}
        <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* Music ambience prompt badge */}
      <div className="relative z-10 w-full flex items-center justify-between max-w-xl">
        <button
          onClick={() => {
            soundEngine.startNoirMusic();
            soundEngine.startRainAmbience();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-xs text-amber-200 backdrop-blur-sm transition-colors shadow-lg cursor-pointer"
          title="Включить нуар-саундтрек и шум дождя"
        >
          <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Включить нуар-джаз</span>
        </button>

        <div className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
          Раскрыто дел: <span className="text-amber-300 font-bold">{completedCount}/{totalCount}</span>
        </div>
      </div>

      {/* Centerpiece: Title & Animated Silhouette */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2 sm:mt-6 max-w-lg">
        {/* Animated Detective Silhouette */}
        <div className="relative w-44 h-48 sm:w-52 sm:h-56 mb-2 flex items-center justify-center">
          {/* Subtle back illumination glow */}
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/20 filter blur-2xl animate-pulse" />

          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {/* Victorian Street Lamp Aura Behind Sherlock */}
            <circle cx="100" cy="90" r="70" fill="url(#lamp-glow)" opacity="0.4" />
            <defs>
              <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Silhouette: Coat & Shoulders */}
            <path
              d="M 30 220 C 45 155 75 145 100 145 C 125 145 155 155 170 220 Z"
              fill="#090d16"
            />
            {/* Turned-up collar */}
            <polygon points="72,148 100,165 78,122" fill="#0f172a" />
            <polygon points="128,148 100,165 122,122" fill="#0f172a" />

            {/* Neck & Profile Head */}
            <path
              d="M 90 90 C 85 110 115 110 110 90 Z"
              fill="#090d16"
            />
            {/* Classic Deerstalker Hat with front & rear peaks and tied ear-flaps */}
            <ellipse cx="100" cy="74" rx="34" ry="14" fill="#090d16" />
            <path
              d="M 66 74 C 66 45 134 45 134 74 Z"
              fill="#090d16"
            />
            {/* Front visor bill */}
            <path d="M 64 74 Q 50 78 45 84 Q 70 82 82 76 Z" fill="#04070e" />
            {/* Rear neck flap */}
            <path d="M 136 74 Q 150 78 155 84 Q 130 82 118 76 Z" fill="#04070e" />
            {/* Top bow tie */}
            <circle cx="100" cy="46" r="3" fill="#1e293b" />

            {/* Characteristic Sherlock Curved Calabash Pipe */}
            <path
              d="M 85 108 Q 70 116 64 105 Q 60 92 56 94"
              stroke="#04070e"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 52 92 L 60 92 L 58 102 L 50 102 Z" fill="#b45309" />
            {/* Gentle Pipe Smoke Trail */}
            <path
              d="M 54 88 Q 50 75 58 65 T 52 45"
              stroke="#fef3c7"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
              strokeDasharray="2,2"
              className="animate-pulse"
            />

            {/* Magnifying Glass Glint in hand */}
            <circle cx="140" cy="165" r="16" stroke="#f59e0b" strokeWidth="2.5" fill="#38bdf8" fillOpacity="0.15" />
            <line x1="152" y1="177" x2="168" y2="198" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
            <circle cx="136" cy="160" r="3" fill="#ffffff" opacity="0.7" />
          </svg>
        </div>

        {/* Elegant Golden Title */}
        <div className="flex items-center gap-2 sm:gap-3 mb-1">
          <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]" />
          <h1 className="text-3xl sm:text-5xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase">
            Шерлок Холмс
          </h1>
        </div>

        <p className="text-amber-200/80 text-xs sm:text-sm tracking-widest font-medium uppercase mt-1">
          Частный сыщик и бюро находок
        </p>

        <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-3" />
      </div>

      {/* Main Navigation Menu Buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs mb-4">
        {/* Continue Button (if existing game) */}
        {hasSavedGame && (
          <button
            onClick={() => {
              soundEngine.playClick();
              soundEngine.startNoirMusic();
              onContinue();
            }}
            id="menu-btn-continue"
            className="group w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(217,119,6,0.4)] border border-amber-400 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>ПРОДОЛЖИТЬ ДЕЛО</span>
          </button>
        )}

        {/* New Case Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            soundEngine.startNoirMusic();
            onNewGame();
          }}
          id="menu-btn-new-case"
          className={`group w-full py-3 px-6 rounded-xl ${
            hasSavedGame
              ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-200 border border-amber-500/40'
              : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-[0_4px_20px_rgba(217,119,6,0.4)] border border-amber-400'
          } tracking-wider text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>НОВОЕ ДЕЛО (КАРТА ГОРОДА)</span>
        </button>

        {/* Case Archive */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenArchive();
          }}
          id="menu-btn-archive"
          className="w-full py-2.5 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-amber-100/90 border border-slate-700/80 hover:border-amber-500/40 tracking-wider text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
        >
          <FolderArchive className="w-4 h-4 text-amber-400" />
          <span>АРХИВ ДЕЛ ({completedCount} раскрыто)</span>
        </button>

        {/* Settings & Save Slots */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          id="menu-btn-settings"
          className="w-full py-2.5 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:border-amber-500/40 tracking-wider text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>НАСТРОЙКИ И СОХРАНЕНИЯ</span>
        </button>

        {/* Android Kotlin Source Code & Studio Export */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAndroidCode();
          }}
          id="menu-btn-android-export"
          className="w-full py-2.5 px-6 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/50 tracking-wider text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
        >
          <FileCode2 className="w-4 h-4 text-emerald-400" />
          <span>ПРОЕКТ ANDROID (KOTLIN)</span>
        </button>
      </div>

      {/* Footer Tagline */}
      <div className="relative z-10 text-[11px] text-slate-400 tracking-wider text-center max-w-md">
        «Отбросьте всё невозможное; то, что останется, и будет ответом, каким бы невероятным он ни казался.»
      </div>
    </div>
  );
};
