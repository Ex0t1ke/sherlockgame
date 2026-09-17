import React, { useState } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { 
  FileCode2, 
  Copy, 
  Check, 
  X, 
  Smartphone, 
  Layers, 
  Database, 
  FolderTree, 
  Terminal
} from 'lucide-react';

interface AndroidCodeModalProps {
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('GameViewModel.kt');
  const [copied, setCopied] = useState<boolean>(false);

  const codeFiles: Record<string, { lang: string; code: string; desc: string }> = {
    'GameViewModel.kt': {
      lang: 'kotlin',
      desc: 'Архитектура MVVM: управление GameState, инструментами, инвентарём и StateFlow',
      code: `package com.sherlockfinder.game.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sherlockfinder.game.data.model.*
import com.sherlockfinder.game.data.repository.CaseRepository
import com.sherlockfinder.game.audio.SoundPoolManager
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

sealed interface GameUiState {
    object MainMenu : GameUiState
    data class CityMap(val unlockedDistricts: Set<DistrictId>, val cases: List<CaseDefinition>) : GameUiState
    data class DialoguePhase(val currentCase: CaseDefinition, val node: DialogueNode, val phase: PhaseType) : GameUiState
    data class HiddenObjectSearch(val currentCase: CaseDefinition, val activeTool: ActiveTool, val hintsRemaining: Int) : GameUiState
    data class CaseSolved(val currentCase: CaseDefinition, val score: ScoreResult) : GameUiState
}

class GameViewModel(
    private val caseRepository: CaseRepository,
    private val soundManager: SoundPoolManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<GameUiState>(GameUiState.MainMenu)
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    private val _coins = MutableStateFlow(150)
    val coins: StateFlow<Int> = _coins.asStateFlow()

    private val _hints = MutableStateFlow(3)
    val hints: StateFlow<Int> = _hints.asStateFlow()

    private val _activeTool = MutableStateFlow<ActiveTool>(ActiveTool.Magnifier)
    val activeTool: StateFlow<ActiveTool> = _activeTool.asStateFlow()

    fun selectCase(caseDefinition: CaseDefinition) {
        soundManager.playClick()
        _uiState.value = GameUiState.DialoguePhase(
            currentCase = caseDefinition,
            node = caseDefinition.dialogue.briefingNodes[caseDefinition.dialogue.briefingStartNodeId]!!,
            phase = PhaseType.Briefing
        )
    }

    fun startHiddenObjectSearch(caseDefinition: CaseDefinition) {
        _uiState.value = GameUiState.HiddenObjectSearch(
            currentCase = caseDefinition,
            activeTool = _activeTool.value,
            hintsRemaining = _hints.value
        )
    }

    fun onObjectClicked(obj: InteractiveObject, currentCase: CaseDefinition) {
        when (obj.type) {
            ObjectType.TARGET -> {
                soundManager.playEureka()
                completeCase(currentCase)
            }
            ObjectType.MOVABLE -> {
                soundManager.playMoveObject()
                // Displace object coordinates to reveal hidden items beneath
            }
            ObjectType.CLUE -> {
                soundManager.playInspection()
            }
        }
    }

    fun useWatsonHint() {
        if (_hints.value > 0) {
            _hints.value -= 1
            soundManager.playHintShimmer()
        }
    }

    private fun completeCase(caseDef: CaseDefinition) {
        viewModelScope.launch {
            caseRepository.markCaseCompleted(caseDef.id)
            _coins.value += caseDef.rewardCoins
            soundManager.playVictory()
            _uiState.value = GameUiState.CaseSolved(
                currentCase = caseDef,
                score = ScoreResult(stars = 3, bonusCoins = 50)
            )
        }
    }
}`
    },
    'HiddenObjectScene.kt': {
      lang: 'kotlin',
      desc: 'Jetpack Compose Canvas & Gestures handling interactive clutter, zoom/pan, UV Light, & Magnifier',
      code: `package com.sherlockfinder.game.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.input.pointer.pointerInput
import com.sherlockfinder.game.data.model.*

@Composable
fun HiddenObjectSceneComposable(
    caseDefinition: CaseDefinition,
    activeTool: ActiveTool,
    onObjectClicked: (InteractiveObject) -> Unit,
    modifier: Modifier = Modifier
) {
    var scale by remember { mutableStateOf(1f) }
    var offset by remember { mutableStateOf(Offset.Zero) }
    var cursorPosition by remember { mutableStateOf(Offset.Zero) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTransformGestures { _, pan, zoom, _ ->
                    scale = (scale * zoom).coerceIn(1f, 3f)
                    offset = Offset(offset.x + pan.x, offset.y + pan.y)
                }
            }
            .pointerInput(Unit) {
                detectTapGestures { tapOffset ->
                    cursorPosition = tapOffset
                    // Raycast hit-test against InteractiveObject bounding boxes
                    val relativeX = (tapOffset.x - offset.x) / scale
                    val relativeY = (tapOffset.y - offset.y) / scale
                    caseDefinition.interactiveObjects.find { obj ->
                        obj.hitTest(relativeX, relativeY)
                    }?.let { hitObj ->
                        onObjectClicked(hitObj)
                    }
                }
            }
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            translate(offset.x, offset.y) {
                scale(scale, scale) {
                    // Draw room wallpaper, floor parquet, and furniture silhouettes
                    drawRect(Color(0xFF0F172A))
                    
                    // Render interactive objects
                    caseDefinition.interactiveObjects.forEach { obj ->
                        drawInteractiveObject(obj, activeTool)
                    }
                }
            }

            // Draw Magnifying Glass loupe if tool is active
            if (activeTool == ActiveTool.Magnifier) {
                drawCircle(
                    color = Color(0xFFF59E0B),
                    radius = 90f,
                    center = cursorPosition,
                    style = androidx.compose.ui.graphics.drawscope.Stroke(width = 6f)
                )
            }
        }
    }
}`
    },
    'DialogueEngine.kt': {
      lang: 'kotlin',
      desc: 'Visual Novel branching dialogue composable with typewriter animation and character portraits',
      code: `package com.sherlockfinder.game.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.sherlockfinder.game.data.model.*
import kotlinx.coroutines.delay

@Composable
fun DialogueEngineComposable(
    dialogueNode: DialogueNode,
    client: ClientProfile,
    onChoiceSelected: (DialogueChoice) -> Unit,
    onNextClicked: () -> Unit
) {
    var displayedText by remember(dialogueNode.id) { mutableStateOf("") }
    var isTyping by remember(dialogueNode.id) { mutableStateOf(true) }

    LaunchedEffect(dialogueNode.text) {
        isTyping = true
        displayedText = ""
        dialogueNode.text.forEach { char ->
            displayedText += char
            delay(25)
        }
        isTyping = false
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Client Portrait with dynamic emotional expression
        ClientPortraitComposable(
            client = client,
            expression = dialogueNode.expression,
            modifier = Modifier.weight(1f).align(Alignment.CenterHorizontally)
        )

        // Visual Novel Vintage Textbox
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = dialogueNode.speaker,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = displayedText,
                    style = MaterialTheme.typography.bodyLarge
                )

                if (!isTyping && dialogueNode.choices.isNotEmpty()) {
                    dialogueNode.choices.forEach { choice ->
                        OutlinedButton(
                            onClick = { onChoiceSelected(choice) },
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                        ) {
                            Text(choice.text)
                        }
                    }
                } else if (!isTyping) {
                    Button(
                        onClick = onNextClicked,
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Continue")
                    }
                }
            }
        }
    }
}`
    },
    'CaseDatabase.kt': {
      lang: 'kotlin',
      desc: 'Room Database Entity & DAO for offline SQLite persistence',
      code: `package com.sherlockfinder.game.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "completed_cases")
data class CaseRecord(
    @PrimaryKey val caseId: String,
    val completionTimestamp: Long,
    val starsEarned: Int,
    val bestTimeSeconds: Int,
    val hintsUsed: Int
)

@Dao
interface CaseDao {
    @Query("SELECT * FROM completed_cases")
    fun getAllCompletedCases(): Flow<List<CaseRecord>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun recordSolvedCase(caseRecord: CaseRecord)

    @Query("SELECT COUNT(*) FROM completed_cases")
    suspend fun getSolvedCount(): Int
}

@Database(entities = [CaseRecord::class], version = 1)
abstract class SherlockDatabase : RoomDatabase() {
    abstract fun caseDao(): CaseDao
}`
    },
    'AndroidManifest.xml': {
      lang: 'xml',
      desc: 'Android Manifest configuring full screen game, audio permissions, and screen orientation',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sherlockfinder.game">

    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SherlockFinder">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="sensorLandscape"
            android:theme="@style/Theme.SherlockFinder.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    },
    'build.gradle.kts': {
      lang: 'kotlin',
      desc: 'Gradle build configuration with Jetpack Compose, Room, and Navigation dependencies',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.sherlockfinder.game"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sherlockfinder.game"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
}`
    }
  };

  const handleCopy = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(codeFiles[selectedFile].code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[750px] bg-[#0c1017] border-2 border-emerald-500/50 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-emerald-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="w-full bg-slate-900 border-b border-emerald-500/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-mono font-bold text-sm text-emerald-300">
                Проект Android Studio и код на Kotlin / Jetpack Compose
              </h3>
              <p className="text-[11px] text-slate-400">
                Полноценная архитектура MVVM, база данных Room и UI на Jetpack Compose
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано!' : 'Копировать код'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar files & Code viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Tree */}
          <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950/80 p-3 overflow-y-auto">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
              <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
              <span>Структура проекта</span>
            </div>

            <div className="flex flex-col gap-1 text-xs font-mono">
              {Object.keys(codeFiles).map((fileName) => {
                const isSelected = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedFile(fileName);
                    }}
                    className={`text-left px-3 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-sm'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </button>
                );
              })}
            </div>

            {/* Architecture Card */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Паттерн MVVM Compose
              </div>
              Полностью модульная архитектура: корутины Kotlin, StateFlow, база данных Room SQLite, звуки SoundPool и кастомные жесты Canvas.
            </div>
          </div>

          {/* Code Inspector Area */}
          <div className="flex-1 flex flex-col bg-[#070a10] overflow-hidden">
            {/* File info banner */}
            <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 bg-slate-900/50 flex items-center justify-between">
              <span>{codeFiles[selectedFile].desc}</span>
              <span className="font-mono text-emerald-400 uppercase text-[10px]">
                {codeFiles[selectedFile].lang}
              </span>
            </div>

            {/* Syntax-highlighted code container */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed selection:bg-emerald-800">
              <pre>
                <code>{codeFiles[selectedFile].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
