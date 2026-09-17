import React from 'react';

// =========================================================================
// 2D MODEL: STEAM BOILER & COPPER PIPES SYSTEM (ПАРОПРОВОД С МАНОМЕТРОМ)
// =========================================================================
export interface SteamBoilerProps {
  isValveTurned?: boolean;
  onTurnValve?: () => void;
}

export const SteamBoilerModel: React.FC<SteamBoilerProps> = ({
  isValveTurned = false,
  onTurnValve,
}) => {
  return (
    <div className="absolute top-10 left-0 right-0 h-16 pointer-events-none select-none z-10">
      {/* Overhead Copper Steam Pipes */}
      <svg viewBox="0 0 1000 64" className="w-full h-full" preserveAspectRatio="none" fill="none">
        <defs>
          {/* Copper Gradient */}
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="85%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          {/* Brass Flange Gradient */}
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          {/* Iron Shadow */}
          <filter id="pipeShadow" x="-5%" y="-10%" width="110%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Secondary Upper Thin Pipe */}
        <rect x="0" y="4" width="1000" height="6" fill="url(#copperGrad)" filter="url(#pipeShadow)" />
        
        {/* Main High-Pressure Steam Pipe */}
        <rect x="0" y="16" width="1000" height="24" fill="url(#copperGrad)" filter="url(#pipeShadow)" />
        {/* Specular Pipe Highlight Reflection */}
        <line x1="0" y1="20" x2="1000" y2="20" stroke="#fef3c7" strokeWidth="2" opacity="0.6" />

        {/* Flanges & Riveted Collar Bands */}
        {[120, 260, 480, 680, 850].map((x) => (
          <g key={x}>
            <rect x={x - 6} y="13" width="12" height="30" rx="2" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
            <circle cx={x} cy="18" r="1.5" fill="#451a03" />
            <circle cx={x} cy="38" r="1.5" fill="#451a03" />
          </g>
        ))}

        {/* Vertical T-Junction Pipe to Boiler */}
        <rect x="475" y="38" width="22" height="30" fill="url(#copperGrad)" />
      </svg>

      {/* Steampunk Brass Pressure Gauge with Vibrating Indicator & Interactive Valve */}
      <div className="absolute left-[47.5%] top-4 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 via-amber-600 to-amber-950 p-1 shadow-2xl border border-amber-950 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full rounded-full bg-[#fef3c7] border border-stone-800 shadow-inner relative flex items-center justify-center overflow-hidden">
          {/* Gauge Dial Markings */}
          <div className="absolute inset-1 rounded-full border border-stone-400 opacity-60 border-dashed" />
          <div className="absolute top-1 text-[6px] font-mono font-bold text-red-800">PSI</div>
          <div className="absolute left-1.5 text-[5px] font-mono font-bold text-stone-700">0</div>
          <div className="absolute right-1.5 text-[5px] font-mono font-bold text-red-700">120</div>

          {/* Twitching Gauge Needle */}
          <div
            className="absolute w-0.5 h-4.5 bg-red-700 origin-bottom rounded-full shadow transition-transform duration-500"
            style={{
              bottom: '50%',
              transform: isValveTurned ? 'rotate(10deg)' : 'rotate(68deg)',
            }}
          />
          <div className="w-2 h-2 rounded-full bg-amber-700 border border-stone-900 z-10" />
        </div>

        {/* Interactive Pressure Release Valve Wheel (Кликабельный маховик вентиля) */}
        <button
          onClick={onTurnValve}
          className={`group/valve absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-4 flex items-center justify-center cursor-pointer transition-transform duration-300 ${
            isValveTurned ? 'rotate-180' : 'rotate-0 hover:scale-115'
          }`}
          title="Кликните, чтобы повернуть паровой вентиль"
        >
          <div className="w-6 h-2.5 bg-gradient-to-r from-red-800 via-red-600 to-red-900 rounded-full border border-amber-300 shadow-[0_0_6px_rgba(239,68,68,0.6)] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-yellow-300" />
          </div>
          
          {/* Hover Action Tooltip */}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/valve:opacity-100 transition-opacity bg-black/90 text-[9px] font-serif text-amber-200 px-1.5 py-0.5 rounded border border-amber-600/50 pointer-events-none z-50">
            {isValveTurned ? 'Вентиль открыт' : 'Повернуть вентиль'}
          </span>
        </button>
      </div>

      {/* Animated Steam Plumes from Exhaust Vents */}
      <div className="absolute left-[48%] top-0 -translate-x-1/2 pointer-events-none">
        <div className={`w-10 h-10 rounded-full bg-white/30 blur-md ${isValveTurned ? 'animate-ping' : 'animate-pulse'}`} style={{ animationDuration: isValveTurned ? '1.2s' : '2.5s' }} />
        <div className="w-16 h-12 rounded-full bg-white/15 blur-lg animate-pulse" style={{ animationDuration: '1.8s' }} />
      </div>
      <div className="absolute left-[26%] top-2 pointer-events-none">
        <div className="w-6 h-6 rounded-full bg-white/20 blur-sm animate-ping" style={{ animationDuration: '3.2s' }} />
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: VICTORIAN CAST-IRON POTBELLY STOVE (ЧУГУННАЯ ПЕЧЬ С ДВЕРЦЕЙ)
// =========================================================================
export interface VictorianStoveProps {
  isDoorOpen?: boolean;
  onToggleDoor?: () => void;
}

export const VictorianStoveModel: React.FC<VictorianStoveProps> = ({
  isDoorOpen = false,
  onToggleDoor,
}) => {
  return (
    <div className="absolute bottom-12 left-[36%] sm:left-[38%] w-44 sm:w-52 h-64 pointer-events-none select-none z-10">
      <svg viewBox="0 0 160 220" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="stoveIron" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="35%" stopColor="#3f3f46" />
            <stop offset="65%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <linearGradient id="stoveBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id="fireGlow" cx="50%" cy="70%" r="65%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="65%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
        </defs>

        {/* Flue Chimney Pipe heading up */}
        <rect x="68" y="0" width="24" height="60" fill="url(#stoveIron)" stroke="#09090b" strokeWidth="1" />
        <line x1="68" y1="20" x2="92" y2="20" stroke="#52525b" strokeWidth="2" />
        <line x1="68" y1="40" x2="92" y2="40" stroke="#52525b" strokeWidth="2" />

        {/* Stove Top Lid & Brass Finial */}
        <ellipse cx="80" cy="62" rx="42" ry="12" fill="url(#stoveIron)" stroke="#52525b" strokeWidth="1" />
        <circle cx="80" cy="55" r="4" fill="url(#stoveBrass)" stroke="#451a03" strokeWidth="1" />

        {/* Main Cylindrical Cast-Iron Potbelly Body */}
        <path d="M 38 62 C 38 62 26 100 26 140 C 26 170 36 185 80 185 C 124 185 134 170 134 140 C 134 100 122 62 122 62 Z" fill="url(#stoveIron)" stroke="#09090b" strokeWidth="2" />

        {/* Victorian Relief Filigree on Cast Iron */}
        <path d="M 45 90 Q 80 100 115 90" stroke="#52525b" strokeWidth="2" fill="none" />
        <path d="M 45 170 Q 80 178 115 170" stroke="#52525b" strokeWidth="2" fill="none" />

        {/* Arched Hearth Firebox Door Opening Interior */}
        <rect x="48" y="105" width="64" height="60" rx="8" fill="#0c0a09" stroke="#52525b" strokeWidth="2" />

        {/* Firebox Interior with Glowing Fire Bed & Embers */}
        <rect x="52" y="110" width="56" height="50" rx="6" fill="url(#fireGlow)" />

        {/* Cast Iron Curved Cabriole Legs */}
        {/* Left Leg */}
        <path d="M 38 180 Q 20 195 24 215 L 34 215 Q 36 195 48 184 Z" fill="url(#stoveIron)" stroke="#09090b" strokeWidth="1" />
        {/* Center Leg */}
        <rect x="76" y="185" width="8" height="28" fill="url(#stoveIron)" />
        {/* Right Leg */}
        <path d="M 122 180 Q 140 195 136 215 L 126 215 Q 124 195 112 184 Z" fill="url(#stoveIron)" stroke="#09090b" strokeWidth="1" />

        {/* Hearth Floor Plate with Glow */}
        <ellipse cx="80" cy="216" rx="60" ry="4" fill="#09090b" />
      </svg>

      {/* Dynamic Animated Flame Core Overlay */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-14 h-12 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-yellow-300/80 blur-[2px] animate-pulse" />
        <div className="absolute -top-1 w-6 h-8 bg-gradient-to-t from-orange-500 to-yellow-200 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '1.2s' }} />
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE CAST-IRON STOVE DOOR (РАСПАХИВАЮЩАЯСЯ ДВЕРЦА)     */}
      {/* ============================================================ */}
      <div 
        onClick={onToggleDoor}
        className={`group/stove absolute top-[47%] left-[30%] w-[40%] h-[28%] pointer-events-auto cursor-pointer transition-all duration-500 origin-left ${
          isDoorOpen 
            ? '-rotate-y-85 -translate-x-3 shadow-[-8px_0_16px_rgba(0,0,0,0.8)] opacity-95' 
            : 'rotate-y-0 shadow-md hover:brightness-115'
        }`}
        style={{ perspective: '600px' }}
        title={isDoorOpen ? 'Кликните, чтобы закрыть дверцу печи' : 'Кликните, чтобы открыть дверцу печи (Масяня-стайл)'}
      >
        <svg viewBox="0 0 64 60" className="w-full h-full drop-shadow-md">
          {/* Iron Door Panel with Lattice Grate */}
          <rect x="2" y="2" width="60" height="56" rx="6" fill="#202024" stroke="#52525b" strokeWidth="2.5" />
          
          {/* Iron Grate Bars */}
          <line x1="8" y1="16" x2="56" y2="16" stroke="#09090b" strokeWidth="2.5" />
          <line x1="8" y1="30" x2="56" y2="30" stroke="#09090b" strokeWidth="2.5" />
          <line x1="8" y1="44" x2="56" y2="44" stroke="#09090b" strokeWidth="2.5" />
          <line x1="20" y1="6" x2="20" y2="54" stroke="#09090b" strokeWidth="2" />
          <line x1="32" y1="6" x2="32" y2="54" stroke="#09090b" strokeWidth="2" />
          <line x1="44" y1="6" x2="44" y2="54" stroke="#09090b" strokeWidth="2" />

          {/* Brass Door Hinges on left */}
          <circle cx="5" cy="14" r="3" fill="#f59e0b" stroke="#451a03" strokeWidth="0.8" />
          <circle cx="5" cy="46" r="3" fill="#f59e0b" stroke="#451a03" strokeWidth="0.8" />

          {/* Brass Latch Handle on right */}
          <path d="M 52 28 L 61 30 L 59 36" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        {/* Hover Action Indicator Badge */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/stove:opacity-100 transition-opacity bg-black/90 text-[9px] font-serif text-amber-200 px-2 py-0.5 rounded border border-amber-600/50 pointer-events-none z-50">
          {isDoorOpen ? 'Закрыть печь' : 'Открыть печь'}
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: APOTHECARY & WINEMAKER SHELVING RACK (ВИННЫЕ ПОЛКИ И СКЛЯНКИ)
// =========================================================================
export const ApothecaryShelvesModel: React.FC = () => {
  return (
    <div className="absolute top-24 right-0 w-[45%] bottom-10 pointer-events-none select-none z-10">
      <svg viewBox="0 0 320 400" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="oakWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="40%" stopColor="#59250c" />
            <stop offset="85%" stopColor="#3e1707" />
            <stop offset="100%" stopColor="#240c03" />
          </linearGradient>
          {/* Glass Bottles Gradients */}
          <linearGradient id="greenGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="cobaltGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Heavy Oak Upright Pillars */}
        <rect x="40" y="20" width="14" height="370" fill="url(#oakWood)" stroke="#1a0a04" strokeWidth="1.5" />
        <rect x="290" y="20" width="14" height="370" fill="url(#oakWood)" stroke="#1a0a04" strokeWidth="1.5" />

        {/* Shelf Tier 1 (Top) */}
        <rect x="20" y="70" width="295" height="14" fill="url(#oakWood)" stroke="#1a0a04" strokeWidth="1.5" />
        {/* Corked Flasks & Bottles on Shelf 1 */}
        {[
          { x: 60, color: 'url(#greenGlass)', h: 42, w: 14 },
          { x: 80, color: 'url(#amberGlass)', h: 36, w: 12 },
          { x: 98, color: 'url(#cobaltGlass)', h: 40, w: 15 },
          { x: 120, color: 'url(#greenGlass)', h: 44, w: 14 },
          { x: 140, color: 'url(#amberGlass)', h: 38, w: 13 },
          { x: 180, color: 'url(#cobaltGlass)', h: 42, w: 16 },
          { x: 205, color: 'url(#greenGlass)', h: 44, w: 14 },
          { x: 225, color: 'url(#greenGlass)', h: 40, w: 14 },
          { x: 245, color: 'url(#amberGlass)', h: 36, w: 12 },
        ].map((b, i) => (
          <g key={i}>
            {/* Bottle Body */}
            <rect x={b.x} y={70 - b.h} width={b.w} height={b.h} rx="2" fill={b.color} stroke="#0f172a" strokeWidth="0.8" />
            {/* Neck */}
            <rect x={b.x + b.w / 2 - 2.5} y={70 - b.h - 8} width="5" height="9" fill={b.color} />
            {/* Cork */}
            <rect x={b.x + b.w / 2 - 2} y={70 - b.h - 11} width="4" height="4" rx="0.5" fill="#d97706" />
            {/* Specular Highlight */}
            <line x1={b.x + 3} y1={70 - b.h + 3} x2={b.x + 3} y2={70 - 4} stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          </g>
        ))}

        {/* Shelf Tier 2 (Middle) */}
        <rect x="15" y="160" width="300" height="14" fill="url(#oakWood)" stroke="#1a0a04" strokeWidth="1.5" />
        
        {/* Brass Apothecary Scales on Shelf 2 */}
        <g transform="translate(130, 95)">
          <rect x="23" y="10" width="4" height="52" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <line x1="5" y1="16" x2="45" y2="16" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="25" cy="16" r="3" fill="#fef08a" />
          {/* Left Pan */}
          <line x1="6" y1="16" x2="1" y2="35" stroke="#b45309" strokeWidth="1" />
          <line x1="6" y1="16" x2="11" y2="35" stroke="#b45309" strokeWidth="1" />
          <path d="M 0 35 Q 6 42 12 35 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
          {/* Right Pan */}
          <line x1="44" y1="16" x2="39" y2="32" stroke="#b45309" strokeWidth="1" />
          <line x1="44" y1="16" x2="49" y2="32" stroke="#b45309" strokeWidth="1" />
          <path d="M 38 32 Q 44 39 50 32 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
        </g>

        {/* Shelf Tier 3 (Lower) */}
        <rect x="10" y="260" width="305" height="16" fill="url(#oakWood)" stroke="#1a0a04" strokeWidth="1.5" />

        {/* Bottom Oak Cask / Barrel in Cellar Corner */}
        <g transform="translate(160, 275)">
          <ellipse cx="70" cy="65" rx="55" ry="42" fill="url(#oakWood)" stroke="#1c0c05" strokeWidth="2" />
          {/* Iron Hoops */}
          <ellipse cx="70" cy="65" rx="55" ry="42" stroke="#475569" strokeWidth="6" strokeDasharray="30 180" fill="none" />
          <ellipse cx="70" cy="65" rx="55" ry="42" stroke="#1e293b" strokeWidth="5" strokeDasharray="25 185" fill="none" />
          {/* Brass Spigot / Tap */}
          <rect x="15" y="60" width="10" height="6" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
          <rect x="18" y="55" width="4" height="14" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
};

// =========================================================================
// 2D MODEL: GOTHIC CELLAR ARCHWAY & WINDOW (ГОТИЧЕСКАЯ АРКА С ПОРТЬЕРОЙ)
// =========================================================================
export interface GothicArchwayProps {
  isCurtainOpen?: boolean;
  onToggleCurtain?: () => void;
}

export const GothicArchwayModel: React.FC<GothicArchwayProps> = ({
  isCurtainOpen = false,
  onToggleCurtain,
}) => {
  return (
    <div className="absolute top-16 left-8 w-44 h-96 pointer-events-none select-none z-10">
      <svg viewBox="0 0 160 320" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="moonlightBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Arched Stone Wall Aperture */}
        <path d="M 20 320 L 20 80 C 20 25 80 10 80 10 C 80 10 140 25 140 80 L 140 320 Z" fill="#090807" stroke="#262626" strokeWidth="6" />

        {/* Iron Cellar Bars */}
        <line x1="45" y1="50" x2="45" y2="300" stroke="#404040" strokeWidth="4" />
        <line x1="80" y1="20" x2="80" y2="300" stroke="#404040" strokeWidth="4" />
        <line x1="115" y1="50" x2="115" y2="300" stroke="#404040" strokeWidth="4" />
        {/* Crossbar with Rivets */}
        <line x1="20" y1="120" x2="140" y2="120" stroke="#404040" strokeWidth="5" />
        <circle cx="45" cy="120" r="2.5" fill="#737373" />
        <circle cx="80" cy="120" r="2.5" fill="#737373" />
        <circle cx="115" cy="120" r="2.5" fill="#737373" />

        {/* Ethereal Moonlight Diagonal Beam */}
        <polygon points="50,40 120,40 220,320 80,320" fill="url(#moonlightBeam)" />
      </svg>

      {/* ============================================================ */}
      {/* INTERACTIVE VELVET CURTAIN & BRASS ROD (БАРХАТНАЯ ПОРТЬЕРА) */}
      {/* ============================================================ */}
      {/* Brass Curtain Rod */}
      <div className="absolute top-14 left-2 right-2 h-2.5 bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-800 rounded-full border border-amber-950 shadow-md z-20 pointer-events-none">
        <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-amber-500 border border-stone-900" />
        <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-amber-500 border border-stone-900" />
      </div>

      {/* The Heavy Victorian Red Velvet Curtain (Отодвигаемая портьера) */}
      <div
        onClick={onToggleCurtain}
        className={`group/curtain absolute top-16 left-3 w-[88%] h-[74%] pointer-events-auto cursor-pointer transition-all duration-500 origin-left z-20 ${
          isCurtainOpen
            ? 'scale-x-[0.24] translate-x-1 shadow-[-4px_0_12px_rgba(0,0,0,0.85)]'
            : 'scale-x-100 shadow-[4px_6px_20px_rgba(0,0,0,0.9)] hover:brightness-110'
        }`}
        title={isCurtainOpen ? 'Кликните, чтобы задвинуть штору' : 'Кликните, чтобы отодвинуть портьеру (как в Масяне)'}
      >
        <svg viewBox="0 0 140 240" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="18%" stopColor="#991b1b" />
              <stop offset="35%" stopColor="#5f0f15" />
              <stop offset="55%" stopColor="#b91c1c" />
              <stop offset="75%" stopColor="#450a0a" />
              <stop offset="90%" stopColor="#881337" />
              <stop offset="100%" stopColor="#35070a" />
            </linearGradient>
            <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Curtain Rings on Rod */}
          {[15, 35, 60, 85, 110, 130].map((rx) => (
            <ellipse key={rx} cx={rx} cy="5" rx="5" ry="4" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          ))}

          {/* Heavy Draped Velvet Curtain Body */}
          <path
            d="M 5 6 Q 35 12 70 8 Q 105 12 135 6 L 135 230 Q 105 235 70 228 Q 35 235 5 230 Z"
            fill="url(#velvetGrad)"
            stroke="#1c0305"
            strokeWidth="1.5"
          />

          {/* Deep Vertical Velvet Folds (Рельеф складок) */}
          <path d="M 28 6 Q 25 120 32 230" stroke="#2a0507" strokeWidth="4" fill="none" opacity="0.8" />
          <path d="M 32 6 Q 30 120 36 230" stroke="#f87171" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M 65 8 Q 60 120 68 228" stroke="#2a0507" strokeWidth="4" fill="none" opacity="0.8" />
          <path d="M 68 8 Q 64 120 72 228" stroke="#f87171" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M 102 6 Q 98 120 106 232" stroke="#2a0507" strokeWidth="4" fill="none" opacity="0.8" />
          <path d="M 105 6 Q 102 120 110 232" stroke="#f87171" strokeWidth="1" fill="none" opacity="0.3" />

          {/* Gold Filigree Bottom Hem Trim */}
          <path d="M 5 224 Q 35 230 70 222 Q 105 230 135 224" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
          
          {/* Gold Tassel Tieback Rope */}
          {!isCurtainOpen && (
            <g transform="translate(15, 120)">
              <path d="M 0 10 Q 55 25 110 10" stroke="url(#goldTrimGrad)" strokeWidth="3" strokeDasharray="4 2" fill="none" />
              {/* Gold Hanging Tassel */}
              <circle cx="105" cy="18" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
              <path d="M 103 22 L 100 40 L 110 40 L 107 22 Z" fill="url(#goldTrimGrad)" stroke="#78350f" strokeWidth="0.8" />
            </g>
          )}
        </svg>

        {/* Hover Action Indicator Badge */}
        <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/curtain:opacity-100 transition-opacity bg-black/95 text-[9px] font-serif text-amber-200 px-2 py-0.5 rounded border border-amber-600/60 pointer-events-none z-50 shadow-lg">
          {isCurtainOpen ? 'Задвинуть штору' : 'Отодвинуть штору'}
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: WORKBENCH & KEROSENE HURRICANE LANTERN (ВЕРСТАК И КЕРОСИНОВАЯ ЛАМПА)
// =========================================================================
export const WorkbenchModel: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none select-none z-15">
      {/* Heavy Timber Ledge Table */}
      <div className="w-full h-full bg-gradient-to-b from-[#33180b] via-[#241006] to-[#120703] border-t-4 border-[#522510] shadow-[0_-8px_20px_rgba(0,0,0,0.8)] relative">
        
        {/* Brass Hurricane Lantern on table */}
        <div className="absolute -top-24 left-16 w-14 h-24">
          <svg viewBox="0 0 60 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="brassLantern" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Carrying Wire Loop */}
            <path d="M 15 25 C 15 5 45 5 45 25" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            
            {/* Top Cap Chimney */}
            <rect x="22" y="16" width="16" height="12" rx="2" fill="url(#brassLantern)" stroke="#451a03" strokeWidth="1" />
            <ellipse cx="30" cy="16" rx="10" ry="3" fill="url(#brassLantern)" />

            {/* Glass Globe with Glowing Wick Flame */}
            <ellipse cx="30" cy="50" rx="15" ry="22" fill="#fef3c7" fillOpacity="0.4" stroke="#d97706" strokeWidth="1" />
            {/* Warm flame inside */}
            <ellipse cx="30" cy="54" rx="4" ry="7" fill="#f97316" />
            <ellipse cx="30" cy="53" rx="2" ry="4" fill="#fef08a" />

            {/* Brass Base Fuel Tank */}
            <rect x="18" y="72" width="24" height="16" rx="3" fill="url(#brassLantern)" stroke="#451a03" strokeWidth="1" />
            <ellipse cx="30" cy="88" rx="18" ry="4" fill="url(#brassLantern)" />
          </svg>

          {/* Warm Radial Glow Ambient Halo */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 -translate-y-1/2 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        </div>

        {/* Vintage Desk Parchment & Ink Bottle */}
        <div className="absolute -top-6 left-36 opacity-75">
          <svg viewBox="0 0 80 40" className="w-20 h-10" fill="none">
            {/* Rolled Parchment */}
            <rect x="10" y="15" width="55" height="14" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <line x1="16" y1="20" x2="58" y2="20" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
            <line x1="16" y1="24" x2="52" y2="24" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
            {/* Glass Inkwell */}
            <rect x="68" y="16" width="10" height="12" rx="1.5" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
            {/* Goose Quill Feather */}
            <path d="M 72 16 Q 82 2 88 0 Q 82 10 74 18" stroke="#f8fafc" strokeWidth="1.2" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: ATMOSPHERIC PARTICLES & DUST MOTES (ВИТАЮЩИЕ ПЫЛИНКИ В СВЕТЕ)
// =========================================================================
export const AtmosphereDustMotes: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      {/* Golden Dust Motes drifting in light rays */}
      {[
        { x: '24%', y: '35%', delay: '0s', dur: '4s', s: 2 },
        { x: '28%', y: '52%', delay: '1s', dur: '5s', s: 3 },
        { x: '35%', y: '28%', delay: '2s', dur: '4.5s', s: 2.5 },
        { x: '55%', y: '40%', delay: '0.5s', dur: '3.8s', s: 2 },
        { x: '62%', y: '65%', delay: '1.5s', dur: '6s', s: 3.5 },
        { x: '75%', y: '30%', delay: '2.5s', dur: '5.2s', s: 2 },
        { x: '82%', y: '55%', delay: '3s', dur: '4s', s: 2.5 },
      ].map((p, idx) => (
        <div
          key={idx}
          style={{
            left: p.x,
            top: p.y,
            width: `${p.s}px`,
            height: `${p.s}px`,
            animation: `pulse ${p.dur} infinite ease-in-out ${p.delay}`,
          }}
          className="absolute rounded-full bg-amber-200/60 shadow-[0_0_6px_#fef08a]"
        />
      ))}

      {/* Spiderweb in Upper Left Corner */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="#cbd5e1" strokeWidth="0.7">
          <path d="M 0 0 L 100 0 M 0 0 L 70 70 M 0 0 L 0 100" />
          <path d="M 0 25 Q 20 20 25 0" />
          <path d="M 0 50 Q 40 40 50 0" />
          <path d="M 0 75 Q 60 60 75 0" />
          <path d="M 0 100 Q 80 80 100 0" />
        </svg>
      </div>

      {/* Spiderweb in Upper Right Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-30 scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="#cbd5e1" strokeWidth="0.7">
          <path d="M 0 0 L 100 0 M 0 0 L 70 70 M 0 0 L 0 100" />
          <path d="M 0 35 Q 30 30 35 0" />
          <path d="M 0 70 Q 60 60 70 0" />
        </svg>
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: VICTORIAN CELLAR FLOOR (ДОЩАТЫЙ ПОЛ ПОГРЕБА С ТЕНЯМИ И БЛИКАМИ)
// =========================================================================
export const VictorianCellarFloor: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[22%] pointer-events-none select-none z-5 overflow-hidden">
      <svg viewBox="0 0 1000 220" className="w-full h-full" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="plankGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#24140b" />
            <stop offset="60%" stopColor="#1a0e07" />
            <stop offset="100%" stopColor="#100804" />
          </linearGradient>
          <linearGradient id="plankGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1a0e" />
            <stop offset="60%" stopColor="#1f1109" />
            <stop offset="100%" stopColor="#120904" />
          </linearGradient>
          <linearGradient id="fireFloorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0" />
            <stop offset="45%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base floor bed */}
        <rect x="0" y="0" width="1000" height="220" fill="#120904" />

        {/* Perspective Oak Decking Planks */}
        {[
          { y: 0, h: 28, grad: 'url(#plankGrad1)' },
          { y: 28, h: 32, grad: 'url(#plankGrad2)' },
          { y: 60, h: 38, grad: 'url(#plankGrad1)' },
          { y: 98, h: 44, grad: 'url(#plankGrad2)' },
          { y: 142, h: 78, grad: 'url(#plankGrad1)' },
        ].map((plank, idx) => (
          <g key={idx}>
            <rect x="0" y={plank.y} width="1000" height={plank.h} fill={plank.grad} />
            {/* Plank Boundary Gap & Shadow */}
            <line x1="0" y1={plank.y} x2="1000" y2={plank.y} stroke="#080402" strokeWidth="2.5" />
            <line x1="0" y1={plank.y + 1} x2="1000" y2={plank.y + 1} stroke="#451a03" strokeWidth="0.8" opacity="0.5" />
            
            {/* Vertical Seams between Planks with Square Wrought Nails */}
            {[180, 420, 680, 890].map((xOffset) => {
              const seamX = (xOffset + idx * 80) % 960 + 20;
              return (
                <g key={seamX}>
                  <line x1={seamX} y1={plank.y} x2={seamX} y2={plank.y + plank.h} stroke="#090503" strokeWidth="1.5" />
                  {/* Square forged nails */}
                  <rect x={seamX - 6} y={plank.y + 5} width="2.5" height="2.5" fill="#3f3f46" stroke="#09090b" strokeWidth="0.5" />
                  <rect x={seamX + 4} y={plank.y + 5} width="2.5" height="2.5" fill="#3f3f46" stroke="#09090b" strokeWidth="0.5" />
                  <rect x={seamX - 6} y={plank.y + plank.h - 8} width="2.5" height="2.5" fill="#3f3f46" stroke="#09090b" strokeWidth="0.5" />
                  <rect x={seamX + 4} y={plank.y + plank.h - 8} width="2.5" height="2.5" fill="#3f3f46" stroke="#09090b" strokeWidth="0.5" />
                </g>
              );
            })}
          </g>
        ))}

        {/* Warm Ember & Hearth Reflection Wash on Wooden Floor */}
        <ellipse cx="460" cy="80" rx="220" ry="60" fill="url(#fireFloorGlow)" />
      </svg>
    </div>
  );
};

// =========================================================================
// 2D MODEL: WALL CANDLE SCONCE (КОВАНОЕ БРА СО СВЕЧОЙ НА СТЕНЕ)
// =========================================================================
export const WallCandleSconceModel: React.FC = () => {
  return (
    <div className="absolute top-28 left-[24%] w-10 h-24 pointer-events-none select-none z-12">
      <svg viewBox="0 0 40 100" className="w-full h-full" fill="none">
        {/* Forged Wrought-Iron Wall Mount Plate */}
        <path d="M 18 20 C 18 10 22 10 22 20 L 22 70 C 22 80 18 80 18 70 Z" fill="#18181b" stroke="#09090b" strokeWidth="1" />
        <circle cx="20" cy="18" r="2" fill="#52525b" />
        <circle cx="20" cy="72" r="2" fill="#52525b" />

        {/* Curved Iron Arm */}
        <path d="M 20 45 Q 32 48 30 35 L 28 35" stroke="#27272a" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Candle Cup & Drip Pan */}
        <ellipse cx="28" cy="35" rx="8" ry="2.5" fill="#18181b" stroke="#09090b" strokeWidth="1" />
        
        {/* Beeswax Candle Body */}
        <rect x="25" y="16" width="6" height="19" rx="1" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" />
        {/* Melted Wax Drips */}
        <path d="M 25 22 Q 24 26 25 30" stroke="#fef3c7" strokeWidth="1.2" fill="none" />
        
        {/* Wick */}
        <line x1="28" y1="16" x2="28" y2="12" stroke="#451a03" strokeWidth="1" />

        {/* Flickering Candle Flame */}
        <ellipse cx="28" cy="9" rx="2.5" ry="4.5" fill="#f97316" />
        <ellipse cx="28" cy="8.5" rx="1.5" ry="3" fill="#fef08a" />
      </svg>

      {/* Warm Ambient Wall Light Halo */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 -translate-y-1/2 rounded-full bg-amber-500/20 blur-xl animate-pulse" style={{ animationDuration: '2.4s' }} />
    </div>
  );
};

// =========================================================================
// 2D MODEL: LONDON DOCKS CARGO CRATES (СТАРИННЫЕ ЯЩИКИ С ОТКИДНОЙ КРЫШКОЙ)
// =========================================================================
export interface LondonCratesProps {
  isCrateOpen?: boolean;
  onToggleCrate?: () => void;
}

export const LondonCratesModel: React.FC<LondonCratesProps> = ({
  isCrateOpen = false,
  onToggleCrate,
}) => {
  return (
    <div className="absolute bottom-8 left-3 w-36 h-28 pointer-events-none select-none z-12">
      <svg viewBox="0 0 140 110" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="crateWood1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#59250c" />
            <stop offset="100%" stopColor="#3b1708" />
          </linearGradient>
          <linearGradient id="crateWood2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="strawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>

        {/* Back Crate */}
        <rect x="35" y="10" width="60" height="50" rx="2" fill="url(#crateWood1)" stroke="#1c0b04" strokeWidth="1.5" />
        <line x1="35" y1="26" x2="95" y2="26" stroke="#1c0b04" strokeWidth="1" />
        <line x1="35" y1="42" x2="95" y2="42" stroke="#1c0b04" strokeWidth="1" />
        {/* Diagonal Brace */}
        <line x1="35" y1="10" x2="95" y2="60" stroke="#451a03" strokeWidth="2" opacity="0.7" />

        {/* Front Large Crate Main Box Base */}
        <rect x="5" y="45" width="75" height="60" rx="3" fill="url(#crateWood2)" stroke="#1c0b04" strokeWidth="2" />
        
        {/* Interior Straw Bed visible when open */}
        {isCrateOpen && (
          <g>
            <rect x="8" y="48" width="69" height="24" rx="2" fill="url(#strawGrad)" />
            {/* Straw pieces */}
            <line x1="12" y1="55" x2="28" y2="62" stroke="#fef08a" strokeWidth="1.2" />
            <line x1="30" y1="52" x2="52" y2="64" stroke="#fef9c3" strokeWidth="1.5" />
            <line x1="45" y1="50" x2="68" y2="58" stroke="#fef08a" strokeWidth="1.2" />
            <line x1="20" y1="62" x2="42" y2="54" stroke="#d97706" strokeWidth="1" />
          </g>
        )}

        <line x1="5" y1="65" x2="80" y2="65" stroke="#1c0b04" strokeWidth="1.2" />
        <line x1="5" y1="85" x2="80" y2="85" stroke="#1c0b04" strokeWidth="1.2" />
        
        {/* Stencil Label on Crate */}
        <text x="14" y="78" fill="#fef08a" opacity="0.6" fontSize="7" fontFamily="serif" fontWeight="bold" letterSpacing="0.8">
          LONDON 1888
        </text>
        <text x="14" y="95" fill="#fef08a" opacity="0.5" fontSize="6" fontFamily="sans-serif" fontWeight="bold">
          SCOTLAND YD
        </text>

        {/* Iron Corner Brackets */}
        <rect x="5" y="45" width="8" height="8" fill="#18181b" stroke="#09090b" strokeWidth="0.5" />
        <rect x="72" y="45" width="8" height="8" fill="#18181b" stroke="#09090b" strokeWidth="0.5" />
        <rect x="5" y="97" width="8" height="8" fill="#18181b" stroke="#09090b" strokeWidth="0.5" />
        <rect x="72" y="97" width="8" height="8" fill="#18181b" stroke="#09090b" strokeWidth="0.5" />

        {/* Rope Handle */}
        <path d="M 75 70 Q 84 75 75 80" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>

      {/* ============================================================ */}
      {/* INTERACTIVE CRATE HINGED LID (ОТКИДНАЯ КРЫШКА ЯЩИКА)          */}
      {/* ============================================================ */}
      <div
        onClick={onToggleCrate}
        className={`group/crate absolute top-[36%] left-[2%] w-[58%] h-[26%] pointer-events-auto cursor-pointer transition-all duration-500 origin-top-left z-20 ${
          isCrateOpen
            ? '-rotate-45 -translate-y-5 translate-x-3 shadow-[-6px_4px_14px_rgba(0,0,0,0.85)] opacity-95'
            : 'rotate-0 shadow-md hover:brightness-115'
        }`}
        title={isCrateOpen ? 'Кликните, чтобы закрыть крышку ящика' : 'Кликните, чтобы откинуть крышку ящика (Масяня)'}
      >
        <svg viewBox="0 0 80 26" className="w-full h-full drop-shadow-md">
          {/* Heavy Wooden Lid Planks */}
          <rect x="1" y="2" width="78" height="22" rx="2" fill="url(#crateWood1)" stroke="#1c0b04" strokeWidth="1.8" />
          <line x1="2" y1="12" x2="78" y2="12" stroke="#1c0b04" strokeWidth="1" />
          {/* Wrought Iron Fastening Cleats */}
          <rect x="12" y="1" width="6" height="24" rx="1" fill="#1c1917" stroke="#09090b" strokeWidth="0.8" />
          <rect x="62" y="1" width="6" height="24" rx="1" fill="#1c1917" stroke="#09090b" strokeWidth="0.8" />
          <circle cx="15" cy="6" r="1.5" fill="#a1a1aa" />
          <circle cx="15" cy="18" r="1.5" fill="#a1a1aa" />
          <circle cx="65" cy="6" r="1.5" fill="#a1a1aa" />
          <circle cx="65" cy="18" r="1.5" fill="#a1a1aa" />
        </svg>

        {/* Hover Action Indicator Badge */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/crate:opacity-100 transition-opacity bg-black/90 text-[9px] font-serif text-amber-200 px-2 py-0.5 rounded border border-amber-600/50 pointer-events-none z-50">
          {isCrateOpen ? 'Закрыть ящик' : 'Откинуть крышку'}
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// 2D MODEL: SECRET WALL SAFE BEHIND QUEEN VICTORIA PICTURE (ТАЙНИК В СТЕНЕ)
// =========================================================================
export interface SecretWallSafeProps {
  isPictureMoved?: boolean;
  onTogglePicture?: () => void;
}

export const SecretWallSafeModel: React.FC<SecretWallSafeProps> = ({
  isPictureMoved = false,
  onTogglePicture,
}) => {
  return (
    <div className="absolute top-[48%] left-[26%] w-16 h-20 pointer-events-none select-none z-15">
      {/* Brick Recess Safe Opening in Wall */}
      <div className="absolute inset-1 rounded-sm bg-[#0a0705] border-2 border-stone-900 shadow-[inset_0_3px_10px_rgba(0,0,0,0.95)] overflow-hidden flex items-center justify-center">
        {/* Dark brick cavity texture */}
        <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(to_bottom,#000_0px,#000_2px,transparent_2px,transparent_10px)]" />
        <div className="w-10 h-12 border border-amber-900/60 rounded-xs bg-[#140e0a] flex items-center justify-center shadow-inner">
          <div className="text-[7px] font-mono text-amber-500/80 font-bold">SAFE</div>
        </div>
      </div>

      {/* Movable Framed Picture of Queen Victoria on Wall */}
      <div
        onClick={onTogglePicture}
        className={`group/safe absolute inset-0 pointer-events-auto cursor-pointer transition-all duration-500 origin-top-left ${
          isPictureMoved
            ? 'rotate-[22deg] translate-x-11 -translate-y-2 shadow-[-8px_8px_16px_rgba(0,0,0,0.9)] opacity-95'
            : 'rotate-0 shadow-md hover:brightness-110'
        }`}
        title={isPictureMoved ? 'Вернуть портрет на место' : 'Кликните, чтобы сдвинуть картину и открыть тайник (Масяня)'}
      >
        <svg viewBox="0 0 45 56" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="goldFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Ornate Gold Picture Frame */}
          <rect x="2" y="2" width="41" height="52" rx="3" fill="url(#goldFrameGrad)" stroke="#451a03" strokeWidth="1.5" />
          <rect x="6" y="6" width="33" height="44" rx="1.5" fill="#1c1917" stroke="#78350f" strokeWidth="1" />

          {/* Picture Canvas: Queen Victoria Profile Silhouette */}
          <rect x="8" y="8" width="29" height="40" fill="#fef3c7" />
          <path
            d="M 22 13 C 18 13 16 16 16 20 C 16 23 18 25 19 28 C 17 31 15 36 14 42 L 31 42 C 30 36 28 31 26 28 C 27 25 29 23 29 20 C 29 16 27 13 22 13 Z"
            fill="#1c1917"
          />
          {/* Small Gold Crown */}
          <path d="M 18 13 L 20 10 L 22 12 L 24 10 L 26 13 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          
          {/* Victorian Hanging Wire */}
          <line x1="22" y1="2" x2="22" y2="-6" stroke="#fbbf24" strokeWidth="1" />
        </svg>

        {/* Hover Action Indicator Badge */}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/safe:opacity-100 transition-opacity bg-black/95 text-[9px] font-serif text-amber-200 px-2 py-0.5 rounded border border-amber-600/50 pointer-events-none z-50">
          {isPictureMoved ? 'Вернуть портрет' : 'Сдвинуть картину'}
        </span>
      </div>
    </div>
  );
};
