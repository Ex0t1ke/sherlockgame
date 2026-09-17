import React, { useState } from 'react';
import { GameSaveData } from '../types';
import { formatRankRu } from './HeaderBar';
import { soundEngine } from '../audio/soundEngine';
import { 
  Settings, 
  X, 
  Save, 
  Download, 
  Upload, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsModalProps {
  currentSaveData?: GameSaveData;
  currentSave?: GameSaveData;
  onSaveToSlot?: (slotId: number) => void;
  onLoadFromSlot?: (slotId: number) => void;
  onLoadSave?: (save: GameSaveData) => void;
  onResetProgress?: () => void;
  onResetGame?: () => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentSaveData,
  currentSave,
  onSaveToSlot,
  onLoadFromSlot,
  onLoadSave,
  onResetProgress,
  onResetGame,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const effectiveSaveData: GameSaveData = currentSaveData || currentSave || {
    slotId: 1,
    timestamp: new Date().toISOString(),
    completedCaseIds: [],
    coins: 150,
    hintsRemaining: 3,
    unlockedDistricts: ['old_town'],
    rank: 'Amateur Sleuth',
    timeOfDay: 'sunset',
  };

  const handleSaveSlot = (slotId: number) => {
    if (onSaveToSlot) {
      onSaveToSlot(slotId);
    } else {
      const dataToSave = { ...effectiveSaveData, slotId, timestamp: new Date().toISOString() };
      localStorage.setItem(`sherlock_slot_${slotId}`, JSON.stringify(dataToSave));
    }
  };

  const handleLoadSlot = (slotId: number) => {
    if (onLoadFromSlot) {
      onLoadFromSlot(slotId);
    } else {
      try {
        const raw = localStorage.getItem(`sherlock_slot_${slotId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (onLoadSave) onLoadSave(parsed);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    if (onResetProgress) onResetProgress();
    else if (onResetGame) onResetGame();
  };

  const [activeTab, setActiveTab] = useState<'saves' | 'audio' | 'export'>('saves');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    window.setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleExportJson = () => {
    soundEngine.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(effectiveSaveData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sherlock_finder_save_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Файл сохранения успешно скачан!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.completedCaseIds)) {
          localStorage.setItem('sherlock_slot_1', JSON.stringify(parsed));
          handleLoadSlot(1);
          showNotification('Сохранение успешно импортировано!');
        } else {
          alert('Некорректный формат файла сохранения.');
        }
      } catch {
        alert('Ошибка при чтении JSON файла.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-amber-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wide">
              Настройки и Сохранения
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            id="btn-close-settings"
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('saves');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'saves'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Слоты игры
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('audio');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Звук и музыка
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('export');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Экспорт / Импорт
          </button>
        </div>

        {/* Notification Toast */}
        {successMessage && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-4 space-y-4">
          {/* TAB 1: 3 LocalStorage Save Slots */}
          {activeTab === 'saves' && (
            <div className="space-y-3">
              {[1, 2, 3].map((slotNum) => {
                let parsed: GameSaveData | null = null;
                try {
                  const raw = localStorage.getItem(`sherlock_slot_${slotNum}`);
                  if (raw) parsed = JSON.parse(raw);
                } catch {
                  parsed = null;
                }

                const solvedCount = Array.isArray(parsed?.completedCaseIds) ? parsed.completedCaseIds.length : 0;
                const slotRank = parsed?.rank ? formatRankRu(parsed.rank) : 'Любитель';
                const slotCoins = typeof parsed?.coins === 'number' ? parsed.coins : 0;

                return (
                  <div
                    key={slotNum}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-200">
                        Слот сохранения #{slotNum}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {parsed
                          ? `Дел раскрыто: ${solvedCount} • Звание: ${slotRank} • Монет: ${slotCoins}`
                          : 'Пустой слот'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          handleSaveSlot(slotNum);
                          showNotification(`Игра сохранена в Слот #${slotNum}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Сохранить текущую игру"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Сохранить</span>
                      </button>

                      {parsed && (
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            handleLoadSlot(slotNum);
                            showNotification(`Загружен Слот #${slotNum}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-slate-950 transition-colors cursor-pointer"
                        >
                          Загрузить
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Audio & Atmosphere Settings */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-amber-200">
                    Общий звук и нуар-музыка
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Сгенерированный процедурный джаз и шум дождя (Web Audio)
                  </div>
                </div>

                <button
                  onClick={() => {
                    onToggleMute();
                  }}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                ℹ️ Саундтрек воспроизводится в реальном времени с помощью мягких джазовых аккордов (Dm9, G13, Cmaj9) без использования сторонних аудиофайлов.
              </div>
            </div>
          )}

          {/* TAB 3: JSON File Export/Import & Reset */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="text-xs font-bold text-amber-200">
                  Резервное копирование данных
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportJson}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-amber-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Скачать JSON</span>
                  </button>

                  <label className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-amber-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Загрузить JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Game Section */}
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Сбросить весь прогресс</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Удаляет локальные сохранения и сбрасывает звание
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Вы уверены, что хотите сбросить прогресс расследований?')) {
                      soundEngine.playClick();
                      handleReset();
                      showNotification('Прогресс успешно сброшен.');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-500/40 text-xs font-semibold text-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сброс</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
