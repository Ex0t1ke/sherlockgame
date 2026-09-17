import React from 'react';
import { DetectiveRank, ScreenState, TimeOfDay } from '../types';
import { 
  Award, 
  Coins, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Smartphone, 
  Maximize2, 
  Sun, 
  Moon, 
  Sunset, 
  FileCode2, 
  Settings,
  MapPin
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HeaderBarProps {
  rank: DetectiveRank;
  coins: number;
  hintsAvailable: number;
  maxHints: number;
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (t: TimeOfDay) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenNotebook: () => void;
  onOpenSettings: () => void;
  onOpenAndroidCode: () => void;
  onGoToMap: () => void;
  currentScreen: ScreenState;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const formatRankRu = (rank: DetectiveRank): string => {
  switch (rank) {
    case 'Amateur Sleuth':
      return 'Начинающий сыщик';
    case 'Apprentice Detective':
      return 'Младший детектив';
    case 'Senior Investigator':
      return 'Старший следователь';
    case 'Chief Detective':
      return 'Главный сыщик';
    case 'Consulting Detective':
      return 'Детектив-консультант';
    case 'Rookie':
      return 'Стажёр';
    case 'Junior Detective':
      return 'Младший детектив';
    case 'Detective':
      return 'Детектив';
    case 'Senior Detective':
      return 'Старший детектив';
    case 'Master Detective':
      return 'Мастер дедукции';
    case 'Legendary Sherlock':
      return 'Легендарный Шерлок';
    default:
      return rank;
  }
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  rank,
  coins,
  hintsAvailable,
  maxHints,
  timeOfDay,
  onTimeOfDayChange,
  isMuted,
  onToggleMute,
  onOpenNotebook,
  onOpenSettings,
  onOpenAndroidCode,
  onGoToMap,
  currentScreen,
  isPhoneFrame,
  onTogglePhoneFrame,
}) => {
  const getNextTimeOfDay = (): TimeOfDay => {
    if (timeOfDay === 'day') return 'sunset';
    if (timeOfDay === 'sunset') return 'night';
    return 'day';
  };

  const getTimeLabelRu = () => {
    if (timeOfDay === 'day') return 'День';
    if (timeOfDay === 'sunset') return 'Закат';
    return 'Ночь';
  };

  const getTimeIcon = () => {
    if (timeOfDay === 'day') return <Sun className="w-4 h-4 text-amber-300" />;
    if (timeOfDay === 'sunset') return <Sunset className="w-4 h-4 text-orange-400" />;
    return <Moon className="w-4 h-4 text-indigo-300" />;
  };

  return (
    <header className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between shadow-xl z-50 text-amber-50 select-none">
      {/* Left: Rank & City Map */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentScreen !== 'menu' && currentScreen !== 'map' && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onGoToMap();
            }}
            id="btn-return-map"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 border border-amber-600/40 text-xs text-amber-200 transition-colors shadow-sm cursor-pointer"
            title="Вернуться на карту города"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">Карта города</span>
          </button>
        )}

        <div className="flex items-center gap-2 bg-slate-800/70 border border-amber-500/20 px-2.5 py-1 rounded-full shadow-inner">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold tracking-wide text-amber-200">
            {formatRankRu(rank)}
          </span>
        </div>
      </div>

      {/* Middle: Stats (Coins & Hints) */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Coins */}
        <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-600/30 px-2.5 py-1 rounded-full" title="Баланс монет">
          <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-300 tracking-wider">
            {coins}
          </span>
        </div>

        {/* Hints */}
        <div className="flex items-center gap-1.5 bg-sky-950/40 border border-sky-600/30 px-2.5 py-1 rounded-full" title="Доступно подсказок">
          <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-bold text-sky-200 tracking-wider">
            {hintsAvailable}/{maxHints}
          </span>
        </div>
      </div>

      {/* Right: Quick actions & controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Time of Day Cycle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onTimeOfDayChange(getNextTimeOfDay());
          }}
          id="btn-cycle-time"
          className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          title={`Время суток: ${getTimeLabelRu()} (нажмите для смены)`}
        >
          {getTimeIcon()}
        </button>

        {/* Sound Mute Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleMute();
          }}
          id="btn-toggle-sound"
          className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          title={isMuted ? 'Включить нуар-джаз и звуки' : 'Отключить звук'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Notebook Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenNotebook();
          }}
          id="btn-open-notebook"
          className="p-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          title="Дневник дел и досье клиентов"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs hidden md:inline font-medium">Досье</span>
        </button>

        {/* Android Kotlin Source & Project Export */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAndroidCode();
          }}
          id="btn-android-code"
          className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
          title="Открыть исходный код Kotlin и проект Android Studio"
        >
          <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Android Kotlin</span>
        </button>

        {/* Phone Frame Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onTogglePhoneFrame();
          }}
          id="btn-toggle-frame"
          className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          title={isPhoneFrame ? 'Переключить на полный экран' : 'Переключить в режим рамки смартфона Android'}
        >
          {isPhoneFrame ? (
            <Maximize2 className="w-4 h-4 text-amber-300" />
          ) : (
            <Smartphone className="w-4 h-4 text-amber-300" />
          )}
        </button>

        {/* Settings Modal */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          id="btn-open-settings"
          className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="Настройки и сохранения"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
