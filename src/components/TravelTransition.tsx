import React, { useEffect, useState } from 'react';
import { CaseDefinition } from '../types';
import { getDistrictNameRu } from './CityMap';
import { soundEngine } from '../audio/soundEngine';
import { Navigation, MapPin, FastForward } from 'lucide-react';

interface TravelTransitionProps {
  currentCase: CaseDefinition;
  onComplete: () => void;
}

export const TravelTransition: React.FC<TravelTransitionProps> = ({
  currentCase,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3.2-second cinematic pan
    const startTime = Date.now();
    const duration = 3200;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-6 sm:p-10 bg-slate-950 text-amber-50 select-none overflow-hidden">
      {/* City Street Skyline & Streetlights Panning */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-[#0b1329] to-[#17122b]" />

        {/* Panning Buildings Background */}
        <div
          className="absolute bottom-16 left-0 flex w-[250%] h-64 transition-transform duration-100 ease-linear"
          style={{ transform: `translateX(-${progress * 0.45}%)` }}
        >
          {Array.from({ length: 18 }).map((_, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-36 sm:w-48 bg-[#090e1c] border-r border-slate-800/40 relative"
              style={{
                height: `${140 + ((idx * 37) % 110)}px`,
                marginTop: 'auto',
              }}
            >
              <div className="grid grid-cols-3 gap-2 p-3 opacity-60">
                {Array.from({ length: 8 }).map((_, wIdx) => (
                  <div
                    key={wIdx}
                    className={`h-4 rounded-sm ${
                      (idx + wIdx) % 3 === 0
                        ? 'bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : (idx + wIdx) % 5 === 0
                        ? 'bg-sky-400/60 shadow-[0_0_6px_rgba(56,189,248,0.4)]'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Moving Street Road */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-900 border-t-2 border-slate-700">
          <div
            className="w-[200%] h-1 border-b-2 border-dashed border-amber-400/70 mt-8"
            style={{ transform: `translateX(-${(progress * 4) % 50}%)` }}
          />
        </div>

        {/* Animated Vintage Black Detective Motorcar */}
        <div className="absolute bottom-8 left-1/4 sm:left-1/3 -translate-x-1/2 z-20">
          <svg viewBox="0 0 160 70" className="w-40 sm:w-48 h-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)]">
            <path
              d="M 10 50 Q 20 48 40 45 L 60 30 L 105 30 L 130 42 L 150 48 L 155 58 L 5 58 Z"
              fill="#090d16"
            />
            <polygon points="62,30 75,18 100,18 105,30" fill="#38bdf8" fillOpacity="0.4" stroke="#475569" strokeWidth="1.5" />
            <polygon points="148,46 220,30 220,68 152,52" fill="#fef08a" fillOpacity="0.25" />
            <circle cx="150" cy="49" r="4" fill="#fef08a" />
            <circle cx="35" cy="58" r="12" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <circle cx="35" cy="58" r="4" fill="#cbd5e1" />
            <circle cx="125" cy="58" r="12" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <circle cx="125" cy="58" r="4" fill="#cbd5e1" />
            <circle cx="5" cy="54" r="3" fill="#64748b" opacity="0.5" className="animate-ping" />
          </svg>
        </div>

        {/* Rain streaks */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] bg-cyan-200"
              style={{
                left: `${(i * 4) % 100}%`,
                top: `${(i * 12) % 100}%`,
                height: '35px',
                transform: 'rotate(25deg)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Transition Status */}
      <div className="relative z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 backdrop-blur-md">
          <Navigation className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs font-bold text-amber-200 tracking-wider uppercase">
            В пути: район «{getDistrictNameRu(currentCase.districtId)}»...
          </span>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onComplete();
          }}
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
        >
          <span>Пропустить</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Central Destination Arrival Card */}
      <div className="relative z-30 flex flex-col items-center text-center max-w-md mx-auto my-auto">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <MapPin className="w-6 h-6 text-amber-300 animate-bounce" />
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-amber-100 tracking-wide">
          {currentCase.client.locationName}
        </h2>
        <p className="text-xs sm:text-sm text-amber-300/80 mt-1">
          {currentCase.locationName}
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 rounded-full bg-slate-900 border border-slate-700 mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footnote */}
      <div className="relative z-30 text-center text-xs text-slate-400">
        Приближаемся к месту происшествия • Приготовьте инструменты сыщика
      </div>
    </div>
  );
};
