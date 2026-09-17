import React from 'react';
import { CaseDefinition, DetectiveRank } from '../types';
import { ClientPortrait } from './ClientPortrait';
import { formatRankRu } from './HeaderBar';
import { soundEngine } from '../audio/soundEngine';
import { 
  Award, 
  Coins, 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';

interface CaseCompletedModalProps {
  currentCase: CaseDefinition;
  stats: {
    timeSeconds: number;
    wrongClicks: number;
    hintsUsedThisCase: number;
  };
  earnedStars: number;
  earnedCoins: number;
  newRank?: DetectiveRank;
  onReturnToMap: () => void;
}

export const CaseCompletedModal: React.FC<CaseCompletedModalProps> = ({
  currentCase,
  stats,
  earnedStars,
  earnedCoins,
  newRank,
  onReturnToMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-amber-50 max-h-[94vh] overflow-y-auto">
        {/* Decorative Golden Corner Flourishes */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

        {/* Top Header: Case Closed Banner */}
        <div className="flex flex-col items-center text-center">
          <div className="px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 font-serif font-black text-[11px] sm:text-xs tracking-widest uppercase shadow-md border border-amber-300 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ДЕЛО №{currentCase.caseNumber} УСПЕШНО ЗАКРЫТО</span>
          </div>

          <h2 className="font-serif font-black text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            {currentCase.title}
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 max-w-md">
            Реликвия «{currentCase.client.lostItemName}» найдена и возвращена владельцу!
          </p>
        </div>

        {/* Client Portrait & Relieved Reaction */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-amber-500/20 rounded-2xl p-2.5 sm:p-3 my-2.5 sm:my-3 shadow-inner">
          <ClientPortrait
            client={currentCase.client}
            expression="happy"
            size="sm"
            className="border border-amber-400/40 shrink-0"
          />
          <div>
            <div className="font-serif font-bold text-xs text-amber-300">
              {currentCase.client.name} ({currentCase.client.title}):
            </div>
            <p className="text-xs text-amber-100/90 italic mt-0.5 leading-relaxed font-story">
              «Мистер Холмс! Словами не выразить мою благодарность. Вы спасли то, что было дороже всего на свете!»
            </p>
          </div>
        </div>

        {/* Earned Rating Stars */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`p-1.5 rounded-xl border transition-transform ${
                starNum <= earnedStars
                  ? 'bg-amber-500/20 border-yellow-400 text-yellow-300 scale-105 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                  : 'bg-slate-800/40 border-slate-700 text-slate-600'
              }`}
            >
              <Star
                className={`w-5 h-5 sm:w-7 sm:h-7 ${
                  starNum <= earnedStars ? 'fill-yellow-400 text-yellow-400' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* Investigation Performance Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2">
            <Clock className="w-3.5 h-3.5 mx-auto text-amber-400 mb-0.5" />
            <div className="text-[9px] text-slate-400 uppercase font-semibold">Время</div>
            <div className="font-mono font-bold text-xs text-amber-100">
              {Math.floor(stats.timeSeconds / 60)}:{(stats.timeSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2">
            <Coins className="w-3.5 h-3.5 mx-auto text-yellow-400 mb-0.5" />
            <div className="text-[9px] text-slate-400 uppercase font-semibold">Награда</div>
            <div className="font-mono font-bold text-xs text-yellow-300">
              +{earnedCoins}
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-2">
            <Sparkles className="w-3.5 h-3.5 mx-auto text-sky-400 mb-0.5" />
            <div className="text-[9px] text-slate-400 uppercase font-semibold">Подсказок</div>
            <div className="font-mono font-bold text-xs text-sky-200">
              {stats.hintsUsedThisCase === 0 ? 'Без подсказок!' : `${stats.hintsUsedThisCase}`}
            </div>
          </div>
        </div>

        {/* Rank Up Banner */}
        {newRank && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-600/30 via-yellow-600/40 to-amber-600/30 border border-yellow-400/60 flex items-center justify-center gap-2 animate-bounce">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-bold tracking-wide text-yellow-200 uppercase">
              ПОВЫШЕНИЕ В ЗВАНИИ: {formatRankRu(newRank)}!
            </span>
          </div>
        )}

        {/* Return to Map Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onReturnToMap();
          }}
          id="btn-case-closed-return"
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(217,119,6,0.4)] border border-amber-300 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>ВЕРНУТЬСЯ НА КАРТУ ГОРОДА</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
