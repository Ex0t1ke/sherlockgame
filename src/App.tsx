import React, { useState, useEffect } from 'react';
import { 
  CaseDefinition, 
  ScreenState, 
  DetectiveRank, 
  TimeOfDay, 
  DistrictId, 
  GameSaveData 
} from './types';
import { CASES_DATA } from './data/casesData';
import { soundEngine } from './audio/soundEngine';
import { HeaderBar } from './components/HeaderBar';
import { MainMenu } from './components/MainMenu';
import { CityMap } from './components/CityMap';
import { DialogueView } from './components/DialogueView';
import { TravelTransition } from './components/TravelTransition';
import { HiddenObjectGame } from './components/HiddenObjectGame';
import { CaseCompletedModal } from './components/CaseCompletedModal';
import { DetectiveCasebook } from './components/DetectiveCasebook';
import { SettingsModal } from './components/SettingsModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function App() {
  // Screen & Navigation
  const [screen, setScreen] = useState<ScreenState>('menu');
  const [currentCase, setCurrentCase] = useState<CaseDefinition | null>(null);

  // Player Progression
  const [completedCaseIds, setCompletedCaseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sherlock_finder_completed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sherlock_finder_coins');
      if (saved) {
        const num = Number(saved);
        if (!isNaN(num)) return num;
      }
    } catch {
      // ignore
    }
    return 150;
  });

  const [hintsAvailable, setHintsAvailable] = useState<number>(3);
  const maxHints = 3;
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('sunset');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Safe progression array
  const safeCompletedCaseIds = Array.isArray(completedCaseIds) ? completedCaseIds : [];

  // Modals & UI Toggles
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Stats from completed case
  const [lastStats, setLastStats] = useState<{
    timeSeconds: number;
    wrongClicks: number;
    hintsUsedThisCase: number;
  } | null>(null);

  // Calculate Detective Rank based on cases solved
  const calculateRank = (solvedCount: number): DetectiveRank => {
    if (solvedCount >= 9) return 'Consulting Detective';
    if (solvedCount >= 6) return 'Chief Detective';
    if (solvedCount >= 3) return 'Senior Investigator';
    if (solvedCount >= 1) return 'Apprentice Detective';
    return 'Amateur Sleuth';
  };

  const currentRank = calculateRank(safeCompletedCaseIds.length);

  // Compute Unlocked Districts
  const getUnlockedDistricts = (solvedCount: number): DistrictId[] => {
    const list: DistrictId[] = ['old_town'];
    if (solvedCount >= 1) list.push('suburbs');
    if (solvedCount >= 2) list.push('port_area');
    if (solvedCount >= 3) list.push('business_district');
    if (solvedCount >= 4) list.push('university_campus');
    if (solvedCount >= 6) list.push('industrial_zone');
    return list;
  };

  const unlockedDistricts = getUnlockedDistricts(safeCompletedCaseIds.length);

  // Persist game state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sherlock_finder_completed', JSON.stringify(completedCaseIds));
      localStorage.setItem('sherlock_finder_coins', coins.toString());
    } catch {
      // ignore
    }
  }, [completedCaseIds, coins]);

  // Periodic Hint Recharge (recharges 1 hint every 60 seconds if below max)
  useEffect(() => {
    const rechargeInterval = window.setInterval(() => {
      setHintsAvailable((prev) => Math.min(maxHints, prev + 1));
    }, 60000);
    return () => clearInterval(rechargeInterval);
  }, []);

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Case Selection Handler
  const handleSelectCase = (caseDef: CaseDefinition) => {
    setCurrentCase(caseDef);
    setScreen('briefing');
  };

  // Case Briefing Complete -> Travel
  const handleBriefingComplete = () => {
    setScreen('travel');
  };

  // Travel Complete -> Arrival Dialogue
  const handleTravelComplete = () => {
    setScreen('arrival');
  };

  // Arrival Dialogue Complete -> Search Scene
  const handleArrivalComplete = () => {
    setScreen('search');
  };

  // Found Target Item -> Case Solved & Reward
  const handleFoundItem = (stats: {
    timeSeconds: number;
    wrongClicks: number;
    hintsUsedThisCase: number;
  }) => {
    setLastStats(stats);
    if (currentCase) {
      if (!completedCaseIds.includes(currentCase.id)) {
        setCompletedCaseIds((prev) => [...prev, currentCase.id]);
      }
      setCoins((c) => c + currentCase.rewardCoins + Math.max(0, 50 - stats.wrongClicks * 5));
    }
    setScreen('completed');
  };

  // Return to Map from Completed Screen
  const handleReturnToMap = () => {
    setScreen('map');
  };

  // Load Saved Game Data
  const handleLoadSave = (save: GameSaveData) => {
    setCompletedCaseIds(save.completedCaseIds || []);
    setCoins(save.coins || 150);
    setHintsAvailable(save.hintsRemaining || 3);
    setTimeOfDay(save.timeOfDay || 'sunset');
    setScreen('map');
    setIsSettingsOpen(false);
  };

  const currentSaveData: GameSaveData = {
    slotId: 1,
    timestamp: new Date().toISOString(),
    completedCaseIds,
    coins,
    hintsRemaining: hintsAvailable,
    unlockedDistricts,
    rank: currentRank,
    timeOfDay,
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* Outer Shell: Either Android Phone Bezel or Fluid Landscape Screen */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] h-[92vh] max-h-[860px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] ring-2 ring-slate-700/50 flex flex-col overflow-hidden relative'
            : 'max-w-7xl h-screen sm:h-[94vh] sm:rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative'
        }`}
      >
        {/* Android Phone Status Bar (when frame is enabled) */}
        {isPhoneFrame && (
          <div className="w-full bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 font-medium z-50 select-none border-b border-slate-900">
            <span>22:10</span>
            {/* Camera Punch Hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Global Top Header Bar */}
        <HeaderBar
          rank={currentRank}
          coins={coins}
          hintsAvailable={hintsAvailable}
          maxHints={maxHints}
          timeOfDay={timeOfDay}
          onTimeOfDayChange={setTimeOfDay}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenNotebook={() => setIsNotebookOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
          onGoToMap={() => setScreen('map')}
          currentScreen={screen}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Dynamic Screen Router */}
        <main className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
          {/* Screen 1: Main Menu */}
          {screen === 'menu' && (
            <MainMenu
              onNewGame={() => setScreen('map')}
              onContinue={() => setScreen('map')}
              onOpenArchive={() => setIsNotebookOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
              hasSavedGame={safeCompletedCaseIds.length > 0}
              completedCount={safeCompletedCaseIds.length}
              totalCount={CASES_DATA.length}
            />
          )}

          {/* Screen 2: City Map Hub */}
          {screen === 'map' && (
            <CityMap
              cases={CASES_DATA}
              completedCaseIds={safeCompletedCaseIds}
              unlockedDistricts={unlockedDistricts}
              timeOfDay={timeOfDay}
              onSelectCase={handleSelectCase}
              onOpenOffice={() => setIsNotebookOpen(true)}
            />
          )}

          {/* Screen 3: Phase 1 - Case Briefing Dialogue */}
          {screen === 'briefing' && currentCase && (
            <DialogueView
              currentCase={currentCase}
              phase="briefing"
              onPhaseComplete={handleBriefingComplete}
            />
          )}

          {/* Screen 4: Phase 2 - Travel Transition */}
          {screen === 'travel' && currentCase && (
            <TravelTransition
              currentCase={currentCase}
              onComplete={handleTravelComplete}
            />
          )}

          {/* Screen 5: Phase 3 - Arrival Dialogue */}
          {screen === 'arrival' && currentCase && (
            <DialogueView
              currentCase={currentCase}
              phase="arrival"
              onPhaseComplete={handleArrivalComplete}
            />
          )}

          {/* Screen 6: Phase 4 - Core Hidden Object Scene */}
          {screen === 'search' && currentCase && (
            <HiddenObjectGame
              currentCase={currentCase}
              hintsAvailable={hintsAvailable}
              onUseHint={() => setHintsAvailable((h) => Math.max(0, h - 1))}
              onFoundItem={handleFoundItem}
              onReturnToMap={() => setScreen('map')}
            />
          )}

          {/* Screen 7: Case Completed Modal */}
          {screen === 'completed' && currentCase && lastStats && (
            <CaseCompletedModal
              currentCase={currentCase}
              stats={lastStats}
              currentRank={currentRank}
              onReturnToMap={handleReturnToMap}
            />
          )}
        </main>

        {/* Android Gesture Bar (when phone frame active) */}
        {isPhoneFrame && (
          <div className="w-full bg-slate-950 py-1.5 flex justify-center z-50 border-t border-slate-900">
            <div className="w-32 h-1 rounded-full bg-slate-600" />
          </div>
        )}
      </div>

      {/* Casebook Modal */}
      {isNotebookOpen && (
        <DetectiveCasebook
          cases={CASES_DATA}
          completedCaseIds={safeCompletedCaseIds}
          currentRank={currentRank}
          playerRank={currentRank}
          coins={coins}
          totalStars={safeCompletedCaseIds.length * 3}
          onClose={() => setIsNotebookOpen(false)}
          onSelectCase={(c) => {
            handleSelectCase(c);
            setIsNotebookOpen(false);
          }}
          onSelectCaseToReplay={(c) => {
            handleSelectCase(c);
            setIsNotebookOpen(false);
          }}
        />
      )}

      {/* Settings & Save Slots Modal */}
      {isSettingsOpen && (
        <SettingsModal
          currentSaveData={currentSaveData}
          currentSave={currentSaveData}
          onLoadSave={handleLoadSave}
          onResetGame={() => {
            setCompletedCaseIds([]);
            setCoins(150);
            setScreen('menu');
            setIsSettingsOpen(false);
          }}
          onResetProgress={() => {
            setCompletedCaseIds([]);
            setCoins(150);
            setScreen('menu');
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Android Kotlin Source Code & Studio Export Modal */}
      {isAndroidCodeOpen && (
        <AndroidCodeModal onClose={() => setIsAndroidCodeOpen(false)} />
      )}
    </div>
  );
}
