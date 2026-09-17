import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface VictorianDetective2DProps {
  remainingCount: number;
  lastFoundName?: string | null;
  onAskHolmesHint: () => void;
  hintsAvailable: number;
}

export const VictorianDetective2D: React.FC<VictorianDetective2DProps> = ({
  remainingCount,
  lastFoundName,
  onAskHolmesHint,
  hintsAvailable,
}) => {
  const [speechBubble, setSpeechBubble] = useState<string>(
    'Осмотрите погреб, коллега. Мельчайшая деталь выдаст тайну.'
  );
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const autoHideTimeoutRef = useRef<number | null>(null);

  // Helper to trigger speech with auto-hide
  const triggerSpeech = (text: string) => {
    setSpeechBubble(text);
    setIsExpanded(true);
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    // Auto-collapse after 5 seconds so it doesn't obstruct view
    autoHideTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
  };

  // Initial auto-hide
  useEffect(() => {
    autoHideTimeoutRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 4500);
    return () => {
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    };
  }, []);

  // Natural Blinking loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update speech when items found
  useEffect(() => {
    if (lastFoundName) {
      const compliments = [
        `«${lastFoundName}» у нас! Метод дедукции работает.`,
        `Отлично! «${lastFoundName}» была искусно спрятана.`,
        `Верно! «${lastFoundName}» приближает нас к разгадке.`,
        `Браво, коллега! Доктор Ватсон запишет это в хроники.`,
      ];
      triggerSpeech(compliments[Math.floor(Math.random() * compliments.length)]);
    }
  }, [lastFoundName]);

  const handleHolmesClick = () => {
    soundEngine.playItemFoundBell();
    if (remainingCount <= 0) {
      triggerSpeech('Дело раскрыто! Все улики задокументированы.');
      return;
    }

    const tips = [
      'Проверьте медные трубы под потолком — там прячут металл.',
      'У пыльных винных полок справа мерцают цепочки и украшения.',
      'Около чугунной печи тепло, там брошена важная улика!',
      'Если дедукция зашла в тупик — нажмите кнопку подсказки!',
    ];
    triggerSpeech(tips[Math.floor(Math.random() * tips.length)]);
  };

  return (
    <div className="absolute bottom-2 left-2 z-30 select-none flex flex-col items-start pointer-events-auto">
      
      {/* Holmes Speech Bubble - Compact & Non-Obstructive */}
      {isExpanded && (
        <div className="relative mb-1.5 max-w-[190px] sm:max-w-[220px] p-2 rounded-xl bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fcd34d] border border-amber-900 shadow-[0_4px_14px_rgba(0,0,0,0.85)] text-stone-950 text-[10.5px] font-serif leading-snug animate-in fade-in slide-in-from-bottom-2">
          
          {/* Header with Title and Close Button */}
          <div className="flex items-center justify-between font-bold text-[9px] text-amber-950 uppercase tracking-wider mb-1 border-b border-amber-900/30 pb-0.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-800" />
              Шерлок Холмс
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-amber-900 text-[8.5px]">{remainingCount} ост.</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-amber-800/20 text-stone-800 hover:text-stone-950 cursor-pointer"
                title="Скрыть совет"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          <p className="italic text-stone-900 drop-shadow-xs font-medium line-clamp-3">
            "{speechBubble}"
          </p>

          {/* Speech bubble pointer arrow */}
          <div className="absolute -bottom-1.5 left-5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#fcd34d]" />
        </div>
      )}

      {/* 2D Animated Sherlock Character Avatar / Model */}
      <div 
        onClick={handleHolmesClick}
        className="group relative flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title="Нажмите на Шерлока Холмса для совета"
      >
        <div className="relative w-12 h-15 sm:w-14 sm:h-18 rounded-xl bg-gradient-to-b from-stone-900 via-[#221710] to-[#120a06] border border-amber-500/80 shadow-[0_3px_12px_rgba(0,0,0,0.9)] p-0.5 flex items-center justify-center overflow-hidden">
          
          {/* Vector 2D Sherlock Bust SVG Model */}
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="tweedCoat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c0e06" />
              </linearGradient>
              <linearGradient id="deerstalker" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="50%" stopColor="#713f12" />
                <stop offset="100%" stopColor="#422006" />
              </linearGradient>
            </defs>

            {/* Tweed Inverness Cape / Shoulders */}
            <path d="M 10 120 C 10 85 25 75 50 75 C 75 75 90 85 90 120 Z" fill="url(#tweedCoat)" stroke="#291408" strokeWidth="2" />
            <path d="M 30 75 L 50 95 L 70 75" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" fill="none" />
            
            {/* Stiff White Collar & Black Cravat */}
            <polygon points="42,72 50,82 58,72 50,70" fill="#f8fafc" />
            <polygon points="46,80 50,92 54,80" fill="#09090b" />

            {/* Face & Strong Jawline */}
            <path d="M 32 40 C 32 25 68 25 68 40 C 68 62 55 68 50 68 C 45 68 32 62 32 40 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            {/* Cheekbone shade */}
            <path d="M 40 46 Q 44 54 48 56" stroke="#fdba74" strokeWidth="1" fill="none" />

            {/* Eyes (Animated Blinking) */}
            {isBlinking ? (
              <>
                <line x1="39" y1="42" x2="45" y2="42" stroke="#451a03" strokeWidth="1.5" />
                <line x1="55" y1="42" x2="61" y2="42" stroke="#451a03" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <ellipse cx="42" cy="42" rx="2.5" ry="1.8" fill="#ffffff" />
                <circle cx="43" cy="42" r="1.2" fill="#1e3a8a" />
                <ellipse cx="58" cy="42" rx="2.5" ry="1.8" fill="#ffffff" />
                <circle cx="57" cy="42" r="1.2" fill="#1e3a8a" />
              </>
            )}

            {/* Eyebrows */}
            <path d="M 38 38 Q 42 36 46 39" stroke="#451a03" strokeWidth="1.2" fill="none" />
            <path d="M 54 39 Q 58 36 62 38" stroke="#451a03" strokeWidth="1.2" fill="none" />

            {/* Aquiline Detective Nose */}
            <path d="M 50 38 L 52 48 L 47 50" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Deerstalker Hat with Double Visors & Earflaps */}
            {/* Front Peak Visor */}
            <path d="M 22 36 Q 50 28 78 36" stroke="#422006" strokeWidth="3" fill="none" />
            {/* Hat Crown */}
            <path d="M 26 34 C 26 12 74 12 74 34 Z" fill="url(#deerstalker)" stroke="#422006" strokeWidth="1.5" />
            {/* Plaid Pattern lines */}
            <line x1="36" y1="18" x2="36" y2="34" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="14" x2="50" y2="34" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="64" y1="18" x2="64" y2="34" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
            {/* Tied Earflap Ribbon */}
            <ellipse cx="50" cy="14" rx="4" ry="2" fill="#422006" />

            {/* Calabash Meerschaum Pipe with Curling Smoke */}
            <g transform="translate(48, 54)">
              {/* Curved Stem */}
              <path d="M 0 0 Q 12 4 18 14" stroke="#f59e0b" strokeWidth="2" fill="none" />
              {/* Briar Bowl */}
              <path d="M 16 10 C 16 20 28 20 28 12 L 26 8 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
              <ellipse cx="22" cy="8" rx="4" ry="1.5" fill="#f97316" />
              {/* Dynamic Curling Smoke */}
              <path d="M 22 6 Q 26 0 20 -6 Q 28 -12 24 -18" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
            </g>
          </svg>

          {/* Mini Hint Badge on Holmes */}
          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[8px] flex items-center justify-center border border-amber-200 shadow">
            ?
          </div>
        </div>

        {/* Toggle Speech Bubble Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1 rounded-md bg-stone-900/90 hover:bg-stone-800 border border-amber-600/60 text-amber-300 text-xs shadow-md transition-colors cursor-pointer"
          title={isExpanded ? 'Скрыть совет' : 'Показать совет'}
        >
          <MessageSquare className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
