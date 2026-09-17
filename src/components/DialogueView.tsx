import React, { useState, useEffect, useRef } from 'react';
import { CaseDefinition, DialogueNode, DialogueChoice } from '../types';
import { ClientPortrait } from './ClientPortrait';
import { soundEngine } from '../audio/soundEngine';
import { MessageSquare, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface DialogueViewProps {
  currentCase: CaseDefinition;
  phase: 'briefing' | 'arrival' | 'completion';
  onPhaseComplete: () => void;
  onClueDiscovered?: (clue: string) => void;
}

export const DialogueView: React.FC<DialogueViewProps> = ({
  currentCase,
  phase,
  onPhaseComplete,
  onClueDiscovered,
}) => {
  const dialoguePhases = currentCase.dialogue;
  const initialNodeId =
    phase === 'briefing'
      ? dialoguePhases.briefingStartNodeId
      : phase === 'arrival'
      ? dialoguePhases.arrivalStartNodeId
      : dialoguePhases.completionStartNodeId;

  const nodeMap =
    phase === 'briefing'
      ? dialoguePhases.briefingNodes
      : phase === 'arrival'
      ? dialoguePhases.arrivalNodes
      : dialoguePhases.completionNodes;

  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const typewriterTimerRef = useRef<number | null>(null);

  const currentNode: DialogueNode | undefined = nodeMap[currentNodeId];

  // Typewriter animation effect with soft audio click
  useEffect(() => {
    if (!currentNode) return;

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    const fullText = currentNode?.text || '';

    typewriterTimerRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex % 3 === 0) {
        soundEngine.playTypewriter();
      }

      if (charIndex >= fullText.length) {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
        }
        setIsTyping(false);
      }
    }, 22);

    return () => {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
    };
  }, [currentNodeId, currentNode]);

  // Fast forward text typing on tap
  const handleFastForward = () => {
    if (isTyping && currentNode) {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    }
  };

  const handleSelectChoice = (choice: DialogueChoice) => {
    soundEngine.playClick();
    if (choice.givesClue) {
      setDiscoveredClues((prev) => [...prev, choice.givesClue!]);
      if (onClueDiscovered) {
        onClueDiscovered(choice.givesClue);
      }
    }
    if (choice.nextNodeId && nodeMap[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
    } else {
      onPhaseComplete();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentNode?.nextNodeId && nodeMap[currentNode.nextNodeId]) {
      setCurrentNodeId(currentNode.nextNodeId);
    } else {
      onPhaseComplete();
    }
  };

  if (!currentNode) {
    return null;
  }

  const isOffice = phase === 'briefing';

  return (
    <div
      onClick={handleFastForward}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-4 sm:p-8 bg-slate-950 text-amber-50 select-none overflow-hidden"
    >
      {/* Visual Novel Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isOffice ? (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-stone-900 to-amber-950/80">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-b ${currentCase.sceneTheme.bgGradient}`}>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent" />
          </div>
        )}
      </div>

      {/* Top Phase Header / Location Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-md shadow-lg">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
            {phase === 'briefing'
              ? 'Фаза 1: Брифинг в кабинете (Бейкер-стрит, 221B)'
              : phase === 'arrival'
              ? `Фаза 3: Прибытие на место — ${currentCase.client.locationName}`
              : 'Фаза 4: Дело раскрыто • Дебрифинг'}
          </span>
        </div>

        {discoveredClues.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs text-amber-300 shadow">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Найдено зацепок: {discoveredClues.length}</span>
          </div>
        )}
      </div>

      {/* Center Character Art Display */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4">
        {currentNode.isClient ? (
          <div className="flex flex-col items-center">
            <ClientPortrait
              client={currentCase.client}
              expression={currentNode.expression || 'normal'}
              size="hero"
              isSpeaking={isTyping}
              className="border-2 border-amber-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transform hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="mt-2 px-3 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-serif font-bold text-amber-300 tracking-wider">
              {currentCase.client.title}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-44 h-52 sm:w-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-amber-500/40 flex items-center justify-center shadow-2xl p-4">
              <svg viewBox="0 0 100 120" className="w-full h-full text-amber-400">
                <circle cx="50" cy="40" r="22" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
                <path d="M 28 35 C 28 20 72 20 72 35 Z" fill="#0f172a" />
                <path d="M 22 35 Q 12 38 10 42 Q 25 40 32 36 Z" fill="#b45309" />
                <path d="M 78 35 Q 88 38 90 42 Q 75 40 68 36 Z" fill="#b45309" />
                <path d="M 15 110 C 20 75 40 65 50 65 C 60 65 80 75 85 110 Z" fill="#0f172a" />
                <path d="M 42 50 Q 32 55 30 48" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="mt-2 px-3 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-serif font-bold text-amber-300 tracking-wider">
              Шерлок Холмс (Частный детектив)
            </div>
          </div>
        )}
      </div>

      {/* Visual Novel Text Box with Vintage Paper Accent & Choices */}
      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col gap-3">
        {/* Dialogue Box */}
        <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/95 to-slate-950/98 border-2 border-amber-500/50 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          {/* Speaker Nameplate */}
          <div className="absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 border border-amber-300 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow">
            {currentNode.speaker}
          </div>

          {/* Typewriter Dialogue Content */}
          <p className="font-story text-sm sm:text-base leading-relaxed text-amber-50 mt-1 min-h-[60px]">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse" />}
          </p>

          {/* Continue / Next Button */}
          {(!currentNode.choices || currentNode.choices.length === 0) && (
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={isTyping}
                id="btn-dialogue-continue"
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow cursor-pointer ${
                  isTyping
                    ? 'opacity-40 bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950 border border-amber-400 hover:scale-105 active:scale-95'
                }`}
              >
                <span>
                  {currentNode.nextNodeId
                    ? 'ПРОДОЛЖИТЬ'
                    : phase === 'briefing'
                    ? 'ПРИНЯТЬ ДЕЛО И ВЫЕХАТЬ'
                    : phase === 'arrival'
                    ? 'НАЧАТЬ ПОИСК'
                    : 'ДЕЛО РАСКРЫТО'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Branching Dialogue Choices (Investigative Questions) */}
        {!isTyping && currentNode.choices && currentNode.choices.length > 0 && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold px-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Вопросы для расследования (выберите вариант):</span>
            </div>

            {currentNode.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChoice(choice);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-xs sm:text-sm font-medium text-amber-100 hover:text-amber-200 transition-all flex items-center justify-between shadow-md group hover:translate-x-1 cursor-pointer"
              >
                <span>«{choice.text}»</span>
                <ArrowRight className="w-4 h-4 text-amber-400 opacity-70 group-hover:opacity-100 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
