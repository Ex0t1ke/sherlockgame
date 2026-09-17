import React, { useState, useEffect, useRef } from 'react';
import { CaseDefinition } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { VictorianClock } from './VictorianClock';
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
import { VictorianDetective2D } from './VictorianDetective2D';
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
  CheckCircle2,
  AlertCircle,
  Eye,
  Scroll,
  X,
  Pin,
  PinOff,
  Clock,
  Sparkle
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
  category: string; // matches checklist group
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  svgType: string;
  rotation?: number;
  found: boolean;
  isSpecialTarget?: boolean;
  isEasterEgg?: boolean;
  hiddenBehind?: 'curtain' | 'stove' | 'crate' | 'picture' | 'steam';
}

// Checklist Item entry
interface ChecklistEntry {
  category: string;
  displayNameRu: string;
  totalRequired: number;
  foundCount: number;
}

// Grammatical Russian formatting for clues checklist
const getRussianChecklistLabel = (
  category: string,
  remaining: number,
  totalRequired: number,
  isCompleted: boolean,
  caseTargetName: string
): string => {
  if (isCompleted) {
    switch (category) {
      case 'handcuffs': return '3 наручников';
      case 'train': return 'Паровоз';
      case 'soldier': return 'Оловянный солдатик';
      case 'horse': return 'Лошадка-качалка';
      case 'necklace': return '2 ожерелья';
      case 'hat': return 'Дамская шляпа';
      case 'victoria_pic': return '2 портрета королевы';
      case 'keys': return '4 ключа';
      case 'grapes': return 'Гроздь винограда';
      case 'case_target': return caseTargetName;
      default: return `${totalRequired} улик`;
    }
  }

  // When still searching:
  switch (category) {
    case 'handcuffs':
      return remaining === 1 ? '1 наручники' : `${remaining} наручников`;
    case 'train':
      return 'Паровоз';
    case 'soldier':
      return 'Оловянный солдатик';
    case 'horse':
      return 'Лошадка-качалка';
    case 'necklace':
      return remaining === 1 ? '1 ожерелье' : `${remaining} ожерелья`;
    case 'hat':
      return 'Дамская шляпа';
    case 'victoria_pic':
      return remaining === 1 ? '1 портрет королевы' : `${remaining} портрета королевы`;
    case 'keys':
      if (remaining === 1) return '1 ключ';
      if (remaining < 5) return `${remaining} ключа`;
      return `${remaining} ключей`;
    case 'grapes':
      return 'Гроздь винограда';
    case 'case_target':
      return caseTargetName;
    default:
      return `${remaining} улик`;
  }
};

