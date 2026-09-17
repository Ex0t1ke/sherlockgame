export type DistrictId = 'old_town' | 'business_district' | 'suburbs' | 'industrial_zone' | 'port_area' | 'university_campus';

export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'rain' | 'fog' | 'clear';

export type DetectiveRank = 
  | 'Rookie'
  | 'Junior Detective'
  | 'Detective'
  | 'Senior Detective'
  | 'Master Detective'
  | 'Legendary Sherlock'
  | 'Amateur Sleuth'
  | 'Apprentice Detective'
  | 'Senior Investigator'
  | 'Chief Detective'
  | 'Consulting Detective';

export interface GameSaveData {
  slotId: number;
  timestamp: string;
  completedCaseIds: string[];
  coins: number;
  hintsRemaining: number;
  unlockedDistricts: DistrictId[];
  rank: DetectiveRank;
  timeOfDay: TimeOfDay;
}

export interface ClientProfile {
  id: string;
  name: string;
  title: string;
  avatarColor: string;
  accentColor: string;
  description: string;
  lostItemName: string;
  lostItemDescription: string;
  districtId: DistrictId;
  locationName: string;
  personality: string;
  svgCharacterType: 'eleanor' | 'tommy' | 'antonio' | 'sarah' | 'hartmann' | 'lily' | 'victor' | 'olga' | 'jake' | 'amara';
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string;
  givesClue?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  isClient: boolean;
  expression?: 'normal' | 'worried' | 'thinking' | 'relieved' | 'happy';
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  clueDiscovered?: string;
}

export interface CaseDialoguePhases {
  briefingStartNodeId: string;
  briefingNodes: Record<string, DialogueNode>;
  arrivalStartNodeId: string;
  arrivalNodes: Record<string, DialogueNode>;
  completionStartNodeId: string;
  completionNodes: Record<string, DialogueNode>;
}

export interface InteractiveObject {
  id: string;
  name: string;
  type: 'movable' | 'container' | 'target' | 'clue' | 'distraction';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  rotation?: number;
  zIndex: number;
  isOpen?: boolean;
  isMoved?: boolean;
  revealsObjectId?: string; // id of object beneath
  colorTheme: string;
  iconName?: string;
  label: string;
  details?: string;
  isMetallic?: boolean;
  hasFingerprints?: boolean;
  hasUvMark?: boolean;
  uvClueText?: string;
}

export interface CaseDefinition {
  id: string;
  caseNumber: number;
  title: string;
  districtId: DistrictId;
  locationName: string;
  client: ClientProfile;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  minRank: DetectiveRank;
  rewardCoins: number;
  rewardStars: number;
  sceneTheme: {
    bgGradient: string;
    ambientColor: string;
    wallColor: string;
    floorColor: string;
    roomDescription: string;
  };
  targetItem: {
    id: string;
    name: string;
    description: string;
    icon: string;
    initialHidden: boolean; // hidden beneath something
    hiddenBeneathId?: string;
  };
  interactiveObjects: InteractiveObject[];
  easterEgg: {
    name: string;
    hint: string;
    description: string;
  };
  dialogue: CaseDialoguePhases;
}

export type ActiveTool = 'none' | 'magnifier' | 'uv' | 'fingerprints' | 'detector';

export interface GameStats {
  casesSolved: number;
  totalTimeSpentSeconds: number;
  totalWrongClicks: number;
  hintsUsed: number;
  fastestCaseTime: number;
  perfectCases: number; // no hints
  starsEarned: number;
  coinsEarned: number;
}

export interface SaveSlotData {
  id: number;
  timestamp: number;
  playerRank: DetectiveRank;
  reputationStars: number;
  coins: number;
  unlockedDistricts: DistrictId[];
  completedCaseIds: string[];
  currentCaseId: string | null;
  stats: GameStats;
  notesCollected: { caseId: string; title: string; clue: string; date: string }[];
  equippedOutfit: string;
  settings: {
    soundMuted: boolean;
    musicVolume: number;
    sfxVolume: number;
    colorblindMode: boolean;
    largeText: boolean;
    deviceFrameMode: boolean;
  };
}

export type ScreenState = 
  | 'menu'
  | 'map'
  | 'briefing'
  | 'travel'
  | 'arrival'
  | 'search'
  | 'completion'
  | 'archive'
  | 'android_code';
