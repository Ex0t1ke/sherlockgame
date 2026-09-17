import React from 'react';

interface VictorianClockProps {
  secondsLeft: number;
}

export const VictorianClock: React.FC<VictorianClockProps> = ({ secondsLeft }) => {
  // Format minutes and seconds
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Clock hands angles based on timer seconds
  const minuteAngle = ((3600 - (secondsLeft % 3600)) / 3600) * 360;
  const hourAngle = ((43200 - (secondsLeft % 43200)) / 43200) * 360;
  const secondAngle = (secondsLeft % 60) * 6;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[210px] mx-auto">
      {/* Victorian Ornate Clock Assembly */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
        {/* Steam-Gothic / Victorian Filigree Brass Frame Outer Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-600 via-yellow-700 to-amber-950 p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.8)] border border-amber-400/70">
          {/* Filigree Cogwheel Teeth Texture */}
          <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300/60 flex items-center justify-center p-1 bg-gradient-to-tr from-amber-950 via-stone-900 to-amber-900">
            {/* Clock Face Plate */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706] shadow-inner flex items-center justify-center border-2 border-amber-800">
              
              {/* Radial Hatch Pattern */}
              <div className="absolute inset-0 rounded-full opacity-15 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:6px_6px]" />

              {/* Inner Gear Silhouette */}
              <svg viewBox="0 0 100 100" className="absolute inset-2 opacity-25 text-amber-950 pointer-events-none" fill="currentColor">
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 3" />
                <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 15 L50 25 M50 75 L50 85 M15 50 L25 50 M75 50 L85 50" stroke="currentColor" strokeWidth="2" />
              </svg>

              {/* Roman Numerals */}
              <div className="absolute top-1 text-[11px] font-serif font-black text-stone-900">XII</div>
              <div className="absolute right-2.5 text-[11px] font-serif font-black text-stone-900">III</div>
              <div className="absolute bottom-1 text-[11px] font-serif font-black text-stone-900">VI</div>
              <div className="absolute left-2.5 text-[11px] font-serif font-black text-stone-900">IX</div>

              {/* Small Roman Markers */}
              <div className="absolute top-3 right-6 text-[8px] font-serif font-bold text-stone-800">I</div>
              <div className="absolute top-7 right-3 text-[8px] font-serif font-bold text-stone-800">II</div>
              <div className="absolute bottom-7 right-3 text-[8px] font-serif font-bold text-stone-800">IV</div>
              <div className="absolute bottom-3 right-6 text-[8px] font-serif font-bold text-stone-800">V</div>
              <div className="absolute bottom-3 left-6 text-[8px] font-serif font-bold text-stone-800">VII</div>
              <div className="absolute bottom-7 left-3 text-[8px] font-serif font-bold text-stone-800">VIII</div>
              <div className="absolute top-7 left-3 text-[8px] font-serif font-bold text-stone-800">X</div>
              <div className="absolute top-3 left-6 text-[8px] font-serif font-bold text-stone-800">XI</div>

              {/* Clock Hands */}
              {/* Hour Hand */}
              <div
                className="absolute w-1.5 h-9 bg-stone-950 rounded-full origin-bottom shadow"
                style={{
                  bottom: '50%',
                  transform: `rotate(${hourAngle}deg)`,
                  transition: 'transform 0.5s ease-in-out',
                }}
              />
              {/* Minute Hand */}
              <div
                className="absolute w-1 h-12 bg-amber-950 rounded-full origin-bottom shadow"
                style={{
                  bottom: '50%',
                  transform: `rotate(${minuteAngle}deg)`,
                  transition: 'transform 0.5s ease-in-out',
                }}
              />
              {/* Second Hand */}
              <div
                className="absolute w-0.5 h-13 bg-red-700 rounded-full origin-bottom shadow-sm"
                style={{
                  bottom: '50%',
                  transform: `rotate(${secondAngle}deg)`,
                  transition: 'transform 0.2s linear',
                }}
              />
              {/* Center Brass Cap */}
              <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-700 border border-amber-950 shadow" />
            </div>
          </div>
        </div>

        {/* Decorative corner filigree studs */}
        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-amber-400 border border-amber-800 shadow" />
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-amber-800 shadow" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-amber-400 border border-amber-800 shadow" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-amber-800 shadow" />
      </div>

      {/* Digital Countdown Dial Plate (Directly under clock like in screenshot) */}
      <div className="relative mt-2 px-3.5 py-1 rounded-md bg-gradient-to-b from-[#451a03] via-[#292524] to-[#1c1917] border-2 border-amber-500/80 shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center">
        {/* Brass Screws */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 border border-stone-800" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 border border-stone-800" />

        <span className="font-mono font-black text-sm sm:text-base tracking-widest text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-2">
          {timeFormatted}
        </span>
      </div>
    </div>
  );
};
