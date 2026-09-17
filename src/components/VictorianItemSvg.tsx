import React from 'react';

interface VictorianSvgProps {
  type: string;
  className?: string;
  color?: string;
  isInspecting?: boolean;
}

export const VictorianItemSvg: React.FC<VictorianSvgProps> = ({ 
  type, 
  className = "w-full h-full",
  isInspecting = false
}) => {
  const uniqueId = React.useId().replace(/:/g, '');

  switch (type) {
    case 'handcuffs':
      return (
        <svg viewBox="0 0 80 64" className={className} fill="none">
          <defs>
            <linearGradient id={`hc_steel_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id={`hc_dark_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id={`hc_rivet_${uniqueId}`} cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <filter id={`hc_glow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Left Cuff */}
          <g filter={`url(#hc_glow_${uniqueId})`}>
            {/* Outer Ring */}
            <circle cx="22" cy="32" r="18" stroke={`url(#hc_steel_${uniqueId})`} strokeWidth="4.5" fill={`url(#hc_dark_${uniqueId})`} />
            <circle cx="22" cy="32" r="12" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
            {/* Hinge & Lock Box */}
            <rect x="5" y="24" width="7" height="16" rx="2" fill={`url(#hc_steel_${uniqueId})`} stroke="#1e293b" strokeWidth="1" />
            <circle cx="8.5" cy="27" r="1.2" fill={`url(#hc_rivet_${uniqueId})`} />
            <circle cx="8.5" cy="37" r="1.2" fill={`url(#hc_rivet_${uniqueId})`} />
            {/* Keyhole */}
            <circle cx="22" cy="28" r="1.8" fill="#e2e8f0" />
            <polygon points="21,28 23,28 22.5,33 21.5,33" fill="#e2e8f0" />
          </g>

          {/* Connecting Chain Links (Sheffield Iron) */}
          <g filter={`url(#hc_glow_${uniqueId})`}>
            <ellipse cx="33" cy="32" rx="5" ry="3" stroke={`url(#hc_steel_${uniqueId})`} strokeWidth="2.5" fill="none" transform="rotate(-15 33 32)" />
            <ellipse cx="40" cy="32" rx="5" ry="3" stroke="#e2e8f0" strokeWidth="2.5" fill="none" transform="rotate(20 40 32)" />
            <ellipse cx="47" cy="32" rx="5" ry="3" stroke={`url(#hc_steel_${uniqueId})`} strokeWidth="2.5" fill="none" transform="rotate(-15 47 32)" />
            {/* Swivel ring link */}
            <circle cx="40" cy="32" r="2.2" stroke="#64748b" strokeWidth="1" fill="none" />
          </g>

          {/* Right Cuff */}
          <g filter={`url(#hc_glow_${uniqueId})`}>
            {/* Outer Ring */}
            <circle cx="58" cy="32" r="18" stroke={`url(#hc_steel_${uniqueId})`} strokeWidth="4.5" fill={`url(#hc_dark_${uniqueId})`} />
            <circle cx="58" cy="32" r="12" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
            {/* Hinge & Lock Box */}
            <rect x="68" y="24" width="7" height="16" rx="2" fill={`url(#hc_steel_${uniqueId})`} stroke="#1e293b" strokeWidth="1" />
            <circle cx="71.5" cy="27" r="1.2" fill={`url(#hc_rivet_${uniqueId})`} />
            <circle cx="71.5" cy="37" r="1.2" fill={`url(#hc_rivet_${uniqueId})`} />
            {/* Keyhole */}
            <circle cx="58" cy="28" r="1.8" fill="#e2e8f0" />
            <polygon points="57,28 59,28 58.5,33 57.5,33" fill="#e2e8f0" />
          </g>

          {/* High specular metallic highlights */}
          <path d="M 12 20 A 15 15 0 0 1 32 20" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" fill="none" />
          <path d="M 48 20 A 15 15 0 0 1 68 20" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" fill="none" />
        </svg>
      );

    case 'train':
      return (
        <svg viewBox="0 0 88 54" className={className} fill="none">
          <defs>
            <linearGradient id={`tr_boiler_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="80%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id={`tr_brass_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id={`tr_cab_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="50%" stopColor="#9d174d" />
              <stop offset="100%" stopColor="#500724" />
            </linearGradient>
          </defs>

          {/* Steam Cowcatcher */}
          <polygon points="12,42 22,26 22,42" fill={`url(#tr_brass_${uniqueId})`} stroke="#451a03" strokeWidth="1" />
          <line x1="14" y1="40" x2="22" y2="30" stroke="#fef08a" strokeWidth="1" />
          <line x1="17" y1="41" x2="22" y2="34" stroke="#fef08a" strokeWidth="1" />

          {/* Boiler Body */}
          <rect x="22" y="20" width="40" height="20" rx="4" fill={`url(#tr_boiler_${uniqueId})`} stroke="#475569" strokeWidth="1.5" />
          
          {/* Polished Brass Boiler Straps */}
          <line x1="28" y1="20" x2="28" y2="40" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2" />
          <line x1="40" y1="20" x2="40" y2="40" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2" />
          <line x1="52" y1="20" x2="52" y2="40" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2" />

          {/* Front Headlamp with Glowing Glass */}
          <rect x="14" y="22" width="8" height="7" rx="1.5" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="15" cy="25.5" r="2.8" fill="#fef08a" />
          <circle cx="15" cy="25.5" r="1.5" fill="#ffffff" />

          {/* Smokestack Chimney */}
          <path d="M 26 20 L 23 8 L 33 8 L 30 20 Z" fill={`url(#tr_brass_${uniqueId})`} stroke="#78350f" strokeWidth="1" />
          <ellipse cx="28" cy="8" rx="5" ry="1.5" fill="#451a03" stroke="#fef08a" strokeWidth="1" />

          {/* Steam Dome */}
          <path d="M 42 20 C 42 14 50 14 50 20 Z" fill={`url(#tr_brass_${uniqueId})`} stroke="#78350f" strokeWidth="1" />

          {/* Driver's Cabin */}
          <rect x="58" y="10" width="24" height="30" rx="2" fill={`url(#tr_cab_${uniqueId})`} stroke="#fbbf24" strokeWidth="1.5" />
          {/* Cabin Arched Windows with warm interior light */}
          <rect x="62" y="14" width="8" height="10" rx="1.5" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
          <rect x="72" y="14" width="7" height="10" rx="1.5" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
          <line x1="66" y1="14" x2="66" y2="24" stroke="#78350f" strokeWidth="0.8" />
          <line x1="62" y1="19" x2="70" y2="19" stroke="#78350f" strokeWidth="0.8" />

          {/* Wheels Assembly */}
          {/* Front Small Wheel */}
          <circle cx="26" cy="43" r="7" fill="#1e293b" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2" />
          <circle cx="26" cy="43" r="2.5" fill={`url(#tr_brass_${uniqueId})`} />
          {/* Middle Large Driving Wheel */}
          <circle cx="43" cy="42" r="9" fill="#1e293b" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2.5" />
          <circle cx="43" cy="42" r="3" fill={`url(#tr_brass_${uniqueId})`} />
          {/* Spokes */}
          <line x1="43" y1="34" x2="43" y2="50" stroke="#94a3b8" strokeWidth="1" />
          <line x1="35" y1="42" x2="51" y2="42" stroke="#94a3b8" strokeWidth="1" />
          {/* Rear Driving Wheel */}
          <circle cx="68" cy="42" r="9" fill="#1e293b" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="2.5" />
          <circle cx="68" cy="42" r="3" fill={`url(#tr_brass_${uniqueId})`} />
          <line x1="68" y1="34" x2="68" y2="50" stroke="#94a3b8" strokeWidth="1" />
          <line x1="60" y1="42" x2="76" y2="42" stroke="#94a3b8" strokeWidth="1" />

          {/* Golden Connecting Drive Rod */}
          <line x1="43" y1="42" x2="68" y2="42" stroke={`url(#tr_brass_${uniqueId})`} strokeWidth="3" strokeLinecap="round" />
          <circle cx="43" cy="42" r="1.5" fill="#f8fafc" />
          <circle cx="68" cy="42" r="1.5" fill="#f8fafc" />
        </svg>
      );

    case 'toy_soldier':
      return (
        <svg viewBox="0 0 44 72" className={className} fill="none">
          <defs>
            <linearGradient id={`ts_tunic_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id={`ts_gold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>

          {/* Bearskin Fur Cap */}
          <rect x="13" y="3" width="18" height="20" rx="4" fill="#09090b" stroke="#27272a" strokeWidth="1" />
          {/* Fur texture strokes */}
          <path d="M 14 5 Q 16 8 18 5 M 22 4 Q 24 7 26 4 M 15 12 Q 18 14 20 12" stroke="#3f3f46" strokeWidth="0.8" fill="none" />
          {/* Gold Chinstrap & Plume */}
          <path d="M 14 18 Q 22 23 30 18" stroke={`url(#ts_gold_${uniqueId})`} strokeWidth="1.5" fill="none" />
          <path d="M 13 14 L 9 8 L 13 9 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />

          {/* Face */}
          <ellipse cx="22" cy="24" rx="6.5" ry="5.5" fill="#fed7aa" stroke="#f97316" strokeWidth="0.5" />
          {/* Rosy Cheeks */}
          <circle cx="17.5" cy="25" r="1.5" fill="#f87171" opacity="0.6" />
          <circle cx="26.5" cy="25" r="1.5" fill="#f87171" opacity="0.6" />
          {/* Eyes */}
          <circle cx="19" cy="23" r="1" fill="#0f172a" />
          <circle cx="25" cy="23" r="1" fill="#0f172a" />
          {/* Groomed Victorian Mustache */}
          <path d="M 17 26 Q 22 28 27 26" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />

          {/* Scarlet Wool Tunic */}
          <rect x="12" y="29" width="20" height="22" rx="2.5" fill={`url(#ts_tunic_${uniqueId})`} stroke="#7f1d1d" strokeWidth="1" />
          {/* White Crossbelts */}
          <line x1="13" y1="30" x2="31" y2="49" stroke="#ffffff" strokeWidth="2.2" />
          <line x1="31" y1="30" x2="13" y2="49" stroke="#ffffff" strokeWidth="2.2" />
          {/* Center Brass Breastplate Badge */}
          <circle cx="22" cy="39" r="2.2" fill={`url(#ts_gold_${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />

          {/* Gold Tunic Buttons */}
          <circle cx="22" cy="32" r="1" fill={`url(#ts_gold_${uniqueId})`} />
          <circle cx="22" cy="35" r="1" fill={`url(#ts_gold_${uniqueId})`} />
          <circle cx="22" cy="43" r="1" fill={`url(#ts_gold_${uniqueId})`} />
          <circle cx="22" cy="46" r="1" fill={`url(#ts_gold_${uniqueId})`} />

          {/* White Trousers */}
          <rect x="13" y="50" width="7.5" height="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="23.5" y="50" width="7.5" height="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />

          {/* Black Cavalry Boots with Polish Highlight */}
          <rect x="12.5" y="61" width="8.5" height="6.5" rx="1.5" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
          <rect x="23" y="61" width="8.5" height="6.5" rx="1.5" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
          <line x1="14" y1="62" x2="18" y2="62" stroke="#64748b" strokeWidth="1" />
          <line x1="25" y1="62" x2="29" y2="62" stroke="#64748b" strokeWidth="1" />

          {/* Musket Rifle held upright */}
          <line x1="34" y1="12" x2="34" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="10" x2="34" y2="25" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Triangular Bayonet */}
          <polygon points="34,6 36,12 34,14" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />

          {/* Turned Toy Stand Plinth */}
          <ellipse cx="22" cy="68" rx="17" ry="3.5" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          <ellipse cx="22" cy="67.5" rx="15" ry="2" fill="#22c55e" opacity="0.4" />
        </svg>
      );

    case 'toy_horse':
      return (
        <svg viewBox="0 0 74 60" className={className} fill="none">
          <defs>
            <linearGradient id={`th_wood_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <linearGradient id={`th_rocker_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
          </defs>

          {/* Curved Curved Rockers */}
          <path d="M 6 52 Q 37 62 68 52" stroke={`url(#th_rocker_${uniqueId})`} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 12 50 Q 37 57 62 50" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
          {/* Brass Rocker Studs */}
          <circle cx="16" cy="51" r="1.5" fill="#fef08a" />
          <circle cx="37" cy="56" r="1.5" fill="#fef08a" />
          <circle cx="58" cy="51" r="1.5" fill="#fef08a" />

          {/* Rocker Upright Struts */}
          <line x1="22" y1="38" x2="16" y2="52" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="52" y1="38" x2="58" y2="52" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />

          {/* Dapple Grey / Mahogany Horse Body */}
          <ellipse cx="37" cy="30" rx="18" ry="10" fill={`url(#th_wood_${uniqueId})`} stroke="#291408" strokeWidth="1.2" />
          {/* Dapple spots */}
          <circle cx="30" cy="28" r="1.5" fill="#fef3c7" opacity="0.4" />
          <circle cx="35" cy="34" r="1.8" fill="#fef3c7" opacity="0.4" />
          <circle cx="42" cy="27" r="1.4" fill="#fef3c7" opacity="0.4" />

          {/* Tooled Red Leather Saddle with Brass Stirrups */}
          <path d="M 31 24 C 33 29 41 29 43 24 C 43 32 31 32 31 24 Z" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.2" />
          <path d="M 37 30 L 37 37" stroke="#451a03" strokeWidth="1.2" />
          <ellipse cx="37" cy="38" rx="2" ry="1.2" stroke="#fbbf24" strokeWidth="1" fill="none" />

          {/* Arched Neck & Expressive Head */}
          <path d="M 44 26 L 54 14 C 57 10 60 8 62 12 C 64 16 61 19 57 23 L 48 30 Z" fill={`url(#th_wood_${uniqueId})`} stroke="#291408" strokeWidth="1.2" />
          
          {/* Carved Black Mane */}
          <path d="M 48 13 Q 51 22 44 28" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
          {/* Pricked Ears */}
          <polygon points="58,9 62,4 63,9" fill="#451a03" stroke="#291408" strokeWidth="0.8" />
          {/* Glass Eye with Sparkle */}
          <circle cx="59" cy="12" r="1.5" fill="#fbbf24" />
          <circle cx="59.5" cy="11.5" r="0.5" fill="#ffffff" />
          {/* Red Bridle & Reins */}
          <path d="M 56 14 L 62 13 L 59 17 Z" stroke="#dc2626" strokeWidth="1" fill="none" />
          <path d="M 59 17 Q 48 24 37 26" stroke="#dc2626" strokeWidth="1" fill="none" />

          {/* Horsehair Swishing Tail */}
          <path d="M 20 28 Q 12 32 8 42" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'necklace':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <defs>
            <radialGradient id={`nc_pearl_${uniqueId}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
            <radialGradient id={`nc_sapph_${uniqueId}`} cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="30%" stopColor="#2563eb" />
              <stop offset="80%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id={`nc_gold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Gold Filigree Chain Loop */}
          <path d="M 12 12 C 14 44 50 44 52 12" stroke={`url(#nc_gold_${uniqueId})`} strokeWidth="2.5" strokeDasharray="2 3" />
          
          {/* Strung Shimmering Iridescent Pearls */}
          {[
            { x: 14, y: 15 }, { x: 17, y: 23 }, { x: 21, y: 30 }, { x: 26, y: 36 },
            { x: 32, y: 38 },
            { x: 38, y: 36 }, { x: 43, y: 30 }, { x: 47, y: 23 }, { x: 50, y: 15 }
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.2" fill={`url(#nc_pearl_${uniqueId})`} stroke="#cbd5e1" strokeWidth="0.8" />
              {/* Pearl high sheen */}
              <circle cx={p.x - 1} cy={p.y - 1} r="0.9" fill="#ffffff" />
            </g>
          ))}

          {/* Center Ornate Gold Filigree Pendant Setting */}
          <path d="M 32 38 L 32 43" stroke={`url(#nc_gold_${uniqueId})`} strokeWidth="2" />
          <ellipse cx="32" cy="49" rx="7.5" ry="9.5" fill={`url(#nc_gold_${uniqueId})`} stroke="#78350f" strokeWidth="1" />
          
          {/* Faceted Royal Ceylon Sapphire Gem */}
          <ellipse cx="32" cy="49" rx="5.5" ry="7.5" fill={`url(#nc_sapph_${uniqueId})`} stroke="#1e3a8a" strokeWidth="0.8" />
          
          {/* Facet Cuts on Gem */}
          <polygon points="32,43 36,47 32,51 28,47" fill="#60a5fa" opacity="0.5" />
          <circle cx="30" cy="46" r="1.2" fill="#ffffff" opacity="0.9" />

          {/* Dangling Teardrop Pearl */}
          <circle cx="32" cy="59" r="2.2" fill={`url(#nc_pearl_${uniqueId})`} stroke="#cbd5e1" strokeWidth="0.6" />
        </svg>
      );

    case 'womans_hat':
      return (
        <svg viewBox="0 0 74 54" className={className} fill="none">
          <defs>
            <linearGradient id={`hat_velvet_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="40%" stopColor="#9d174d" />
              <stop offset="80%" stopColor="#70072b" />
              <stop offset="100%" stopColor="#4c051e" />
            </linearGradient>
            <linearGradient id={`hat_ribbon_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Broad Scalloped Brim */}
          <ellipse cx="37" cy="41" rx="33" ry="9" fill={`url(#hat_velvet_${uniqueId})`} stroke="#4c051e" strokeWidth="2" />
          <ellipse cx="37" cy="41" rx="28" ry="7" fill="#be185d" opacity="0.3" />

          {/* High Crown Dome */}
          <path d="M 21 40 C 21 21 26 15 37 15 C 48 15 53 21 53 40 Z" fill={`url(#hat_velvet_${uniqueId})`} stroke="#4c051e" strokeWidth="2" />

          {/* Silk Satin Gold Ribbon Band */}
          <path d="M 21 35 C 28 38 46 38 53 35 L 53 40 C 46 43 28 43 21 40 Z" fill={`url(#hat_ribbon_${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />

          {/* Extravagant Ostrich Plume Feathers */}
          <path d="M 44 35 C 50 25 58 10 70 7 C 62 13 54 22 47 33 Z" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="1.2" />
          <path d="M 46 33 C 54 21 62 12 72 8" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="1 1.5" />
          
          {/* Second Plumage */}
          <path d="M 40 33 C 44 22 52 14 62 12 C 55 17 48 24 43 34 Z" fill="#fae8ff" stroke="#d8b4fe" strokeWidth="1" />

          {/* Pleated Silk Rosette Bow & Jet Hatpin */}
          <circle cx="44" cy="36" r="4.5" fill="#e11d48" stroke="#fbbf24" strokeWidth="1.2" />
          <circle cx="44" cy="36" r="2" fill="#09090b" stroke="#fef08a" strokeWidth="0.8" />
          {/* Hatpin needle */}
          <line x1="38" y1="42" x2="49" y2="31" stroke="#fbbf24" strokeWidth="1.2" />
          <circle cx="50" cy="30" r="1.5" fill="#fef08a" />
        </svg>
      );

    case 'victoria_picture':
      return (
        <svg viewBox="0 0 56 68" className={className} fill="none">
          <defs>
            <linearGradient id={`vp_frame_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id={`vp_cameo_bg_${uniqueId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="70%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>
          </defs>

          {/* Baroque Rococo Ornate Scroll Carvings on Top & Bottom */}
          <path d="M 28 2 C 34 2 38 6 38 9 C 38 12 32 10 28 12 C 24 10 18 12 18 9 C 18 6 22 2 28 2 Z" fill={`url(#vp_frame_${uniqueId})`} stroke="#78350f" strokeWidth="1" />
          <circle cx="28" cy="5" r="2.2" fill="#fef08a" />
          <path d="M 28 66 C 34 66 38 62 38 59 C 38 56 32 58 28 56 C 24 58 18 56 18 59 C 18 62 22 66 28 66 Z" fill={`url(#vp_frame_${uniqueId})`} stroke="#78350f" strokeWidth="1" />

          {/* Ornate Oval Gold Frame */}
          <ellipse cx="28" cy="34" rx="25" ry="30" fill={`url(#vp_frame_${uniqueId})`} stroke="#451a03" strokeWidth="2.5" />
          <ellipse cx="28" cy="34" rx="22" ry="27" fill="#78350f" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="3 2" />
          <ellipse cx="28" cy="34" rx="19" ry="24" fill={`url(#vp_cameo_bg_${uniqueId})`} stroke="#451a03" strokeWidth="1.5" />

          {/* Queen Victoria Silhouette Cameo Profile (Ivory) */}
          {/* Royal Diamond Tiara */}
          <polygon points="22,21 24,16 27,19 30,15 32,20 34,16 35,21" fill="#fef08a" stroke="#b45309" strokeWidth="0.5" />
          <circle cx="27" cy="19" r="0.8" fill="#ffffff" />
          <circle cx="30" cy="15" r="0.8" fill="#ffffff" />

          {/* Hair Bun & Lace Veil */}
          <circle cx="28" cy="25" r="6" fill="#f8fafc" />
          <path d="M 26 23 Q 35 25 34 38 Q 28 40 26 33 Z" fill="#f1f5f9" opacity="0.9" />

          {/* Queen's Profile Silhouette */}
          <path d="M 25 23 Q 30 25 30 28 Q 31 31 29 33 L 32 38 C 34 44 20 44 20 38 L 22 29 Z" fill="#ffffff" />

          {/* Royal Garter Sash (Blue) & Order Star (Ruby & Gold) */}
          <path d="M 23 37 L 31 43" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="41" r="2" fill="#dc2626" stroke="#fbbf24" strokeWidth="0.8" />

          {/* Glass Convex Glaze Reflection */}
          <path d="M 15 26 A 18 23 0 0 1 28 14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" fill="none" />
        </svg>
      );

    case 'key':
      return (
        <svg viewBox="0 0 68 36" className={className} fill="none">
          <defs>
            <linearGradient id={`ky_brass_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Ornate Gothic Trefoil Bow Handle */}
          <circle cx="15" cy="18" r="11" stroke={`url(#ky_brass_${uniqueId})`} strokeWidth="3" fill="#451a03" fillOpacity="0.4" />
          {/* Inner Tracery Lobes */}
          <circle cx="12" cy="15" r="3.5" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="18" cy="15" r="3.5" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="15" cy="21" r="3.5" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="15" cy="18" r="1.5" fill="#fef08a" />

          {/* Collar Rings */}
          <rect x="25" y="14" width="3" height="8" rx="1" fill={`url(#ky_brass_${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />
          <rect x="29" y="15.5" width="2" height="5" rx="0.5" fill="#fef08a" />

          {/* Shaft Barrel */}
          <rect x="30" y="16.5" width="30" height="3" fill={`url(#ky_brass_${uniqueId})`} stroke="#78350f" strokeWidth="0.8" rx="1" />
          {/* Metallic shaft highlight */}
          <line x1="31" y1="17.2" x2="58" y2="17.2" stroke="#fef08a" strokeWidth="0.8" />

          {/* Stepped Ward Bit Teeth */}
          <path d="M 50 19.5 L 50 29 L 55 29 L 55 25 L 58 25 L 58 29 L 61 29 L 61 19.5 Z" fill={`url(#ky_brass_${uniqueId})`} stroke="#78350f" strokeWidth="1" />
          {/* Keyhole notch cut in bit */}
          <rect x="52" y="22" width="2" height="4" fill="#1c1917" />
          <rect x="56" y="21" width="1.5" height="2" fill="#1c1917" />
        </svg>
      );

    case 'grapes':
      return (
        <svg viewBox="0 0 58 58" className={className} fill="none">
          <defs>
            <radialGradient id={`gr_berry_${uniqueId}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="40%" stopColor="#7e22ce" />
              <stop offset="85%" stopColor="#3b0764" />
              <stop offset="100%" stopColor="#1e0433" />
            </radialGradient>
            <linearGradient id={`gr_leaf_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          {/* Woody Vine Stem & Twisting Tendril */}
          <path d="M 29 6 Q 34 11 29 17" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 33 10 Q 42 6 40 14 Q 38 18 44 20" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Broad Grape Leaves with Veins */}
          <path d="M 28 12 C 20 8 13 14 16 20 C 22 21 25 18 28 12 Z" fill={`url(#gr_leaf_${uniqueId})`} stroke="#14532d" strokeWidth="1" />
          <line x1="28" y1="12" x2="18" y2="17" stroke="#86efac" strokeWidth="0.8" />
          
          <path d="M 30 12 C 38 8 45 13 42 20 C 36 21 33 18 30 12 Z" fill={`url(#gr_leaf_${uniqueId})`} stroke="#14532d" strokeWidth="1" />
          <line x1="30" y1="12" x2="39" y2="17" stroke="#86efac" strokeWidth="0.8" />

          {/* Plump Grapes Clusters with Translucent Bloom */}
          {[
            // Top tier
            { x: 23, y: 22, r: 5.5 }, { x: 34, y: 22, r: 5.5 },
            // Second tier
            { x: 17, y: 30, r: 5.8 }, { x: 28, y: 29, r: 6.0 }, { x: 39, y: 30, r: 5.8 },
            // Third tier
            { x: 22, y: 38, r: 5.8 }, { x: 33, y: 38, r: 5.8 },
            // Fourth tier
            { x: 27, y: 45, r: 5.5 },
            // Bottom tip
            { x: 28, y: 51, r: 4.8 }
          ].map((b, i) => (
            <g key={i}>
              <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#gr_berry_${uniqueId})`} stroke="#581c87" strokeWidth="0.8" />
              {/* Specular Dewdrop Highlight */}
              <circle cx={b.x - b.r * 0.35} cy={b.y - b.r * 0.35} r={b.r * 0.28} fill="#ffffff" opacity="0.75" />
            </g>
          ))}
        </svg>
      );

    case 'pipe':
      return (
        <svg viewBox="0 0 68 44" className={className} fill="none">
          <defs>
            <linearGradient id={`pp_briar_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="40%" stopColor="#78350f" />
              <stop offset="80%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
            <linearGradient id={`pp_silver_${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id={`pp_amber_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Curling Smoke Rings */}
          <path d="M 21 9 Q 18 3 22 0 Q 26 2 24 6" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" fill="none" />
          <path d="M 23 7 Q 27 2 32 3" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" opacity="0.4" fill="none" />

          {/* Polished Briarwood Bowl */}
          <path d="M 12 12 C 12 28 27 30 32 23 L 30 12 Z" fill={`url(#pp_briar_${uniqueId})`} stroke="#291408" strokeWidth="1.5" />
          {/* Bowl Rim & Chamber opening */}
          <ellipse cx="21" cy="12" rx="9" ry="3.5" fill="#451a03" stroke="#b45309" strokeWidth="1" />
          <ellipse cx="21" cy="12" rx="6" ry="2.2" fill="#09090b" />
          {/* Glowing ash ember inside */}
          <ellipse cx="21" cy="12.5" rx="2" ry="0.8" fill="#f97316" opacity="0.8" />

          {/* Hallmarked Sterling Silver Shank Band */}
          <rect x="29" y="20" width="4" height="6.5" rx="0.8" fill={`url(#pp_silver_${uniqueId})`} stroke="#475569" strokeWidth="0.8" />
          <line x1="31" y1="21" x2="31" y2="25" stroke="#ffffff" strokeWidth="0.8" />

          {/* Curved Vulcanite/Amber Stem */}
          <path d="M 33 22 Q 47 25 60 12 L 58 10 Q 45 21 32 19 Z" fill={`url(#pp_amber_${uniqueId})`} stroke="#1c1917" strokeWidth="1" />
          
          {/* Bit Mouthpiece */}
          <rect x="58" y="10" width="3" height="2" rx="0.5" fill="#09090b" stroke="#334155" strokeWidth="0.5" />
        </svg>
      );

    case 'pocket_watch':
      return (
        <svg viewBox="0 0 62 70" className={className} fill="none">
          <defs>
            <linearGradient id={`pw_gold_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id={`pw_dial_${uniqueId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </radialGradient>
          </defs>

          {/* Top Bow Loop & Winding Crown */}
          <circle cx="31" cy="7" r="5.5" stroke={`url(#pw_gold_${uniqueId})`} strokeWidth="2.2" fill="none" />
          <rect x="28" y="11" width="6" height="5" rx="1.5" fill={`url(#pw_gold_${uniqueId})`} stroke="#78350f" strokeWidth="0.8" />

          {/* Heavy 18K Gold Outer Hunter Case */}
          <circle cx="31" cy="40" r="26" fill={`url(#pw_gold_${uniqueId})`} stroke="#451a03" strokeWidth="3" />
          {/* Beaded Edge Ring */}
          <circle cx="31" cy="40" r="23" stroke="#78350f" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />

          {/* Enamel Watch Face */}
          <circle cx="31" cy="40" r="21" fill={`url(#pw_dial_${uniqueId})`} stroke="#92400e" strokeWidth="1.2" />

          {/* Roman Numerals Markers */}
          <circle cx="31" cy="23" r="1.2" fill="#1c1917" />
          <circle cx="48" cy="40" r="1.2" fill="#1c1917" />
          <circle cx="31" cy="57" r="1.2" fill="#1c1917" />
          <circle cx="14" cy="40" r="1.2" fill="#1c1917" />

          {/* Minute Tick Marks */}
          <circle cx="31" cy="40" r="18" stroke="#78350f" strokeWidth="0.8" strokeDasharray="1 3" fill="none" />

          {/* Exposed Escapement Gears in Center */}
          <circle cx="31" cy="45" r="4.5" stroke="#d97706" strokeWidth="1" strokeDasharray="2 1" fill="#fed7aa" opacity="0.6" />
          <circle cx="31" cy="45" r="1.5" fill="#dc2626" />

          {/* Blued Steel Breguet Moon Hands */}
          {/* Hour Hand */}
          <line x1="31" y1="40" x2="31" y2="28" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="31" cy="30" r="1.2" stroke="#1e3a8a" strokeWidth="1" fill="none" />
          {/* Minute Hand */}
          <line x1="31" y1="40" x2="42" y2="42" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="40" cy="42" r="1" stroke="#1e3a8a" strokeWidth="0.8" fill="none" />
          {/* Center Pivot Cap */}
          <circle cx="31" cy="40" r="2.5" fill={`url(#pw_gold_${uniqueId})`} stroke="#451a03" strokeWidth="0.8" />

          {/* Convex Crystal Glass Glare */}
          <path d="M 16 30 A 20 20 0 0 1 31 21" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" fill="none" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <circle cx="24" cy="24" r="20" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="24" cy="24" r="6" fill="#fbbf24" />
        </svg>
      );
  }
};
