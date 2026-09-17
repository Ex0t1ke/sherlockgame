import React, { useState } from 'react';
import { CaseDefinition, DetectiveRank } from '../types';
import { ClientPortrait } from './ClientPortrait';
import { formatRankRu } from './HeaderBar';
import { getDistrictNameRu } from './CityMap';
import { soundEngine } from '../audio/soundEngine';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  X, 
  Star, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Sparkles,
  Coins
} from 'lucide-react';

interface DetectiveCasebookProps {
  cases?: CaseDefinition[];
  completedCaseIds?: string[];
  playerRank?: DetectiveRank;
  currentRank?: DetectiveRank;
  coins?: number;
  totalStars?: number;
  onClose: () => void;
  onSelectCase?: (caseItem: CaseDefinition) => void;
  onSelectCaseToReplay?: (caseItem: CaseDefinition) => void;
}

export const DetectiveCasebook: React.FC<DetectiveCasebookProps> = ({
  cases = [],
  completedCaseIds = [],
  playerRank,
  currentRank,
  coins = 0,
  totalStars,
  onClose,
  onSelectCase,
  onSelectCaseToReplay,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'clients' | 'stats'>('cases');
  const safeCases = Array.isArray(cases) ? cases : [];
  const safeCompletedCaseIds = Array.isArray(completedCaseIds) ? completedCaseIds : [];
  const effectiveRank: DetectiveRank = playerRank || currentRank || 'Amateur Sleuth';
  const effectiveStars = typeof totalStars === 'number' ? totalStars : safeCompletedCaseIds.length * 3;
  const handleCaseSelect = onSelectCase || onSelectCaseToReplay || (() => {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[94vh] max-h-[720px] bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-600/50 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col text-amber-50 overflow-hidden">
        {/* Vintage Leather Book Header */}
        <div className="w-full bg-stone-950/90 border-b border-amber-500/30 px-4 py-2 sm:px-5 sm:py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-sm sm:text-lg tracking-widest text-amber-200 uppercase">
              Дневник Сыщика • Бейкер-стрит, 221B
            </h3>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            id="btn-close-casebook"
            className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 pt-1.5 sm:px-6 sm:pt-3 border-b border-stone-800 bg-stone-950/40 shrink-0">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('cases');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'cases'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Архив дел ({safeCompletedCaseIds.length}/{safeCases.length})</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('clients');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Досье клиентов ({safeCases.length})</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('stats');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Статистика и звание</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-900/50">
          {/* TAB 1: Case Files Archive */}
          {activeTab === 'cases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeCases.map((c) => {
                const isCompleted = safeCompletedCaseIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? 'bg-stone-850/80 border-emerald-500/40 shadow-md'
                        : 'bg-stone-850/50 border-stone-700/80 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        ДЕЛО №{c.caseNumber} • {getDistrictNameRu(c.districtId)}
                      </span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Раскрыто</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-500">В процессе</span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-base text-amber-100 mt-1">
                      {c.title}
                    </h4>
                    <p className="text-xs text-stone-300 line-clamp-2 mt-1 font-story">
                      {c.client.lostItemDescription}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-stone-400 truncate max-w-[170px]">
                        Клиент: <strong className="text-amber-200">{c.client.name}</strong>
                      </span>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onClose();
                          handleCaseSelect(c);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer"
                      >
                        <span>{isCompleted ? 'Переиграть' : 'Расследовать'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Clients Dossier */}
          {activeTab === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeCases.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-stone-850/70 border border-stone-700/80 p-4 flex gap-4 items-start shadow"
                >
                  <ClientPortrait client={c.client} size="md" expression="normal" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-amber-200">
                      {c.client.name}
                    </h4>
                    <div className="text-[11px] text-amber-400 font-semibold">
                      {c.client.title}
                    </div>
                    <div className="text-xs text-stone-300 mt-1">
                      {c.client.description}
                    </div>

                    <div className="mt-2 text-[11px] text-stone-400 bg-stone-900/60 p-2 rounded-lg border border-stone-800">
                      <span className="text-amber-300 font-semibold">Утраченная вещь:</span>{' '}
                      {c.client.lostItemName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Detective Rank & Stats */}
          {activeTab === 'stats' && (
            <div className="flex flex-col items-center max-w-md mx-auto text-center py-6">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Текущее звание Скотланд-Ярда:
              </span>
              <h3 className="font-serif font-black text-2xl text-amber-100 mt-1">
                {formatRankRu(effectiveRank)}
              </h3>

              <div className="w-full grid grid-cols-2 gap-3 mt-6">
                <div className="bg-stone-850 border border-stone-700 p-4 rounded-2xl">
                  <div className="text-xs text-stone-400">Раскрыто дел</div>
                  <div className="font-mono font-bold text-xl text-emerald-400 mt-1">
                    {safeCompletedCaseIds.length} / {safeCases.length}
                  </div>
                </div>

                <div className="bg-stone-850 border border-stone-700 p-4 rounded-2xl">
                  <div className="text-xs text-stone-400">Баланс монет</div>
                  <div className="font-mono font-bold text-xl text-yellow-300 mt-1 flex items-center justify-center gap-1">
                    <Coins className="w-4 h-4" /> {coins}
                  </div>
                </div>

                <div className="bg-stone-850 border border-stone-700 p-4 rounded-2xl col-span-2">
                  <div className="text-xs text-stone-400">Репутация сыщика</div>
                  <div className="font-mono font-bold text-xl text-amber-300 mt-1 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {effectiveStars} звёзд
                  </div>
                </div>
              </div>

              <p className="mt-8 text-xs text-stone-400 italic font-story">
                «Вы смотрите, но вы не наблюдаете. А это большая разница!» — Шерлок Холмс
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
