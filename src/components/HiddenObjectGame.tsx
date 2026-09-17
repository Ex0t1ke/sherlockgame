import React, { useState, useEffect, useRef } from 'react';
import { CaseDefinition } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { VictorianItemSvg } from './VictorianItemSvg';
import { 
  SteamBoilerModel, 
  VictorianStoveModel, 
  ApothecaryShelvesModel, 
  GothicArchwayModel, 
  WorkbenchModel, 
  AtmosphereDustMotes,
  VictorianCellarFloor,
  WallCandleSconceModel,
  LondonCratesModel,
  SecretWallSafeModel
} from './VictorianScenery2D';
import { ItemInspectorModal } from './ItemInspectorModal';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  Clock,
  Menu as MenuIcon,
  X,
  Play,
  HelpCircle,
  Smartphone,
  BookOpen
} from 'lucide-react';

interface HiddenObjectGameProps {
  currentCase: CaseDefinition;
  hintsAvailable: number;
  onUseHint: () => void;
  onFoundItem: (stats: { timeSeconds: number; wrongClicks: number; hintsUsedThisCase: number; finalScore?: number }) => void;
  onReturnToMap?: () => void;
}

// Item definition on the scene
interface SceneItem {
  id: string;
  name: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  svgType: string;
  rotation?: number;
  found: boolean;
  isSpecialTarget?: boolean;
  isEasterEgg?: boolean;
  hiddenBehind?: 'curtain' | 'stove' | 'crate' | 'picture';
  storyHint: string;
}

