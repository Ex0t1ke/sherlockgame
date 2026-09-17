import React from 'react';
import { ClientProfile } from '../types';

interface ClientPortraitProps {
  client: ClientProfile;
  expression?: 'normal' | 'worried' | 'thinking' | 'relieved' | 'happy';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  isSpeaking?: boolean;
}

export const ClientPortrait: React.FC<ClientPortraitProps> = ({
  client,
  expression = 'normal',
  size = 'md',
  className = '',
  isSpeaking = false,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    hero: 'w-64 h-80 sm:w-72 sm:h-96',
  };

  // Expression-based mouth and eyebrow morphing
  const renderFeatures = () => {
    switch (client.svgCharacterType) {
      case 'eleanor':
        return (
          <g id="eleanor-art">
            {/* Lavender Victorian dress */}
            <path d="M 30 150 Q 50 115 100 115 Q 150 115 170 150 L 180 200 L 20 200 Z" fill="#6b5b7b" />
            <path d="M 75 115 Q 100 135 125 115 L 120 150 L 80 150 Z" fill="#f8f4eb" opacity="0.9" />
            {/* Pearl Necklace */}
            <ellipse cx="85" cy="120" rx="3.5" ry="3.5" fill="#fdfbf7" stroke="#dcd6cd" strokeWidth="0.5" />
            <ellipse cx="93" cy="123" rx="4" ry="4" fill="#fdfbf7" stroke="#dcd6cd" strokeWidth="0.5" />
            <ellipse cx="100" cy="124" rx="4.5" ry="4.5" fill="#fdfbf7" stroke="#dcd6cd" strokeWidth="0.5" />
            <ellipse cx="107" cy="123" rx="4" ry="4" fill="#fdfbf7" stroke="#dcd6cd" strokeWidth="0.5" />
            <ellipse cx="115" cy="120" rx="3.5" ry="3.5" fill="#fdfbf7" stroke="#dcd6cd" strokeWidth="0.5" />
            {/* Head & Neck */}
            <rect x="90" y="92" width="20" height="26" rx="4" fill="#fae0d4" />
            {/* Elderly Face */}
            <path d="M 68 60 C 68 95 72 105 100 105 C 128 105 132 95 132 60 C 132 30 68 30 68 60 Z" fill="#fae0d4" />
            {/* Soft silver hair bun */}
            <path d="M 60 52 C 55 25 80 12 100 12 C 125 12 145 25 140 52 C 145 68 135 80 132 80 C 126 50 115 35 100 35 C 85 35 74 50 68 80 C 65 80 55 68 60 52 Z" fill="#d9d4d8" />
            <ellipse cx="100" cy="18" rx="20" ry="14" fill="#c4bcc2" />
            {/* Subtle silver hair curls & texture */}
            <path d="M 62 48 Q 72 32 88 34" stroke="#a89fa7" strokeWidth="2" fill="none" />
            <path d="M 138 48 Q 128 32 112 34" stroke="#a89fa7" strokeWidth="2" fill="none" />
            {/* Eyebrows (worried tilt) */}
            <path d={expression === 'worried' ? "M 78 58 Q 86 54 94 59" : "M 78 56 Q 86 53 94 56"} stroke="#827a81" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d={expression === 'worried' ? "M 106 59 Q 114 54 122 58" : "M 106 56 Q 114 53 122 56"} stroke="#827a81" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="86" cy="65" rx="3.5" ry="3" fill="#2d283e" />
            <ellipse cx="114" cy="65" rx="3.5" ry="3" fill="#2d283e" />
            <circle cx="85" cy="64" r="1" fill="#ffffff" />
            <circle cx="113" cy="64" r="1" fill="#ffffff" />
            {/* Cheeks & gentle age lines */}
            <ellipse cx="78" cy="74" rx="5" ry="3" fill="#f0b6aa" opacity="0.4" />
            <ellipse cx="122" cy="74" rx="5" ry="3" fill="#f0b6aa" opacity="0.4" />
            <path d="M 88 78 Q 86 85 88 92" stroke="#e0b8ab" strokeWidth="1" fill="none" />
            <path d="M 112 78 Q 114 85 112 92" stroke="#e0b8ab" strokeWidth="1" fill="none" />
            {/* Nose */}
            <path d="M 99 64 L 97 76 L 103 76" stroke="#d49b8a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Mouth */}
            {expression === 'happy' || expression === 'relieved' ? (
              <path d="M 92 88 Q 100 95 108 88" stroke="#b35454" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : isSpeaking ? (
              <ellipse cx="100" cy="88" rx="4" ry="3" fill="#873535" />
            ) : (
              <path d="M 94 88 Q 100 86 106 88" stroke="#a14e4e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            )}
          </g>
        );

      case 'tommy':
        return (
          <g id="tommy-art">
            {/* Red Hoodie & Backpack strap */}
            <path d="M 25 145 Q 50 120 100 120 Q 150 120 175 145 L 180 200 L 20 200 Z" fill="#b91c1c" />
            <path d="M 50 130 L 62 200 L 42 200 Z" fill="#1e293b" />
            <path d="M 150 130 L 138 200 L 158 200 Z" fill="#1e293b" />
            <path d="M 80 120 Q 100 138 120 120" stroke="#f1f5f9" strokeWidth="3" fill="none" />
            {/* Head & messy teen hair */}
            <rect x="91" y="94" width="18" height="24" rx="3" fill="#fcd3b6" />
            <path d="M 72 65 C 72 96 76 106 100 106 C 124 106 128 96 128 65 C 128 35 72 35 72 65 Z" fill="#fcd3b6" />
            {/* Tousled brown hair */}
            <path d="M 64 56 C 60 30 80 16 100 18 C 120 16 138 26 136 54 C 132 40 125 32 108 30 C 95 28 85 36 78 44 C 70 54 66 56 64 56 Z" fill="#543310" />
            <path d="M 72 35 L 85 46 L 98 32 L 115 48 L 126 34 L 134 50" stroke="#3e2307" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Freckles */}
            <circle cx="84" cy="74" r="1" fill="#ba6838" />
            <circle cx="88" cy="76" r="1" fill="#ba6838" />
            <circle cx="112" cy="76" r="1" fill="#ba6838" />
            <circle cx="116" cy="74" r="1" fill="#ba6838" />
            {/* Eyebrows */}
            <path d="M 78 57 L 92 59" stroke="#3e2307" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 108 59 L 122 57" stroke="#3e2307" strokeWidth="2.5" strokeLinecap="round" />
            {/* Big nervous eyes */}
            <ellipse cx="85" cy="67" rx="4" ry="4.5" fill="#1e293b" />
            <ellipse cx="115" cy="67" rx="4" ry="4.5" fill="#1e293b" />
            <circle cx="84" cy="65" r="1.5" fill="#ffffff" />
            <circle cx="114" cy="65" r="1.5" fill="#ffffff" />
            {/* Mouth */}
            {isSpeaking ? (
              <ellipse cx="100" cy="89" rx="5" ry="3" fill="#7f1d1d" />
            ) : expression === 'happy' ? (
              <path d="M 93 88 Q 100 96 107 88" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 94 89 Q 100 87 106 89" stroke="#991b1b" strokeWidth="2" fill="none" />
            )}
          </g>
        );

      case 'antonio':
        return (
          <g id="antonio-art">
            {/* White Chef coat & red neckerchief */}
            <path d="M 20 135 Q 50 110 100 110 Q 150 110 180 135 L 185 200 L 15 200 Z" fill="#f8fafc" />
            <path d="M 90 110 L 100 130 L 110 110 Z" fill="#dc2626" />
            {/* Double breasted buttons */}
            <circle cx="90" cy="145" r="3" fill="#0f172a" />
            <circle cx="110" cy="145" r="3" fill="#0f172a" />
            <circle cx="90" cy="165" r="3" fill="#0f172a" />
            <circle cx="110" cy="165" r="3" fill="#0f172a" />
            {/* Tall Chef's Toque Hat */}
            <path d="M 75 42 C 60 20 70 2 100 2 C 130 2 140 20 125 42 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="74" y="38" width="52" height="12" rx="3" fill="#f1f5f9" />
            {/* Round Jovial Italian Face */}
            <rect x="88" y="90" width="24" height="24" rx="4" fill="#fed7aa" />
            <ellipse cx="100" cy="74" rx="32" ry="28" fill="#fed7aa" />
            {/* Flour patch on right cheek */}
            <ellipse cx="120" cy="74" rx="6" ry="4" fill="#ffffff" opacity="0.8" />
            {/* Magnificent Curly Mustache */}
            <path d="M 80 84 Q 92 80 100 85 Q 108 80 120 84 Q 128 88 126 92 Q 116 88 100 90 Q 84 88 74 92 Q 72 88 80 84 Z" fill="#292524" />
            {/* Dramatic expressive eyes */}
            <path d="M 78 62 Q 88 56 94 62" stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 106 62 Q 112 56 122 62" stroke="#1c1917" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="86" cy="67" r="3.5" fill="#1c1917" />
            <circle cx="114" cy="67" r="3.5" fill="#1c1917" />
            <circle cx="85" cy="65.5" r="1.2" fill="#ffffff" />
            <circle cx="113" cy="65.5" r="1.2" fill="#ffffff" />
            {/* Big Italian Nose */}
            <ellipse cx="100" cy="74" rx="7" ry="6" fill="#fba77a" />
          </g>
        );

      case 'sarah':
        return (
          <g id="sarah-art">
            {/* Black Leather Police Jacket & Teal Shirt */}
            <path d="M 25 140 Q 50 116 100 116 Q 150 116 175 140 L 180 200 L 20 200 Z" fill="#18181b" />
            <path d="M 80 116 L 100 148 L 120 116 Z" fill="#0d9488" />
            {/* Silver police badge pin holder on collar */}
            <polygon points="48,150 54,142 62,146 62,156 54,162 48,156" fill="#ca8a04" stroke="#fef08a" strokeWidth="0.8" />
            {/* Sharp jawline & neck */}
            <rect x="91" y="94" width="18" height="24" rx="2" fill="#fad7c0" />
            <path d="M 72 64 C 72 95 78 106 100 106 C 122 106 128 95 128 64 C 128 35 72 35 72 64 Z" fill="#fad7c0" />
            {/* Sleek raven-black bob haircut */}
            <path d="M 64 56 C 60 26 80 16 100 16 C 120 16 140 26 136 56 L 140 92 L 128 86 C 126 50 115 36 100 36 C 85 36 74 50 72 86 L 60 92 Z" fill="#09090b" />
            {/* Piercing focused eyes */}
            <path d="M 76 58 L 92 60" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 108 60 L 124 58" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="84" cy="67" rx="4" ry="3" fill="#18181b" />
            <ellipse cx="116" cy="67" rx="4" ry="3" fill="#18181b" />
            <circle cx="83" cy="66" r="1.2" fill="#ffffff" />
            <circle cx="115" cy="66" r="1.2" fill="#ffffff" />
            {/* Firm mouth */}
            <line x1="93" y1="89" x2="107" y2="89" stroke="#9f1239" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );

      case 'hartmann':
        return (
          <g id="hartmann-art">
            {/* Brown Tweed Jacket & Bowtie */}
            <path d="M 25 140 Q 50 118 100 118 Q 150 118 175 140 L 180 200 L 20 200 Z" fill="#78350f" />
            <path d="M 85 118 L 100 145 L 115 118 Z" fill="#fef3c7" />
            {/* Bowtie */}
            <polygon points="90,122 100,126 90,130" fill="#991b1b" />
            <polygon points="110,122 100,126 110,130" fill="#991b1b" />
            <circle cx="100" cy="126" r="2.5" fill="#7f1d1d" />
            {/* Wild Einstein/Eccentric White Hair */}
            <path d="M 52 50 C 42 20 62 10 78 12 C 86 4 114 4 122 12 C 138 10 158 20 148 50 C 160 70 146 95 138 88 C 135 60 120 40 100 40 C 80 40 65 60 62 88 C 54 95 40 70 52 50 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            {/* Face */}
            <ellipse cx="100" cy="72" rx="27" ry="29" fill="#fed7aa" />
            {/* Round Glasses with Gold Rim */}
            <circle cx="85" cy="68" r="9" fill="#e0f2fe" fillOpacity="0.4" stroke="#d97706" strokeWidth="2.2" />
            <circle cx="115" cy="68" r="9" fill="#e0f2fe" fillOpacity="0.4" stroke="#d97706" strokeWidth="2.2" />
            <line x1="94" y1="68" x2="106" y2="68" stroke="#d97706" strokeWidth="2" />
            <ellipse cx="85" cy="68" rx="2.5" ry="2.5" fill="#1e293b" />
            <ellipse cx="115" cy="68" rx="2.5" ry="2.5" fill="#1e293b" />
            {/* Fluffy white mustache */}
            <path d="M 85 86 Q 100 82 115 86 Q 120 92 112 94 Q 100 90 88 94 Z" fill="#f8fafc" />
          </g>
        );

      case 'lily':
        return (
          <g id="lily-art">
            {/* Fashion Designer: Coral chic asymmetric top with neon accents */}
            <path d="M 28 140 Q 50 115 100 115 Q 150 115 172 140 L 180 200 L 20 200 Z" fill="#f43f5e" />
            <path d="M 70 115 L 130 160 L 100 200 Z" fill="#06b6d4" opacity="0.8" />
            {/* Face & Trendy Hair with Pink / Violet streak */}
            <rect x="91" y="93" width="18" height="25" rx="3" fill="#fed7aa" />
            <ellipse cx="100" cy="68" rx="26" ry="28" fill="#fed7aa" />
            {/* Angular high fashion bob with neon bangs */}
            <path d="M 64 52 C 60 20 80 14 100 14 C 124 14 142 22 136 54 L 144 85 L 126 80 C 124 45 115 32 100 32 C 85 32 74 45 74 80 L 56 85 Z" fill="#1e1b4b" />
            <path d="M 78 32 Q 95 38 105 32" stroke="#ec4899" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Cat eye makeup */}
            <path d="M 76 64 Q 85 62 94 65" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            <path d="M 94 65 L 98 62" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <path d="M 106 65 Q 115 62 124 64" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            <path d="M 124 64 L 128 62" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="85" cy="66" r="3" fill="#831843" />
            <circle cx="115" cy="66" r="3" fill="#831843" />
            {/* Bold red lipstick */}
            <path d="M 92 88 Q 100 94 108 88" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'victor':
        return (
          <g id="victor-art">
            {/* Pinstripe Luxury Businessman Suit & Gold Watch */}
            <path d="M 22 135 Q 50 112 100 112 Q 150 112 178 135 L 185 200 L 15 200 Z" fill="#0f172a" />
            <path d="M 85 112 L 100 152 L 115 112 Z" fill="#ffffff" />
            <polygon points="97,120 103,120 102,165 98,165" fill="#b91c1c" />
            {/* Gold Lapel Pin */}
            <circle cx="68" cy="138" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            {/* Slicked back hair & square jaw */}
            <rect x="91" y="92" width="18" height="24" rx="2" fill="#fcd34d" fillOpacity="0.2" />
            <path d="M 72 64 C 72 95 80 105 100 105 C 120 105 128 95 128 64 C 128 32 72 32 72 64 Z" fill="#fde68a" />
            {/* Slicked dark hair */}
            <path d="M 68 54 C 66 22 84 14 100 14 C 116 14 134 22 132 54 C 128 42 118 30 100 30 C 82 30 72 42 68 54 Z" fill="#172554" />
            {/* Stressed, frantic wealthy expression */}
            <path d="M 78 54 L 92 57" stroke="#172554" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 108 57 L 122 54" stroke="#172554" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="85" cy="65" r="3.5" fill="#1e293b" />
            <circle cx="115" cy="65" r="3.5" fill="#1e293b" />
            {/* Sweat bead */}
            <circle cx="126" cy="60" r="2" fill="#38bdf8" />
          </g>
        );

      case 'olga':
        return (
          <g id="olga-art">
            {/* Floral babushka headscarf */}
            <path d="M 52 65 C 50 20 75 8 100 8 C 125 8 150 20 148 65 L 140 120 L 100 128 L 60 120 Z" fill="#047857" />
            {/* Little floral dots on scarf */}
            <circle cx="70" cy="30" r="2.5" fill="#fef08a" />
            <circle cx="130" cy="30" r="2.5" fill="#fef08a" />
            <circle cx="100" cy="18" r="2.5" fill="#f87171" />
            {/* Warm Russian Grandmother Face */}
            <ellipse cx="100" cy="68" rx="25" ry="27" fill="#fed7aa" />
            {/* Knitted warm shawl */}
            <path d="M 25 140 Q 50 122 100 122 Q 150 122 175 140 L 180 200 L 20 200 Z" fill="#065f46" />
            {/* Sweet crinkly eyes & rosy cheeks */}
            <path d="M 80 62 Q 86 58 92 63" stroke="#334155" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 108 63 Q 114 58 120 62" stroke="#334155" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="78" cy="74" rx="6" ry="4" fill="#fb7185" opacity="0.6" />
            <ellipse cx="122" cy="74" rx="6" ry="4" fill="#fb7185" opacity="0.6" />
            <path d="M 90 85 Q 100 93 110 85" stroke="#991b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'jake':
        return (
          <g id="jake-art">
            {/* Blue Denim Mechanic Overalls with oil smudges */}
            <path d="M 24 135 Q 50 114 100 114 Q 150 114 176 135 L 182 200 L 18 200 Z" fill="#1d4ed8" />
            <path d="M 60 125 L 68 200 L 52 200 Z" fill="#1e3a8a" />
            <path d="M 140 125 L 132 200 L 148 200 Z" fill="#1e3a8a" />
            {/* Oil smudge on chest */}
            <ellipse cx="130" cy="155" rx="8" ry="4" fill="#18181b" opacity="0.7" />
            {/* Backwards mechanic cap */}
            <ellipse cx="100" cy="38" rx="28" ry="14" fill="#dc2626" />
            <rect x="74" y="36" width="52" height="12" rx="3" fill="#b91c1c" />
            {/* Broad friendly jaw with 5 o'clock stubble */}
            <ellipse cx="100" cy="74" rx="28" ry="28" fill="#fed7aa" />
            <ellipse cx="100" cy="85" rx="18" ry="12" fill="#d97706" opacity="0.15" />
            {/* Friendly brown eyes */}
            <circle cx="85" cy="68" r="4" fill="#451a03" />
            <circle cx="115" cy="68" r="4" fill="#451a03" />
            <circle cx="84" cy="66" r="1.5" fill="#ffffff" />
            <circle cx="114" cy="66" r="1.5" fill="#ffffff" />
            {/* Smudge on nose */}
            <circle cx="105" cy="74" r="2.5" fill="#1e293b" opacity="0.6" />
            <path d="M 91 88 Q 100 95 109 88" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'amara':
        return (
          <g id="amara-art">
            {/* White Doctor Coat & Stethoscope */}
            <path d="M 25 138 Q 50 115 100 115 Q 150 115 175 138 L 180 200 L 20 200 Z" fill="#f8fafc" />
            <path d="M 85 115 L 100 150 L 115 115 Z" fill="#0284c7" />
            {/* Stethoscope */}
            <path d="M 75 115 Q 100 160 125 115" stroke="#334155" strokeWidth="3.5" fill="none" />
            <circle cx="100" cy="162" r="5" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            {/* Beautiful dark skin & elegant braided hair bun */}
            <rect x="91" y="93" width="18" height="25" rx="3" fill="#78350f" />
            <ellipse cx="100" cy="68" rx="26" ry="28" fill="#78350f" />
            {/* High braided top knot */}
            <circle cx="100" cy="22" r="16" fill="#1c1917" />
            <path d="M 74 54 C 70 28 85 18 100 18 C 115 18 130 28 126 54 Z" fill="#1c1917" />
            {/* Intelligent, focused eyes */}
            <path d="M 78 57 Q 86 54 94 57" stroke="#0c0a09" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 106 57 Q 114 54 122 57" stroke="#0c0a09" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="86" cy="65" r="3.5" fill="#451a03" />
            <circle cx="114" cy="65" r="3.5" fill="#451a03" />
            <circle cx="85" cy="64" r="1" fill="#ffffff" />
            <circle cx="113" cy="64" r="1" fill="#ffffff" />
            {/* Calm composed mouth */}
            <path d="M 93 87 Q 100 90 107 87" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id={`client-portrait-${client.id}`}
      className={`relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center ${sizeMap[size]} ${className}`}
    >
      {/* Ambient background glow matching client theme */}
      <div
        className="absolute inset-0 opacity-25 filter blur-md pointer-events-none"
        style={{ backgroundColor: client.accentColor }}
      />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full object-cover transition-transform duration-300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id={`glow-${client.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={client.accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="200" height="200" fill={`url(#glow-${client.id})`} />
        {renderFeatures()}
      </svg>

      {/* Speaking badge animation */}
      {isSpeaking && (
        <span className="absolute bottom-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      )}
    </div>
  );
};