export const HiddenObjectGame: React.FC<HiddenObjectGameProps> = ({
  currentCase,
  hintsAvailable,
  onUseHint,
  onFoundItem,
  onReturnToMap,
}) => {
  // Timer: 8 minutes countdown (480 seconds), like 07:23 in screenshot!
  const [secondsRemaining, setSecondsRemaining] = useState<number>(443); // starts around 07:23
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [score, setScore] = useState<number>(11400); // authentic starter score like in screenshot!
  const [wrongClicks, setWrongClicks] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isMuted());

  // Collapsible / Slide-out Left Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Floating feedback
  const [floatingScore, setFloatingScore] = useState<{ x: number; y: number; text: string; id: number } | null>(null);
  const [hintedItemId, setHintedItemId] = useState<string | null>(null);
  const [misclickWarning, setMisclickWarning] = useState<string | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [isMisclickBlocked, setIsMisclickBlocked] = useState<boolean>(false);
  const recentMissClicks = useRef<number[]>([]);

  // 2D Model inspection & Detective Companion State
  const [inspectingItem, setInspectingItem] = useState<{ type: string; name: string } | null>(null);
  const [lastFoundItemName, setLastFoundItemName] = useState<string | null>(null);

  // Interactive "Masyanya-style" Environment Obstacles & Secret Cache States
  const [isCurtainOpen, setIsCurtainOpen] = useState<boolean>(false);
  const [isStoveDoorOpen, setIsStoveDoorOpen] = useState<boolean>(false);
  const [isCrateOpen, setIsCrateOpen] = useState<boolean>(false);
  const [isPictureMoved, setIsPictureMoved] = useState<boolean>(false);
  const [isValveTurned, setIsValveTurned] = useState<boolean>(false);
  const [interactionNotice, setInteractionNotice] = useState<string | null>(null);

  const sceneContainerRef = useRef<HTMLDivElement>(null);

  // Interaction handlers with rich procedural SFX and feedback
  const toggleCurtain = () => {
    soundEngine.playCurtainRustle();
    setIsCurtainOpen((prev) => {
      const next = !prev;
      setInteractionNotice(next ? 'Штора отодвинута! На подоконнике обнаружена улика!' : 'Бархатная штора задвинута.');
      return next;
    });
  };

  const toggleStoveDoor = () => {
    soundEngine.playCreakOpen();
    setIsStoveDoorOpen((prev) => {
      const next = !prev;
      setInteractionNotice(next ? 'Чугунная печь распахнута! В топке блестит металл!' : 'Дверца печи закрыта.');
      return next;
    });
  };

  const toggleCrate = () => {
    soundEngine.playWoodCrateOpen();
    setIsCrateOpen((prev) => {
      const next = !prev;
      setInteractionNotice(next ? 'Крышка ящика откинута! В соломе лежит посылка!' : 'Ящик закрыт.');
      return next;
    });
  };

  const togglePicture = () => {
    soundEngine.playSecretFound();
    setIsPictureMoved((prev) => {
      const next = !prev;
      setInteractionNotice(next ? 'Портрет сдвинут! В кирпичах обнаружен тайный сейф!' : 'Портрет возвращен на место.');
      return next;
    });
  };

  const turnValve = () => {
    soundEngine.playSteamValveHiss();
    setIsValveTurned((prev) => {
      const next = !prev;
      setInteractionNotice(next ? 'Пар со свистом спущен! Труба очистилась от дыма!' : 'Вентиль закрыт.');
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

  // Default Items matching the Victorian cellar atmosphere with Russian names & hidden behind obstacles
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([
    // 3 Handcuffs
    { id: 'hc_1', name: 'Стальные наручники #1', category: 'handcuffs', x: 23, y: 15, width: 4.8, height: 4.8, svgType: 'handcuffs', rotation: 12, found: false },
    // Sheffield handcuffs hidden inside the Potbelly Stove!
    { id: 'hc_2', name: 'Шеффилдские наручники #2', category: 'handcuffs', x: 44.2, y: 77.5, width: 4.6, height: 4.6, svgType: 'handcuffs', rotation: -15, found: false, hiddenBehind: 'stove' },
    { id: 'hc_3', name: 'Полицейские наручники #3', category: 'handcuffs', x: 75, y: 91, width: 5.2, height: 5.2, svgType: 'handcuffs', rotation: 35, found: false },

    // Train hidden inside London Dock Crate!
    { id: 'tr_1', name: 'Старинный паровоз', category: 'train', x: 5.8, y: 84.5, width: 6.5, height: 4.5, svgType: 'train', rotation: -2, found: false, hiddenBehind: 'crate' },

    // Toy Soldier
    { id: 'ts_1', name: 'Оловянный солдатик', category: 'soldier', x: 63, y: 50, width: 3.8, height: 6.5, svgType: 'toy_soldier', rotation: 0, found: false },

    // Toy Horse (Rocking horse)
    { id: 'th_1', name: 'Лошадка-качалка', category: 'horse', x: 48, y: 81, width: 6.2, height: 5.5, svgType: 'toy_horse', rotation: -4, found: false },

    // 2 Necklaces
    { id: 'nc_1', name: 'Жемчужное ожерелье', category: 'necklace', x: 64, y: 42, width: 5.2, height: 5.2, svgType: 'necklace', rotation: 10, found: false },
    { id: 'nc_2', name: 'Сапфировое ожерелье', category: 'necklace', x: 82, y: 77, width: 5.5, height: 5.5, svgType: 'necklace', rotation: -18, found: false },

    // Woman's Hat hidden behind Arched Window Velvet Curtain!
    { id: 'wh_1', name: 'Дамская шляпа', category: 'hat', x: 13.5, y: 38.5, width: 6.8, height: 5.2, svgType: 'womans_hat', rotation: -8, found: false, hiddenBehind: 'curtain' },

    // 2 Queen Victoria Pictures
    { id: 'qv_1', name: 'Портрет королевы Виктории #1', category: 'victoria_pic', x: 27, y: 50, width: 4.8, height: 6.2, svgType: 'victoria_picture', rotation: 2, found: false },
    { id: 'qv_2', name: 'Портрет королевы Виктории #2', category: 'victoria_pic', x: 74, y: 47, width: 4.5, height: 5.8, svgType: 'victoria_picture', rotation: -3, found: false },

    // 4 Keys
    // Brass Key hidden behind Queen Victoria Picture Safe!
    { id: 'ky_1', name: 'Латунный ключ #1', category: 'keys', x: 27.2, y: 52, width: 5.0, height: 3.2, svgType: 'key', rotation: 90, found: false, hiddenBehind: 'picture' },
    // Wrought Iron Key hidden on steam pipe behind valve!
    { id: 'ky_2', name: 'Кованый ключ #2', category: 'keys', x: 49.5, y: 15.5, width: 4.8, height: 3.0, svgType: 'key', rotation: -45, found: false, hiddenBehind: 'steam' },
    { id: 'ky_3', name: 'Миниатюрный ключ #3', category: 'keys', x: 56, y: 94, width: 4.5, height: 2.8, svgType: 'key', rotation: 15, found: false },
    { id: 'ky_4', name: 'Старинный ключ #4', category: 'keys', x: 93, y: 76, width: 4.8, height: 3.0, svgType: 'key', rotation: 110, found: false },

    // Grapes
    { id: 'gr_1', name: 'Гроздь винограда', category: 'grapes', x: 80, y: 71, width: 5.2, height: 5.2, svgType: 'grapes', rotation: 5, found: false },

    // Special Target Item for this specific case!
    { id: 'case_target', name: currentCase.targetItem.name, category: 'case_target', x: 34, y: 72, width: 5.5, height: 6.0, svgType: 'pocket_watch', rotation: -12, found: false, isSpecialTarget: true },

    // 221B Easter Egg: Sherlock's Pipe
    { id: 'sherlock_pipe', name: 'Трубка Шерлока Холмса', category: 'easter_egg', x: 42, y: 79, width: 5.5, height: 4.0, svgType: 'pipe', rotation: -14, found: false, isEasterEgg: true }
  ]);

  // Dynamic checklist state 100% in Russian
  const [checklist, setChecklist] = useState<ChecklistEntry[]>([
    { category: 'handcuffs', displayNameRu: 'Наручники', totalRequired: 3, foundCount: 0 },
    { category: 'train', displayNameRu: 'Паровоз', totalRequired: 1, foundCount: 0 },
    { category: 'soldier', displayNameRu: 'Оловянный солдатик', totalRequired: 1, foundCount: 0 },
    { category: 'horse', displayNameRu: 'Лошадка-качалка', totalRequired: 1, foundCount: 0 },
    { category: 'necklace', displayNameRu: 'Ожерелья', totalRequired: 2, foundCount: 0 },
    { category: 'hat', displayNameRu: 'Дамская шляпа', totalRequired: 1, foundCount: 0 },
    { category: 'victoria_pic', displayNameRu: 'Портреты королевы', totalRequired: 2, foundCount: 0 },
    { category: 'keys', displayNameRu: 'Ключи', totalRequired: 4, foundCount: 0 },
    { category: 'grapes', displayNameRu: 'Гроздь винограда', totalRequired: 1, foundCount: 0 },
    { category: 'case_target', displayNameRu: currentCase.targetItem.name, totalRequired: 1, foundCount: 0 },
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

  // Check if all checklist items are found
  const allItemsFound = checklist.every((entry) => entry.foundCount >= entry.totalRequired);

  // Victory Handler
  useEffect(() => {
    if (allItemsFound) {
      soundEngine.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
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
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [allItemsFound, elapsedSeconds, wrongClicks, hintsUsedCount, score, onFoundItem]);

  // Pointer position and drag panning
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

  // Item Found Click Handler
  const handleItemClick = (item: SceneItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.found || isMisclickBlocked) return;

    // Play Bell SFX and Eureka
    soundEngine.playItemFoundBell();

    // Set last found item name for Sherlock Holmes reactions
    setLastFoundItemName(item.name);

    // Mark item as found
    setSceneItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, found: true } : it))
    );

    // Update checklist count
    setChecklist((prev) =>
      prev.map((entry) => {
        if (entry.category === item.category) {
          return { ...entry, foundCount: Math.min(entry.totalRequired, entry.foundCount + 1) };
        }
        return entry;
      })
    );

    // Add Score points (+1200, or +2500 for special target!)
    const pointGain = item.isSpecialTarget ? 2500 : 1200;
    setScore((s) => s + pointGain);

    // Show floating score
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

    // Clear hint if this item was hinted
    if (hintedItemId === item.id) {
      setHintedItemId(null);
    }
  };

  // Background Misclick Handler
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (isMisclickBlocked) return;

    soundEngine.playMisclickBuzz();
    setWrongClicks((w) => w + 1);

    const now = Date.now();
    recentMissClicks.current = [...recentMissClicks.current.filter((t) => now - t < 2500), now];

    // Misclick spam penalty: 3 misses in 2.5 seconds
    if (recentMissClicks.current.length >= 3) {
      setIsScreenShaking(true);
      setIsMisclickBlocked(true);
      setSecondsRemaining((sec) => Math.max(0, sec - 10)); // Penalty -10 sec!
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

  // Hint Trigger (Highlights a random unfound item & gives Masyanya-style clue if hidden behind obstacle)
  const handleHintClick = () => {
    if (hintsAvailable <= 0) return;

    const unfound = sceneItems.filter((it) => !it.found);
    if (unfound.length === 0) return;

    onUseHint();
    setHintsUsedCount((h) => h + 1);
    soundEngine.playHintShimmer();

    const randomItem = unfound[Math.floor(Math.random() * unfound.length)];
    setHintedItemId(randomItem.id);

    // If item is concealed behind obstacle, give a Masyanya-quest style clue!
    if (randomItem.hiddenBehind === 'curtain' && !isCurtainOpen) {
      setInteractionNotice('Шерлок: Улика скрыта за шторами! Отодвиньте портьеру на окне!');
    } else if (randomItem.hiddenBehind === 'stove' && !isStoveDoorOpen) {
      setInteractionNotice('Шерлок: Улика внутри печи! Распахните чугунную дверцу!');
    } else if (randomItem.hiddenBehind === 'crate' && !isCrateOpen) {
      setInteractionNotice('Шерлок: Улика в ящике! Откиньте дощатую крышку ящика!');
    } else if (randomItem.hiddenBehind === 'picture' && !isPictureMoved) {
      setInteractionNotice('Шерлок: Улика в тайнике! Сдвиньте портрет королевы!');
    } else if (randomItem.hiddenBehind === 'steam' && !isValveTurned) {
      setInteractionNotice('Шерлок: Улика скрыта паром! Поверните вентиль на трубе!');
    }

    // Auto-remove golden aura after 5 seconds
    window.setTimeout(() => {
      setHintedItemId(null);
    }, 5000);
  };

  // Category mapping to SVG 2D models for Loupe Inspector
  const categoryToSvg: Record<string, string> = {
    handcuffs: 'handcuffs',
    train: 'train',
    soldier: 'toy_soldier',
    horse: 'toy_horse',
    necklace: 'necklace',
    hat: 'womans_hat',
    victoria_pic: 'victoria_picture',
    keys: 'key',
    grapes: 'grapes',
    case_target: 'pocket_watch',
    easter_egg: 'pipe',
  };

  // Total items remaining
  const totalItemsRemaining = checklist.reduce(
    (acc, item) => acc + Math.max(0, item.totalRequired - item.foundCount),
    0
  );

  // Formatted Time MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className={`relative w-full h-full min-h-[640px] flex flex-col md:flex-row bg-[#0c0a09] text-amber-50 select-none overflow-hidden ${
      isScreenShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
    }`}>
      
      {/* ============================================================ */}
      {/* SLIDE-OUT / COLLAPSIBLE DRAWER: RUSSIAN VICTORIAN CHECKLIST   */}
      {/* ============================================================ */}
      {/* Backdrop overlay when open in floating / drawer mode */}
      {isSidebarOpen && !isSidebarPinned && (
        <div 
          onClick={() => {
            soundEngine.playWatchTick();
            setIsSidebarOpen(false);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-200"
        />
      )}

      {/* The Sidebar Element (docked or slide out as drawer) */}
      <aside className={`
        ${isSidebarPinned ? 'relative z-30 w-80 sm:w-84 shrink-0 translate-x-0' : 'fixed top-0 bottom-0 left-0 z-50 w-80 sm:w-84'}
        bg-gradient-to-b from-[#14100c] via-[#1c1612] to-[#0c0a09]
        border-r-4 border-amber-800/80 shadow-[8px_0_30px_rgba(0,0,0,0.95)]
        flex flex-col transform transition-transform duration-200 ease-out will-change-transform
        ${isSidebarPinned 
          ? 'translate-x-0' 
          : isSidebarOpen 
            ? 'translate-x-0 pointer-events-auto' 
            : '-translate-x-full pointer-events-none'
        }
      `}>
        
        {/* Drawer Header Controls */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-amber-900/60 bg-[#120b07]">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300">
            <Scroll className="w-4 h-4 text-amber-400" />
            <span>СПИСОК УЛИК ({totalItemsRemaining})</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin / Dock Toggle for Desktop */}
            <button
              onClick={() => {
                soundEngine.playWatchTick();
                setIsSidebarPinned(!isSidebarPinned);
                if (!isSidebarPinned) setIsSidebarOpen(true);
              }}
              className="p-1 rounded text-amber-400/80 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title={isSidebarPinned ? 'Открепить (сделать всплывающим меню)' : 'Закрепить панель рядом'}
            >
              {isSidebarPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>

            {/* Close / Collapse Button */}
            <button
              onClick={() => {
                soundEngine.playWatchTick();
                setIsSidebarOpen(false);
              }}
              className="p-1 rounded text-stone-400 hover:text-amber-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Свернуть список улик"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. TOP SECTION: Antique Pocket Clock & Timer Display */}
        <div className="pt-3 pb-2 px-3 flex flex-col items-center border-b-2 border-amber-900/60 bg-gradient-to-b from-[#23180f] to-[#160f09]">
          <VictorianClock secondsLeft={secondsRemaining} />
        </div>

        {/* 2. MIDDLE SECTION: Emerald Velvet Item Checklist 100% in Russian */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col justify-start">
          {/* Emerald Velvet Panel Frame with Gold Floral Filigree */}
          <div className="relative w-full rounded-xl bg-gradient-to-b from-[#091a13] via-[#0b241a] to-[#07150f] border-2 border-amber-600/70 shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] p-3 flex flex-col">
            
            {/* Victorian Damask/Velvet Texture Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none rounded-xl" />

            {/* Corner Gold Flourishes */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

            {/* Items Checklist 100% in Russian */}
            <div className="space-y-2 relative z-10">
              {checklist.map((item) => {
                const isCompleted = item.foundCount >= item.totalRequired;
                const remaining = item.totalRequired - item.foundCount;
                const label = getRussianChecklistLabel(
                  item.category,
                  remaining,
                  item.totalRequired,
                  isCompleted,
                  currentCase.targetItem.name
                );

                return (
                  <div
                    key={item.category}
                    className={`group relative text-xs sm:text-sm font-serif tracking-wide transition-all duration-300 flex items-center justify-between py-0.5 ${
                      isCompleted
                        ? 'text-stone-500 line-through decoration-stone-400/80 decoration-2 italic opacity-65'
                        : 'text-amber-100/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                    }`}
                  >
                    <span className="flex-1 select-none pr-1">{label}</span>
                    
                    <div className="flex items-center gap-1">
                      {/* 2D Model Loupe Inspect Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const svgType = categoryToSvg[item.category] || 'pocket_watch';
                          setInspectingItem({
                            type: svgType,
                            name: item.displayNameRu,
                          });
                        }}
                        className="p-1 rounded hover:bg-emerald-900/60 text-amber-300/80 hover:text-amber-100 border border-transparent hover:border-amber-500/40 transition-all cursor-pointer"
                        title="Осмотреть 2D-модель в лупе"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. BOTTOM SECTION: Victorian Score Plate & Hint Lamp Button in Russian */}
        <div className="p-3 border-t-2 border-amber-900/60 bg-gradient-to-t from-[#160f09] to-[#23180f] flex flex-col gap-2.5">
          
          {/* Score Cartouche with Russian Label */}
          <div className="relative w-full px-3 py-1.5 rounded-lg bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-2 border-amber-500/80 shadow-[0_2px_10px_rgba(0,0,0,0.9)] flex items-center justify-between">
            <div className="text-[11px] font-serif font-black tracking-widest text-amber-300 uppercase">
              СЧЁТ
            </div>

            <div className="font-mono font-black text-base sm:text-lg text-yellow-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {score.toLocaleString()}
            </div>

            {/* Deerstalker Hat Silhouette Icon */}
            <div className="w-5 h-5 flex items-center justify-center text-amber-400" title="Шляпа Шерлока">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-85">
                <path d="M12 4C8 4 4 7 3 11C2 12 3 13 5 13C6 13 7 12 8 11C9 10 11 10 12 10C13 10 15 10 16 11C17 12 18 13 19 13C21 13 22 12 21 11C20 7 16 4 12 4Z" />
                <path d="M5 13C3 13 2 14 2 15C2 16 4 17 8 17H16C20 17 22 16 22 15C22 14 21 13 19 13C17 13 15 12 12 12C9 12 7 13 5 13Z" />
              </svg>
            </div>
          </div>

          {/* Authentic Victorian Hint Button */}
          <button
            onClick={handleHintClick}
            disabled={hintsAvailable <= 0}
            className={`relative w-full py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-2 shadow-xl transition-all font-serif font-bold text-xs tracking-wider uppercase cursor-pointer ${
              hintsAvailable > 0
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 border-amber-300 text-stone-950 hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-stone-800/80 border-stone-700 text-stone-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ПОДСКАЗКА ({hintsAvailable})</span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* EXPANDED MAIN AREA: DETAILED VICTORIAN ROOM SCENE             */}
      {/* ============================================================ */}
      <main className="relative flex-1 w-full h-full min-h-[520px] overflow-hidden flex flex-col p-1.5 sm:p-3 bg-[#0a0705]">
        
        {/* Carved Victorian Wood & Brass Frame Outer Border */}
        <div className="relative w-full h-full rounded-2xl border-4 sm:border-6 border-[#78350f] shadow-[0_0_40px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col bg-[#1c1917]">
          
          {/* Inner Golden Bevel Line */}
          <div className="absolute inset-0 border-2 border-amber-500/50 pointer-events-none z-30 rounded-lg" />

          {/* ========================================================== */}
          {/* TOP QUICK BAR: TOGGLE CHECKLIST, TIMER, SCORE, HINTS, ZOOM */}
          {/* ========================================================== */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-40 flex items-center justify-between pointer-events-none">
            
            {/* Left Controls: Button to Slide Out Checklist */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {(!isSidebarPinned || !isSidebarOpen) && (
                <button
                  onClick={() => {
                    soundEngine.playWatchTick();
                    setIsSidebarOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:brightness-110 active:scale-95 text-stone-950 font-serif font-bold text-xs sm:text-sm border-2 border-amber-300 shadow-[0_4px_14px_rgba(0,0,0,0.85)] flex items-center gap-1.5 transition-all cursor-pointer animate-in fade-in"
                  title="Открыть выплывающий список улик"
                >
                  <Scroll className="w-4 h-4 text-stone-950" />
                  <span>Улики ({totalItemsRemaining})</span>
                </button>
              )}

              {/* Quick Timer Pill */}
              <div className="px-2.5 py-1 rounded-lg bg-stone-900/90 border border-amber-600/60 shadow-lg text-amber-300 font-mono text-xs sm:text-sm font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{timeFormatted}</span>
              </div>

              {/* Quick Score Pill */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-amber-600/60 shadow-lg text-yellow-300 font-mono text-xs sm:text-sm font-bold backdrop-blur-xs">
                <span className="text-[10px] text-amber-400 font-serif">СЧЁТ:</span>
                <span>{score.toLocaleString()}</span>
              </div>
            </div>

            {/* Right Controls: Hint Button, Return to Map, Audio, Zoom */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              
              {/* Quick Hint Button in scene bar */}
              <button
                onClick={handleHintClick}
                disabled={hintsAvailable <= 0}
                className={`px-2.5 py-1 rounded-lg border text-xs font-serif font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-colors cursor-pointer ${
                  hintsAvailable > 0
                    ? 'bg-amber-600/90 hover:bg-amber-500 text-stone-950 border-amber-300'
                    : 'bg-stone-900/80 text-stone-500 border-stone-700 opacity-60 cursor-not-allowed'
                }`}
                title="Использовать подсказку дедукции"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Подсказка</span>
                <span>({hintsAvailable})</span>
              </button>

              {/* Return to Map Button */}
              {onReturnToMap && (
                <button
                  onClick={onReturnToMap}
                  className="px-2.5 py-1 rounded-lg bg-stone-900/85 hover:bg-stone-800 text-amber-200 border border-amber-600/50 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-colors cursor-pointer"
                  title="Вернуться на карту Лондона"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Карта</span>
                </button>
              )}

              {/* Audio Mute Toggle */}
              <button
                onClick={() => {
                  const muted = soundEngine.toggleMute();
                  setIsMuted(muted);
                }}
                className="p-1.5 rounded-lg bg-stone-900/85 hover:bg-stone-800 text-amber-300 border border-amber-600/50 shadow-lg backdrop-blur-xs transition-colors cursor-pointer"
                title={isMuted ? 'Включить звук' : 'Выключить звук'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Zoom In/Out/Reset */}
              <div className="flex items-center bg-stone-900/85 rounded-lg border border-amber-600/50 shadow-lg backdrop-blur-xs overflow-hidden">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                  className="p-1.5 hover:bg-stone-800 text-amber-300 transition-colors cursor-pointer"
                  title="Уменьшить"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.25))}
                  className="p-1.5 hover:bg-stone-800 text-amber-300 transition-colors cursor-pointer"
                  title="Приблизить"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    className="px-1.5 py-1 hover:bg-stone-800 text-[10px] font-mono text-amber-400 transition-colors cursor-pointer"
                    title="Сбросить масштаб"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* INTERACTIVE SCENE CANVAS - EXPANDED & RICHLY DETAILED      */}
          {/* ========================================================== */}
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
            {/* Zoom / Pan Wrapper */}
            <div
              className="relative w-full h-full transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* ======================================================= */}
              {/* RICH VICTORIAN BASEMENT / CELLAR SCENERY 2D MODELS      */}
              {/* ======================================================= */}
              <div className="absolute inset-0 bg-[#140e0a]">
                
                {/* 1. Stone Wall & Brickwork Masonry Relief */}
                <div className="absolute inset-0 bg-[radial-gradient(#2c1c12_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(#3a2618_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />

                {/* 2. Heavy Oak Ceiling Beams with Iron Straps */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#24130a] via-[#1a0e07] to-[#100804] border-b-4 border-[#3e1f10] shadow-[0_8px_25px_rgba(0,0,0,0.9)] flex items-center justify-around px-8 z-10">
                  {/* Timber Grain Lines */}
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(to_right,#000_0px,#000_2px,transparent_2px,transparent_30px)] pointer-events-none" />
                  
                  {/* Heavy Iron Carriage Bolts & Reinforcing Plates */}
                  {[0.08, 0.25, 0.45, 0.65, 0.85, 0.95].map((pos, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-13 bg-[#110d0a] border border-stone-700 rounded-sm shadow-inner flex flex-col justify-between py-1.5 items-center z-10"
                      style={{ position: 'absolute', left: `${pos * 100}%` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-400 border border-stone-900 shadow" />
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-400 border border-stone-900 shadow" />
                    </div>
                  ))}
                </div>

                {/* 3. 2D Model: Gothic Arched Cellar Window with Moonlight & Interactive Velvet Curtain */}
                <GothicArchwayModel 
                  isCurtainOpen={isCurtainOpen}
                  onToggleCurtain={toggleCurtain}
                />

                {/* 4. 2D Model: Wall Candle Sconce with Flickering Flame */}
                <WallCandleSconceModel />

                {/* 5. 2D Model: Steampunk Overhead Copper Pipes & Interactive Steam Valve */}
                <SteamBoilerModel 
                  isValveTurned={isValveTurned}
                  onTurnValve={turnValve}
                />

                {/* 6. 2D Model: Center Victorian Potbelly Stove with Openable Hearth Door */}
                <VictorianStoveModel 
                  isDoorOpen={isStoveDoorOpen}
                  onToggleDoor={toggleStoveDoor}
                />

                {/* 7. 2D Model: Apothecary & Winemaker Shelving Rack with Glass Bottles */}
                <ApothecaryShelvesModel />

                {/* 8. 2D Model: London Docks Cargo Crates with Openable Hinged Lid */}
                <LondonCratesModel 
                  isCrateOpen={isCrateOpen}
                  onToggleCrate={toggleCrate}
                />

                {/* 9. 2D Model: Heavy Oak Workbench Table with Kerosene Hurricane Lamp */}
                <WorkbenchModel />

                {/* 10. 2D Model: Secret Wall Safe behind Queen Victoria Portrait */}
                <SecretWallSafeModel 
                  isPictureMoved={isPictureMoved}
                  onTogglePicture={togglePicture}
                />

                {/* 11. 2D Model: Detailed Wooden Cellar Floorboards with Shadows and Glow */}
                <VictorianCellarFloor />

                {/* 12. 2D Atmospheric Drifting Golden Dust Particles & Cobwebs */}
                <AtmosphereDustMotes />

                {/* 13. Warm Amber Ambient Lighting Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none z-20" />
                <div className="absolute bottom-16 left-[38%] w-80 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none z-20" />
                <div className="absolute top-32 left-32 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-20" />
              </div>

              {/* ======================================================= */}
              {/* INTERACTIVE HIDDEN OBJECTS PLACED ON SCENE              */}
              {/* ======================================================= */}
              {sceneItems.map((item) => {
                if (item.found) return null;

                const isHinted = hintedItemId === item.id;

                // Check if item is covered by closed obstacle cache
                const isCovered = 
                  (item.hiddenBehind === 'curtain' && !isCurtainOpen) ||
                  (item.hiddenBehind === 'stove' && !isStoveDoorOpen) ||
                  (item.hiddenBehind === 'crate' && !isCrateOpen) ||
                  (item.hiddenBehind === 'picture' && !isPictureMoved) ||
                  (item.hiddenBehind === 'steam' && !isValveTurned);

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
                        let tip = 'Здесь что-то скрыто! Сначала устраните препятствие!';
                        if (item.hiddenBehind === 'curtain') tip = 'Улика скрыта за шторой! Отодвиньте бархатную портьеру на окне!';
                        if (item.hiddenBehind === 'stove') tip = 'Улика внутри печи! Распахните чугунную дверцу топки!';
                        if (item.hiddenBehind === 'crate') tip = 'Улика в ящике! Откиньте дощатую крышку ящика!';
                        if (item.hiddenBehind === 'picture') tip = 'Улика в тайнике! Сдвиньте висящий на стене портрет!';
                        if (item.hiddenBehind === 'steam') tip = 'Улика скрыта облаком пара! Поверните вентиль на медной трубе!';
                        setInteractionNotice(tip);
                        return;
                      }
                      handleItemClick(item, e);
                    }}
                    className={`absolute z-20 transition-all duration-300 cursor-pointer group select-none hover:scale-110 active:scale-95 ${
                      isCovered ? 'opacity-0 pointer-events-auto' : 'opacity-100'
                    } ${
                      isHinted ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-stone-950 rounded-full animate-bounce shadow-[0_0_30px_#f59e0b]' : ''
                    }`}
                    title={isCovered ? 'Кажется, здесь что-то скрыто...' : item.name}
                  >
                    {/* Hint Sparkle Halo */}
                    {isHinted && (
                      <div className="absolute -inset-4 bg-yellow-400/30 rounded-full animate-ping pointer-events-none" />
                    )}

                    {/* Vector Victorian Item Rendering */}
                    <div className="relative w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] group-hover:brightness-125 transition-all">
                      <VictorianItemSvg type={item.svgType} />
                    </div>
                  </div>
                );
              })}

              {/* Floating Point Popups (+1200 / +2500) */}
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

            {/* Quest Interaction Notification Banner (Masyanya-style feedback) */}
            {interactionNotice && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 max-w-lg px-4 py-2 rounded-xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-2 border-amber-400 text-amber-100 text-xs sm:text-sm font-serif font-bold shadow-[0_10px_30px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-top flex items-center gap-2 text-center pointer-events-none">
                <Sparkle className="w-4 h-4 text-yellow-300 animate-spin shrink-0" />
                <span>{interactionNotice}</span>
              </div>
            )}

            {/* Misclick Spam Warning Banner */}
            {misclickWarning && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 max-w-md px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-2 border-red-500/80 text-amber-100 text-xs sm:text-sm font-serif font-bold shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top flex items-center gap-2.5 text-center">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{misclickWarning}</span>
              </div>
            )}

            {/* Interactive 2D Animated Sherlock Holmes Companion (Compact & Non-Obstructive) */}
            <VictorianDetective2D
              remainingCount={sceneItems.filter((it) => !it.found).length}
              lastFoundName={lastFoundItemName}
              onAskHolmesHint={handleHintClick}
              hintsAvailable={hintsAvailable}
            />
          </div>
        </div>
      </main>

      {/* 2D Model Museum Loupe Inspector Modal */}
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