export const HiddenObjectGame: React.FC<HiddenObjectGameProps> = ({
  currentCase,
  hintsAvailable,
  onUseHint,
  onFoundItem,
  onReturnToMap,
}) => {
  // Timer: starts around 07:23 (443 seconds) like in the reference
  const [secondsRemaining, setSecondsRemaining] = useState<number>(443);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [score, setScore] = useState<number>(11400);
  const [wrongClicks, setWrongClicks] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isMuted());

  // In-Game Pause Menu Modal
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Floating feedback & misclick handling
  const [floatingScore, setFloatingScore] = useState<{ x: number; y: number; text: string; id: number } | null>(null);
  const [hintedItemId, setHintedItemId] = useState<string | null>(null);
  const [misclickWarning, setMisclickWarning] = useState<string | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isMisclickBlocked, setIsMisclickBlocked] = useState<boolean>(false);
  const recentMissClicks = useRef<number[]>([]);

  // 2D Model inspection & Detective Companion State
  const [inspectingItem, setInspectingItem] = useState<{ type: string; name: string } | null>(null);

  // Interactive "Masyanya-style" Environment Obstacles & Secret Cache States
  const [isCurtainOpen, setIsCurtainOpen] = useState<boolean>(false);
  const [isStoveDoorOpen, setIsStoveDoorOpen] = useState<boolean>(false);
  const [isCrateOpen, setIsCrateOpen] = useState<boolean>(false);
  const [isPictureMoved, setIsPictureMoved] = useState<boolean>(false);
  const [interactionNotice, setInteractionNotice] = useState<string | null>(null);

  // Sherlock Story Dialogue state
  const [sherlockSpeech, setSherlockSpeech] = useState<string>(
    `Ватсон, в этом погребе тайное убежище! Найдите «${currentCase.targetItem.name}» и все оставленные улики. Осмотрите тайники!`
  );

  // Landscape Orientation Detection
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissOrientationWarning, setDismissOrientationWarning] = useState<boolean>(false);

  const sceneContainerRef = useRef<HTMLDivElement>(null);

  // Check screen orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 800;
        setIsPortrait(portrait);
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Interaction handlers with procedural SFX and feedback
  const toggleCurtain = () => {
    soundEngine.playCurtainRustle();
    setIsCurtainOpen((prev) => {
      const next = !prev;
      if (next) {
        setSherlockSpeech('За бархатной портьерой на подоконнике обнаружилась дамская шляпа!');
        setInteractionNotice('Штора отодвинута! На подоконнике обнаружена улика!');
      } else {
        setInteractionNotice('Штора задернута.');
      }
      return next;
    });
  };

  const toggleStoveDoor = () => {
    soundEngine.playCreakOpen();
    setIsStoveDoorOpen((prev) => {
      const next = !prev;
      if (next) {
        setSherlockSpeech('В топке чугунной печи спрятаны стальные наручники! Извлеките их!');
        setInteractionNotice('Печь распахнута! В топке блестит металл!');
      } else {
        setInteractionNotice('Дверца печи закрыта.');
      }
      return next;
    });
  };

  const toggleCrate = () => {
    soundEngine.playWoodCrateOpen();
    setIsCrateOpen((prev) => {
      const next = !prev;
      if (next) {
        setSherlockSpeech('Крышка ящика поддалась! В соломе лежит заводной паровоз!');
        setInteractionNotice('Ящик открыт! В соломе видна посылка!');
      } else {
        setInteractionNotice('Ящик закрыт.');
      }
      return next;
    });
  };

  const togglePicture = () => {
    soundEngine.playSecretFound();
    setIsPictureMoved((prev) => {
      const next = !prev;
      if (next) {
        setSherlockSpeech('Тайный сейф за портретом королевы Виктории! Внутри лежит латунный ключ!');
        setInteractionNotice('Портрет сдвинут! Открылся тайный сейф!');
      } else {
        setInteractionNotice('Портрет возвращен на стену.');
      }
      return next;
    });
  };

  // Auto-dismiss interaction banner
  useEffect(() => {
    if (interactionNotice) {
      const timer = window.setTimeout(() => setInteractionNotice(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [interactionNotice]);

  // Exactly 8 distinct, clearly separated, non-overlapping items
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([
    // 1. Special Case Target (e.g. Золотые часы Артура or Королевский Сапфир)
    {
      id: 'case_target',
      name: currentCase.targetItem.name,
      category: 'case_target',
      x: 34,
      y: 71,
      width: 6.2,
      height: 6.2,
      svgType: currentCase.targetItem.id.includes('watch') ? 'pocket_watch' : 'sapphire',
      rotation: -10,
      found: false,
      isSpecialTarget: true,
      storyHint: 'Главная улика дела покоится на верстаке у лампы!'
    },
    // 2. Woman's Hat hidden behind velvet curtain
    {
      id: 'wh_1',
      name: 'Дамская шляпа',
      category: 'hat',
      x: 13.5,
      y: 40,
      width: 7.2,
      height: 5.6,
      svgType: 'womans_hat',
      rotation: -6,
      found: false,
      hiddenBehind: 'curtain',
      storyHint: 'Дамская шляпа скрыта за шторой готического окна слева.'
    },
    // 3. Handcuffs hidden in stove
    {
      id: 'hc_1',
      name: 'Шеффилдские наручники',
      category: 'handcuffs',
      x: 43.5,
      y: 75,
      width: 6.2,
      height: 5.5,
      svgType: 'handcuffs',
      rotation: 12,
      found: false,
      hiddenBehind: 'stove',
      storyHint: 'Стальные наручники брошены в топку чугунной печи.'
    },
    // 4. Toy Train hidden in London docks crate
    {
      id: 'tr_1',
      name: 'Заводной паровоз',
      category: 'train',
      x: 5.5,
      y: 81,
      width: 7.5,
      height: 5.2,
      svgType: 'train',
      rotation: -2,
      found: false,
      hiddenBehind: 'crate',
      storyHint: 'Старинный паровозик спрятан в деревянном ящике у входа.'
    },
    // 5. Brass Key hidden in wall safe behind Queen Victoria picture
    {
      id: 'ky_1',
      name: 'Латунный ключ',
      category: 'keys',
      x: 27.2,
      y: 53,
      width: 5.5,
      height: 4.5,
      svgType: 'key',
      rotation: 85,
      found: false,
      hiddenBehind: 'picture',
      storyHint: 'Ключ спрятан в тайном сейфе за портретом Ее Величества!'
    },
    // 6. Toy Soldier on the apothecary shelf
    {
      id: 'ts_1',
      name: 'Оловянный солдатик',
      category: 'soldier',
      x: 69,
      y: 44,
      width: 5.2,
      height: 7.5,
      svgType: 'toy_soldier',
      rotation: 0,
      found: false,
      storyHint: 'Оловянный солдатик стоит на второй полке шкафа с колбами.'
    },
    // 7. Pearl Necklace on the stone wall ledge
    {
      id: 'nc_1',
      name: 'Жемчужное ожерелье',
      category: 'necklace',
      x: 83,
      y: 67,
      width: 6.2,
      height: 6.2,
      svgType: 'necklace',
      rotation: 10,
      found: false,
      storyHint: 'Жемчужное ожерелье переливается на каменном выступе справа.'
    },
    // 8. Sherlock's Pipe on the mantelpiece table
    {
      id: 'sherlock_pipe',
      name: 'Трубка Шерлока',
      category: 'pipe',
      x: 56.5,
      y: 79,
      width: 5.5,
      height: 4.5,
      svgType: 'pipe',
      rotation: -14,
      found: false,
      isEasterEgg: true,
      storyHint: 'Моя трубка из вереска лежит на круглом столике справа!'
    }
  ]);

  // Main countdown timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Items status
  const foundCount = sceneItems.filter((it) => it.found).length;
  const totalCount = sceneItems.length;
  const allItemsFound = foundCount === totalCount;

  // Victory Handler
  useEffect(() => {
    if (allItemsFound) {
      soundEngine.playVictory();
      setSherlockSpeech('Браво, Ватсон! Все улики собраны, дело блестяще раскрыто!');
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }

      const timer = window.setTimeout(() => {
        onFoundItem({
          timeSeconds: elapsedSeconds,
          wrongClicks,
          hintsUsedThisCase: hintsUsedCount,
          finalScore: score,
        });
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [allItemsFound, elapsedSeconds, wrongClicks, hintsUsedCount, score, onFoundItem]);

  // Pointer position and drag panning for zoom
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Item Click Handler
  const handleItemClick = (item: SceneItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.found || isMisclickBlocked) return;

    soundEngine.playItemFoundBell();

    // Narrative deduction reaction from Sherlock Holmes
    if (item.isSpecialTarget) {
      setSherlockSpeech(`Великолепно! «${item.name}» найдена! Главная улика дела в наших руках!`);
    } else {
      const quotes = [
        `«${item.name}» у нас! Дедуктивный метод безупречен.`,
        `Отлично подмечено, Ватсон! «${item.name}» добавлена в досье.`,
        `Превосходно! «${item.name}» проливает свет на замысел преступника.`,
        `Точный глаз, коллега! «${item.name}» найдена.`,
      ];
      setSherlockSpeech(quotes[Math.floor(Math.random() * quotes.length)]);
    }

    // Mark item found
    setSceneItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, found: true } : it))
    );

    const pointGain = item.isSpecialTarget ? 2500 : 1200;
    setScore((s) => s + pointGain);

    // Floating score animation
    const rect = sceneContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const floatX = ((e.clientX - rect.left) / rect.width) * 100;
      const floatY = ((e.clientY - rect.top) / rect.height) * 100;
      setFloatingScore({
        x: floatX,
        y: floatY,
        text: `+${pointGain}`,
        id: Date.now(),
      });
      window.setTimeout(() => setFloatingScore(null), 1200);
    }

    if (hintedItemId === item.id) {
      setHintedItemId(null);
    }
  };

  // Background Misclick Handler
  const handleBackgroundClick = () => {
    if (isMisclickBlocked) return;

    soundEngine.playMisclickBuzz();
    setWrongClicks((w) => w + 1);

    const now = Date.now();
    recentMissClicks.current = [...recentMissClicks.current.filter((t) => now - t < 2500), now];

    if (recentMissClicks.current.length >= 3) {
      setIsScreenShaking(true);
      setIsMisclickBlocked(true);
      setSecondsRemaining((sec) => Math.max(0, sec - 10));
      setMisclickWarning('Штраф за суету! Ложный след: -10 секунд. Детектив, сохраняйте хладнокровие!');

      window.setTimeout(() => {
        setIsScreenShaking(false);
      }, 500);

      window.setTimeout(() => {
        setIsMisclickBlocked(false);
        setMisclickWarning(null);
        recentMissClicks.current = [];
      }, 2500);
    }
  };

  // Hint button handler
  const handleHintClick = () => {
    if (hintsAvailable <= 0) return;

    const unfound = sceneItems.filter((it) => !it.found);
    if (unfound.length === 0) return;

    onUseHint();
    setHintsUsedCount((h) => h + 1);
    soundEngine.playHintShimmer();

    const randomItem = unfound[Math.floor(Math.random() * unfound.length)];
    setHintedItemId(randomItem.id);

    // Contextual hint from Sherlock
    if (randomItem.hiddenBehind === 'curtain' && !isCurtainOpen) {
      setSherlockSpeech('Ватсон, улика скрыта за портьерой! Отодвиньте бархатную штору на окне!');
      setInteractionNotice('Шерлок: Улика за шторой! Отодвиньте бархатную портьеру!');
    } else if (randomItem.hiddenBehind === 'stove' && !isStoveDoorOpen) {
      setSherlockSpeech('Ватсон, проверьте печь! Распахните чугунную дверцу топки!');
      setInteractionNotice('Шерлок: Улика внутри печи! Распахните чугунную дверцу!');
    } else if (randomItem.hiddenBehind === 'crate' && !isCrateOpen) {
      setSherlockSpeech('Ватсон, улика в ящике! Откиньте крышку деревянного ящика слева!');
      setInteractionNotice('Шерлок: Улика в ящике! Откиньте дощатую крышку!');
    } else if (randomItem.hiddenBehind === 'picture' && !isPictureMoved) {
      setSherlockSpeech('Ватсон, обратите внимание на портрет королевы! За ним тайник!');
      setInteractionNotice('Шерлок: Тайник за портретом! Сдвиньте картину на стене!');
    } else {
      setSherlockSpeech(`Обратите внимание: «${randomItem.name}». ${randomItem.storyHint}`);
    }

    window.setTimeout(() => {
      setHintedItemId(null);
    }, 5000);
  };

  // Formatted Time MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className={`relative w-full h-full min-h-[500px] flex flex-col bg-[#0c0a09] text-amber-50 select-none overflow-hidden ${
      isScreenShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
    }`}>
      
      {/* ============================================================ */}
      {/* 1. TOP BAR (MASYANYA QUEST STYLE: CLEAN, PRECISE, NO CLUTTER)  */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full h-11 sm:h-12 bg-gradient-to-r from-[#141d26] via-[#1e293b] to-[#141d26] border-b-2 border-[#38bdf8]/40 shadow-[0_4px_16px_rgba(0,0,0,0.8)] px-2.5 sm:px-4 flex items-center justify-between">
        
        {/* Left: [ Меню ] Button (Classic Masyanya Beveled Cyan Button) */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsPauseMenuOpen(true);
          }}
          id="btn-game-menu"
          className="px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_2px_8px_rgba(2,132,199,0.5)] border border-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Открыть меню паузы"
        >
          <MenuIcon className="w-4 h-4 text-cyan-100" />
          <span>Меню</span>
        </button>

        {/* Center: Victorian Case Ribbon Header */}
        <div className="flex items-center gap-2 max-w-[60%] truncate">
          <div className="hidden sm:block w-3 h-3 rotate-45 bg-amber-400/80 border border-amber-200" />
          <h2 className="font-serif font-black text-xs sm:text-sm md:text-base tracking-wider text-amber-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate text-center">
            Уровень 1: {currentCase.title}
          </h2>
          <div className="hidden sm:block w-3 h-3 rotate-45 bg-amber-400/80 border border-amber-200" />
        </div>

        {/* Right: British Flag 🇬🇧 + Sound Mute + Timer Badge */}
        <div className="flex items-center gap-2">
          {/* Great Britain Flag Symbol */}
          <div 
            className="w-6 h-4 sm:w-7 sm:h-4.5 rounded-xs overflow-hidden border border-slate-400/50 shadow flex items-center justify-center bg-[#012169] select-none"
            title="Лондон, Великобритания"
          >
            <svg viewBox="0 0 60 30" className="w-full h-full">
              <clipPath id="s">
                <path d="M0,0 v30 h60 v-30 z"/>
              </clipPath>
              <clipPath id="t">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
              </clipPath>
              <g clipPath="url(#s)">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
              </g>
            </svg>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setIsMuted(muted);
            }}
            className="p-1 sm:p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-600 transition-colors cursor-pointer"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
          </button>

          {/* Timer Clock Badge */}
          <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-900/90 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs sm:text-sm flex items-center gap-1 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeFormatted}</span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN 2D SEARCH SCENE (FULL LANDSCAPE VIEWPORT)            */}
      {/* ============================================================ */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#100b07] flex flex-col">
        
        {/* Scene Container with Pointer Events */}
        <div
          ref={sceneContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleBackgroundClick}
          className={`relative flex-1 w-full h-full overflow-hidden touch-none select-none ${
            isMisclickBlocked ? 'cursor-not-allowed' : 'cursor-crosshair'
          }`}
        >
          {/* Zoom / Pan Canvas */}
          <div
            className="relative w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* Victorian Cellar Scenery 2D Models */}
            <div className="absolute inset-0 bg-[#140e0a]">
              {/* Stone wall relief */}
              <div className="absolute inset-0 bg-[radial-gradient(#2c1c12_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />
              <div className="absolute inset-0 bg-[radial-gradient(#3a2618_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />

              {/* Heavy ceiling beams */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#24130a] via-[#1a0e07] to-[#100804] border-b-4 border-[#3e1f10] shadow-[0_8px_25px_rgba(0,0,0,0.9)] flex items-center justify-around px-8 z-10 pointer-events-none">
                {[0.08, 0.25, 0.45, 0.65, 0.85, 0.95].map((pos, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-11 bg-[#110d0a] border border-stone-700 rounded-xs shadow-inner flex flex-col justify-between py-1 items-center"
                    style={{ position: 'absolute', left: `${pos * 100}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-stone-400 border border-stone-900 shadow" />
                    <div className="w-2 h-2 rounded-full bg-stone-400 border border-stone-900 shadow" />
                  </div>
                ))}
              </div>

              {/* 2D Scenery Components */}
              <GothicArchwayModel isCurtainOpen={isCurtainOpen} onToggleCurtain={toggleCurtain} />
              <WallCandleSconceModel />
              <SteamBoilerModel isValveTurned={false} onTurnValve={() => {}} />
              <VictorianStoveModel isDoorOpen={isStoveDoorOpen} onToggleDoor={toggleStoveDoor} />
              <ApothecaryShelvesModel />
              <LondonCratesModel isCrateOpen={isCrateOpen} onToggleCrate={toggleCrate} />
              <WorkbenchModel />
              <SecretWallSafeModel isPictureMoved={isPictureMoved} onTogglePicture={togglePicture} />
              <VictorianCellarFloor />
              <AtmosphereDustMotes />

              {/* Ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none z-20" />
              <div className="absolute bottom-16 left-[36%] w-80 h-64 bg-orange-600/18 rounded-full blur-3xl pointer-events-none z-20" />
              <div className="absolute top-28 left-28 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-20" />
            </div>

            {/* ======================================================== */}
            {/* 8 CLEAN, SPACED OUT, NON-OVERLAPPING CLUES              */}
            {/* ======================================================== */}
            {sceneItems.map((item) => {
              if (item.found) return null;

              const isHinted = hintedItemId === item.id;

              // Obstacle concealment check
              const isCovered = 
                (item.hiddenBehind === 'curtain' && !isCurtainOpen) ||
                (item.hiddenBehind === 'stove' && !isStoveDoorOpen) ||
                (item.hiddenBehind === 'crate' && !isCrateOpen) ||
                (item.hiddenBehind === 'picture' && !isPictureMoved);

              return (
                <div
                  key={item.id}
                  id={`scene-item-${item.id}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.width}%`,
                    height: `${item.height}%`,
                    transform: `rotate(${item.rotation || 0}deg)`,
                  }}
                  onClick={(e) => {
                    if (isCovered) {
                      e.stopPropagation();
                      soundEngine.playCreakOpen();
                      if (item.hiddenBehind === 'curtain') {
                        setInteractionNotice('Улика за шторой! Отодвиньте бархатную портьеру на окне!');
                      } else if (item.hiddenBehind === 'stove') {
                        setInteractionNotice('Улика внутри печи! Распахните дверцу топки!');
                      } else if (item.hiddenBehind === 'crate') {
                        setInteractionNotice('Улика в ящике! Откиньте дощатую крышку ящика!');
                      } else if (item.hiddenBehind === 'picture') {
                        setInteractionNotice('Улика в тайнике! Сдвиньте портрет на стене!');
                      }
                      return;
                    }
                    handleItemClick(item, e);
                  }}
                  className={`absolute z-20 transition-all duration-200 cursor-pointer group select-none min-w-[48px] min-h-[48px] flex items-center justify-center ${
                    isCovered ? 'opacity-0 pointer-events-auto' : 'opacity-100 hover:scale-115 active:scale-95'
                  } ${
                    isHinted ? 'ring-4 ring-yellow-400 rounded-full animate-bounce shadow-[0_0_35px_#f59e0b]' : ''
                  }`}
                  title={isCovered ? 'Кажется, здесь что-то скрыто...' : item.name}
                >
                  {/* Hint Aura */}
                  {isHinted && (
                    <div className="absolute -inset-3 bg-yellow-400/35 rounded-full animate-ping pointer-events-none" />
                  )}

                  {/* High Clarity SVG item */}
                  <div className="relative w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] group-hover:brightness-125 transition-all">
                    <VictorianItemSvg type={item.svgType} />
                  </div>
                </div>
              );
            })}

            {/* Floating Point Popups */}
            {floatingScore && (
              <div
                style={{
                  left: `${floatingScore.x}%`,
                  top: `${floatingScore.y}%`,
                }}
                className="absolute z-50 pointer-events-none font-serif font-black text-xl sm:text-2xl text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] -translate-x-1/2 -translate-y-12 animate-[floatUp_1.2s_ease-out_forwards]"
              >
                {floatingScore.text}
              </div>
            )}
          </div>

          {/* Interaction Notification Toast */}
          {interactionNotice && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 max-w-lg px-4 py-1.5 rounded-xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-2 border-amber-400 text-amber-100 text-xs sm:text-sm font-serif font-bold shadow-[0_8px_25px_rgba(0,0,0,0.95)] flex items-center gap-2 text-center pointer-events-none animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin shrink-0" />
              <span>{interactionNotice}</span>
            </div>
          )}

          {/* Misclick Spam Warning */}
          {misclickWarning && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md px-4 py-2 rounded-xl bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-2 border-red-500/80 text-amber-100 text-xs sm:text-sm font-serif font-bold shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2 text-center">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{misclickWarning}</span>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* 3. BOTTOM CONTROL BAR (MASYANYA QUEST STYLE: SHERLOCK TRAY)   */}
      {/* ============================================================ */}
      <footer className="relative z-30 w-full bg-[#120d09] border-t-2 border-amber-900/80 shadow-[0_-4px_20px_rgba(0,0,0,0.95)] p-1.5 sm:p-2 flex flex-col gap-1.5">
        
        {/* Sherlock Holmes Deduction Dialogue Line */}
        <div className="w-full flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/90 border border-amber-700/40 text-[11px] sm:text-xs font-serif text-amber-200 shadow-inner">
          <div className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-wider shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Шерлок:</span>
          </div>
          <p className="italic font-medium truncate text-stone-200">
            «{sherlockSpeech}»
          </p>
        </div>

        {/* Bottom Horizontal Interactive Deck: Sherlock + Clues Tray + Progress */}
        <div className="w-full flex items-center justify-between gap-2">
          
          {/* Left: Sherlock Avatar & Thought Bubble Hint Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sherlock Avatar */}
            <div 
              onClick={() => {
                soundEngine.playItemFoundBell();
                setSherlockSpeech('Осматривайте тайники! В старых домах Лондона двойное дно у каждой вещи.');
              }}
              className="w-9 h-11 sm:w-11 sm:h-13 rounded-lg bg-gradient-to-b from-stone-900 to-[#1e130b] border border-amber-500/80 shadow p-0.5 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Шерлок Холмс (нажмите для совета)"
            >
              <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
                <path d="M 10 120 C 10 85 25 75 50 75 C 75 75 90 85 90 120 Z" fill="#451a03" stroke="#291408" strokeWidth="2" />
                <path d="M 32 40 C 32 25 68 25 68 40 C 68 62 55 68 50 68 C 45 68 32 62 32 40 Z" fill="#fed7aa" />
                <ellipse cx="42" cy="42" rx="2.5" ry="1.8" fill="#ffffff" />
                <circle cx="43" cy="42" r="1.2" fill="#1e3a8a" />
                <ellipse cx="58" cy="42" rx="2.5" ry="1.8" fill="#ffffff" />
                <circle cx="57" cy="42" r="1.2" fill="#1e3a8a" />
                {/* Deerstalker Hat */}
                <path d="M 22 36 Q 50 28 78 36" stroke="#422006" strokeWidth="3" fill="none" />
                <path d="M 26 34 C 26 12 74 12 74 34 Z" fill="#713f12" stroke="#422006" strokeWidth="1.5" />
                <ellipse cx="50" cy="14" rx="4" ry="2" fill="#422006" />
                {/* Meerschaum Pipe */}
                <path d="M 48 54 Q 60 58 66 68" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <circle cx="68" cy="68" r="4" fill="#b45309" />
              </svg>
            </div>

            {/* Masyanya-Style Yellow Thought Bubble [ ? Подсказка ] */}
            <button
              onClick={handleHintClick}
              disabled={hintsAvailable <= 0}
              id="btn-game-hint"
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_3px_10px_rgba(245,158,11,0.4)] transition-all cursor-pointer select-none ${
                hintsAvailable > 0
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-stone-950 border-amber-200'
                  : 'bg-stone-800 text-stone-500 border-stone-700 opacity-60 cursor-not-allowed'
              }`}
              title="Получить дедуктивную подсказку Шерлока"
            >
              <HelpCircle className="w-4 h-4 fill-stone-950 text-yellow-400" />
              <span>Подсказка ({hintsAvailable})</span>
            </button>
          </div>

          {/* Center: Horizontal Tray of 8 Clues to Find */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
            {sceneItems.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setInspectingItem({
                      type: item.svgType,
                      name: item.name,
                    });
                  }}
                  className={`group relative shrink-0 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    item.found
                      ? 'bg-amber-950/40 border-amber-600/30 text-amber-400/60 line-through opacity-75'
                      : item.isSpecialTarget
                        ? 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'bg-stone-900/90 border-stone-700 hover:border-amber-500/50 text-stone-200 shadow'
                  }`}
                  title={`${item.name} (нажмите для осмотра в лупе)`}
                >
                  {/* SVG Thumbnail */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                    <VictorianItemSvg type={item.svgType} />
                  </div>

                  {/* Title */}
                  <span className="text-[10px] sm:text-xs font-serif font-bold whitespace-nowrap">
                    {item.name}
                  </span>

                  {/* Checkmark badge when found */}
                  {item.found && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-stone-950 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Progress & Zoom */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Items Counter Pill */}
            <div className="px-2 py-1 rounded-lg bg-stone-900 border border-amber-600/50 text-amber-300 font-mono font-bold text-xs sm:text-sm whitespace-nowrap shadow">
              <span className="text-stone-400 text-[10px] font-sans mr-1">УЛИК:</span>
              <span>{foundCount}/{totalCount}</span>
            </div>

            {/* Quick Zoom Toggle */}
            <button
              onClick={() => {
                if (zoomLevel > 1) {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                } else {
                  setZoomLevel(1.6);
                }
              }}
              className="p-1.5 sm:p-2 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-600/50 shadow transition-colors cursor-pointer"
              title={zoomLevel > 1 ? 'Сбросить масштаб' : 'Приблизить сцену (лупа)'}
            >
              {zoomLevel > 1 ? <RotateCcw className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. IN-GAME PAUSE MENU MODAL (CLEAN & ACCESSIBLE)             */}
      {/* ============================================================ */}
      {isPauseMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-stone-900 via-[#1c140e] to-stone-950 border-2 border-amber-500/80 shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-5 text-center flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-amber-800/40 pb-2">
              <h3 className="font-serif font-black text-lg text-amber-300 uppercase tracking-widest">
                Пауза: Меню дела
              </h3>
              <button
                onClick={() => setIsPauseMenuOpen(false)}
                className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-amber-100/80 font-serif leading-relaxed">
              «{currentCase.title}» — Бейкер-стрит, Лондон.<br />
              Собрано улик: <span className="text-amber-300 font-bold">{foundCount} из {totalCount}</span>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setIsPauseMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wider uppercase shadow border border-amber-300 cursor-pointer"
              >
                Продолжить расследование
              </button>

              <button
                onClick={() => {
                  const muted = soundEngine.toggleMute();
                  setIsMuted(muted);
                }}
                className="w-full py-2 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-stone-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                <span>{isMuted ? 'Включить звук' : 'Выключить звук'}</span>
              </button>

              {onReturnToMap && (
                <button
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    onReturnToMap();
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-stone-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Вернуться на карту Лондона</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. LANDSCAPE ORIENTATION OVERLAY (WHEN IN VERTICAL MODE)     */}
      {/* ============================================================ */}
      {isPortrait && !dismissOrientationWarning && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none text-slate-100">
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
            <Smartphone className="w-16 h-16 text-amber-400 animate-[spin_4s_ease-in-out_infinite]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-300 uppercase tracking-widest mb-2">
            Поверните телефон
          </h2>

          <p className="text-sm text-slate-300 max-w-xs leading-relaxed mb-6">
            Для идеальной видимости всех предметов и аутентичного квеста в стиле Масяня и Шерлок Холмс поверните телефон в <strong className="text-amber-200">альбомный режим (горизонтально)</strong>.
          </p>

          <button
            onClick={() => setDismissOrientationWarning(true)}
            className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-500/60 text-xs font-bold text-amber-300 uppercase tracking-wider cursor-pointer"
          >
            Продолжить в текущем режиме
          </button>
        </div>
      )}

      {/* 2D Model Loupe Inspector Modal */}
      {inspectingItem && (
        <ItemInspectorModal
          itemType={inspectingItem.type}
          itemName={inspectingItem.name}
          onClose={() => setInspectingItem(null)}
        />
      )}
    </div>
  );
};
