import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CaseDefinition, DistrictId, TimeOfDay } from '../types';
import { DISTRICTS } from '../data/casesData';
import { ClientPortrait } from './ClientPortrait';
import { 
  Building2, 
  Landmark, 
  Home, 
  Factory, 
  Anchor, 
  GraduationCap, 
  Lock, 
  Star, 
  ArrowRight, 
  Compass, 
  AlertCircle,
  Coins,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface CityMapProps {
  cases: CaseDefinition[];
  completedCaseIds: string[];
  unlockedDistricts: DistrictId[];
  timeOfDay: TimeOfDay;
  onSelectCase: (caseItem: CaseDefinition) => void;
  onOpenOffice: () => void;
}

export const getDistrictNameRu = (id: DistrictId): string => {
  switch (id) {
    case 'old_town':
      return 'Старый город';
    case 'business_district':
      return 'Деловой квартал';
    case 'suburbs':
      return 'Пригород';
    case 'industrial_zone':
      return 'Промзона';
    case 'port_area':
      return 'Портовый район';
    case 'university_campus':
      return 'Университетский кампус';
    default:
      return id;
  }
};

export const getDifficultyRu = (diff: string): string => {
  switch (diff.toLowerCase()) {
    case 'easy':
      return 'Легко';
    case 'medium':
      return 'Средне';
    case 'hard':
      return 'Сложно';
    case 'expert':
      return 'Эксперт';
    default:
      return diff;
  }
};

export const CityMap: React.FC<CityMapProps> = ({
  cases = [],
  completedCaseIds = [],
  unlockedDistricts = ['old_town'],
  timeOfDay,
  onSelectCase,
  onOpenOffice,
}) => {
  const safeCases = Array.isArray(cases) ? cases : [];
  const safeCompletedCaseIds = Array.isArray(completedCaseIds) ? completedCaseIds : [];
  const safeUnlockedDistricts = Array.isArray(unlockedDistricts) ? unlockedDistricts : ['old_town'];
  const [selectedCase, setSelectedCase] = useState<CaseDefinition | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startPanX: number; startPanY: number }>({
    clientX: 0,
    clientY: 0,
    startPanX: 0,
    startPanY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const lastTouchDistRef = useRef<number | null>(null);

  // Time of Day lighting overlay colors
  const timeOverlayMap = {
    day: 'bg-amber-500/5',
    sunset: 'bg-gradient-to-t from-orange-950/40 via-amber-900/20 to-purple-950/30',
    night: 'bg-slate-950/60',
  };

  // Zoom helpers
  const handleZoomIn = () => {
    soundEngine.playClick();
    setZoom((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    soundEngine.playClick();
    setZoom((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
  };

  const handleResetZoom = () => {
    soundEngine.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pointer drag to pan map
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click or single touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    if (Math.hypot(dx, dy) > 4) {
      hasMovedRef.current = true;
    }
    // Limit panning boundary based on zoom
    const maxPanX = 600 * zoom;
    const maxPanY = 400 * zoom;
    const newX = Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.startPanX + dx));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.startPanY + dy));
    setPan({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Wheel zoom handling
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => Math.min(2.5, Math.max(0.75, +(prev + zoomDelta).toFixed(2))));
  }, []);

  // Touch pinch-to-zoom
  useEffect(() => {
    const el = mapViewportRef.current;
    if (!el) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastTouchDistRef.current !== null) {
          const delta = (dist - lastTouchDistRef.current) * 0.005;
          setZoom((prev) => Math.min(2.5, Math.max(0.75, +(prev + delta).toFixed(2))));
        }
        lastTouchDistRef.current = dist;
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistRef.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onWheel]);

  const getDistrictIcon = (id: DistrictId) => {
    switch (id) {
      case 'old_town':
        return <Landmark className="w-3.5 h-3.5 text-amber-400" />;
      case 'business_district':
        return <Building2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'suburbs':
        return <Home className="w-3.5 h-3.5 text-pink-400" />;
      case 'industrial_zone':
        return <Factory className="w-3.5 h-3.5 text-blue-400" />;
      case 'port_area':
        return <Anchor className="w-3.5 h-3.5 text-orange-400" />;
      case 'university_campus':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  // Fixed visual coordinate anchors for each district on map
  const districtCoordinates: Record<DistrictId, { x: number; y: number }> = {
    old_town: { x: 30, y: 35 },
    business_district: { x: 70, y: 28 },
    suburbs: { x: 25, y: 72 },
    industrial_zone: { x: 75, y: 76 },
    port_area: { x: 18, y: 50 },
    university_campus: { x: 62, y: 52 },
  };

  // Coordinates for cases on map
  const caseCoordinates: Record<string, { x: number; y: number }> = {
    case_1_eleanor: { x: 26, y: 32 },
    case_8_olga: { x: 36, y: 38 },
    case_4_sarah: { x: 65, y: 24 },
    case_7_victor: { x: 78, y: 32 },
    case_2_tommy: { x: 22, y: 68 },
    case_6_lily: { x: 34, y: 76 },
    case_9_jake: { x: 74, y: 78 },
    case_3_antonio: { x: 15, y: 48 },
    case_5_hartmann: { x: 58, y: 48 },
    case_10_amara: { x: 66, y: 58 },
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden text-amber-50 select-none">
      {/* City Map Canvas Header - Compact Landscape Navigation */}
      <div className="w-full bg-slate-900/95 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
          <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-amber-200 uppercase">
            Карта Лондона
          </span>
        </div>

        {/* District Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar max-w-lg">
          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedDistrict(null);
            }}
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDistrict === null
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Все районы
          </button>
          {DISTRICTS.map((d) => {
            const isUnlocked = unlockedDistricts.includes(d.id as DistrictId);
            return (
              <button
                key={d.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedDistrict(d.id as DistrictId);
                }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDistrict === d.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-900/60 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                {!isUnlocked && <Lock className="w-2.5 h-2.5" />}
                <span>{getDistrictNameRu(d.id as DistrictId)}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-amber-300/80 font-mono hidden sm:block">
          {timeOfDay === 'day' ? 'ДЕНЬ' : timeOfDay === 'sunset' ? 'ЗАКАТ' : 'НОЧЬ'}
        </div>
      </div>

      {/* Main Interactive Map Viewport with Zoom and Pan */}
      <div 
        ref={mapViewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative flex-1 w-full h-full overflow-hidden select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Dynamic Day/Night atmosphere filter */}
        <div className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-700 ${timeOverlayMap[timeOfDay]}`} />

        {/* Floating Zoom Controls HUD on Top-Left */}
        <div 
          className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-slate-900/90 border border-amber-500/40 rounded-xl p-1 shadow-2xl backdrop-blur-md"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomIn}
            title="Приблизить карту (+)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="px-1.5 text-[11px] font-mono font-bold text-amber-200">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomOut}
            title="Отдалить карту (-)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
          <button
            onClick={handleResetZoom}
            title="Сбросить масштаб и вернуть в центр"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag Hint Tooltip */}
        <div className="absolute bottom-3 left-3 z-30 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-[10px] text-slate-400 pointer-events-none backdrop-blur-sm">
          <Move className="w-3 h-3 text-amber-400" />
          <span>Перетаскивайте карту и приближайте колёсиком или кнопками</span>
        </div>

        {/* Scaled & Panned Map Canvas Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          {/* Base Map Graphic */}
          <svg
            viewBox="0 0 1000 650"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Ground Terrain */}
            <rect width="1000" height="650" fill="#0d1321" />

            {/* Port / Harbor Water Area */}
            <path
              d="M 0 200 C 60 220 120 260 140 340 C 160 420 100 520 80 650 L 0 650 Z"
              fill="#082f49"
            />
            <path d="M 20 280 Q 50 270 80 280 T 130 285" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.3" />
            <path d="M 30 380 Q 70 370 110 380" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.3" />

            {/* Park Greenery */}
            <ellipse cx="280" cy="500" rx="140" ry="80" fill="#064e3b" opacity="0.4" />
            <ellipse cx="640" cy="380" rx="120" ry="70" fill="#064e3b" opacity="0.3" />

            {/* City Street Grid */}
            <g stroke="#334155" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 120 180 L 480 320 L 880 180" />
              <path d="M 480 320 L 480 620" />
              <path d="M 140 340 L 480 320 L 820 480" />
              <path d="M 320 220 L 780 440" />
              <path d="M 220 480 L 820 260" />
            </g>

            {/* Street Centerlines */}
            <g stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,6" strokeLinecap="round" fill="none" opacity="0.6">
              <path d="M 120 180 L 480 320 L 880 180" />
              <path d="M 480 320 L 480 620" />
              <path d="M 140 340 L 480 320 L 820 480" />
            </g>

            {/* Animated Street Traffic */}
            <g>
              <rect x="260" y="235" width="10" height="6" rx="2" fill="#eab308" transform="rotate(22 260 235)">
                <animate attributeName="x" from="180" to="450" dur="12s" repeatCount="indefinite" />
              </rect>
              <rect x="520" y="380" width="10" height="6" rx="2" fill="#ef4444" transform="rotate(25 520 380)">
                <animate attributeName="x" from="500" to="800" dur="15s" repeatCount="indefinite" />
              </rect>
            </g>

            {/* District Isometric Buildings */}
            <g transform="translate(250, 160)" opacity="0.75">
              <polygon points="40,20 80,0 120,20 80,40" fill="#78350f" />
              <polygon points="40,20 80,40 80,80 40,60" fill="#451a03" />
              <polygon points="120,20 80,40 80,80 120,60" fill="#292524" />
            </g>

            <g transform="translate(680, 130)" opacity="0.8">
              <polygon points="40,10 80,-10 120,10 80,30" fill="#0284c7" />
              <polygon points="40,10 80,30 80,120 40,100" fill="#0369a1" />
              <polygon points="120,10 80,30 80,120 120,100" fill="#075985" />
            </g>

            <g transform="translate(560, 270)" opacity="0.75">
              <polygon points="30,10 60,0 90,10 60,20" fill="#6d28d9" />
              <polygon points="30,10 60,20 60,70 30,60" fill="#5b21b6" />
              <polygon points="90,10 60,20 60,70 90,60" fill="#4c1d95" />
            </g>

            <g transform="translate(720, 430)" opacity="0.75">
              <polygon points="20,15 70,0 110,15 60,30" fill="#475569" />
              <polygon points="20,15 60,30 60,70 20,55" fill="#334155" />
              <polygon points="110,15 60,30 60,70 110,55" fill="#1e293b" />
            </g>
          </svg>

          {/* Central Detective Office: 221B Baker St. Headquarters */}
          <div
            style={{ left: '48%', top: '48%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer group"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              if (hasMovedRef.current) return;
              soundEngine.playClick();
              onOpenOffice();
            }}
            id="marker-sherlock-office"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-amber-500/30 animate-ping" />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-2xl border-2 border-yellow-300 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="font-serif font-black text-xs text-slate-950 tracking-tighter">
                  221B
                </span>
              </div>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded bg-slate-950/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-md whitespace-nowrap">
              Офис Шерлока (221B)
            </div>
          </div>

          {/* District Labels */}
          {DISTRICTS.map((d) => {
            const coords = districtCoordinates[d.id as DistrictId];
            const isUnlocked = unlockedDistricts.includes(d.id as DistrictId);
            if (selectedDistrict && selectedDistrict !== d.id) return null;

            return (
              <div
                key={d.id}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none transition-opacity ${
                  isUnlocked ? 'opacity-90' : 'opacity-40'
                }`}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm border border-slate-700/80 shadow-md">
                  {getDistrictIcon(d.id as DistrictId)}
                  <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
                    {getDistrictNameRu(d.id as DistrictId)}
                  </span>
                  {!isUnlocked && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                </div>
              </div>
            );
          })}

          {/* Interactive Case Markers */}
          {safeCases.map((c) => {
            const coords = caseCoordinates[c.id] || { x: 50, y: 50 };
            const isCompleted = safeCompletedCaseIds.includes(c.id);
            const isDistrictUnlocked = safeUnlockedDistricts.includes(c.districtId);
            const isSelected = selectedCase?.id === c.id;

            if (selectedDistrict && selectedDistrict !== c.districtId) return null;

            return (
              <div
                key={c.id}
                id={`map-marker-${c.id}`}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                } ${!isDistrictUnlocked ? 'opacity-50 grayscale' : ''}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  soundEngine.playClick();
                  if (isDistrictUnlocked) {
                    setSelectedCase(c);
                  }
                }}
              >
                <div className="relative flex flex-col items-center">
                  {!isCompleted && isDistrictUnlocked && (
                    <span className="absolute -inset-1 rounded-full bg-red-500/60 animate-ping" />
                  )}

                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-2xl border-2 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-900 border-emerald-400 text-emerald-200'
                        : isDistrictUnlocked
                        ? 'bg-gradient-to-br from-red-600 to-amber-700 border-yellow-300 text-yellow-100'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Star className="w-3.5 h-3.5 fill-emerald-300 text-emerald-200" />
                    ) : !isDistrictUnlocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-200 animate-pulse" />
                    )}
                  </div>

                  <div className="mt-0.5 max-w-[95px] truncate text-center px-1.5 py-0.2 rounded bg-slate-950/90 border border-slate-800 text-[9px] sm:text-[10px] font-medium text-amber-100 shadow-md">
                    {c.client.name.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Case Preview Sidebar Card (Landscape-friendly) */}
      {selectedCase && (
        <div 
          className="absolute right-3 top-12 bottom-3 w-80 sm:w-88 bg-gradient-to-b from-slate-900/95 via-slate-900/95 to-slate-950/98 border-2 border-amber-500/50 rounded-2xl p-3 shadow-2xl z-40 text-amber-50 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                Дело #{selectedCase.caseNumber} • {getDifficultyRu(selectedCase.difficulty)}
              </span>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-start gap-2.5">
              <ClientPortrait
                client={selectedCase.client}
                size="sm"
                expression="worried"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-amber-100 truncate">
                  {selectedCase.title}
                </h4>
                <div className="text-[11px] text-amber-300/90 font-medium">
                  {selectedCase.client.name}
                </div>
                <div className="flex items-center gap-2.5 mt-1.5 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Coins className="w-3 h-3" /> +{selectedCase.rewardCoins}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Star className="w-3 h-3 fill-yellow-400" /> +{selectedCase.rewardStars}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-3 mt-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              «{selectedCase.client.description}»
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="text-[10px] text-slate-400 truncate flex-1">
              <span className="text-amber-300 font-semibold">Цель:</span> {selectedCase.client.lostItemName}
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectCase(selectedCase);
              }}
              id="btn-accept-case"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs tracking-wider flex items-center gap-1 shadow-lg border border-amber-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>ПРИНЯТЬ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
