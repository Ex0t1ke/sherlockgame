import { DistrictId, DetectiveRank } from '../types';

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  subtitle: string;
  unlockedAtRank: DetectiveRank;
  casesCount: number;
  accentColor: string;
  icon: string;
}

export const DISTRICTS: DistrictInfo[] = [
  {
    id: 'old_town',
    name: 'Старый город',
    subtitle: 'Брусчатые мостовые, газовые фонари, антикварные лавки и викторианские особняки',
    unlockedAtRank: 'Amateur Sleuth',
    casesCount: 2,
    accentColor: '#d97706',
    icon: 'Landmark',
  },
  {
    id: 'business_district',
    name: 'Деловой квартал',
    subtitle: 'Небоскрёбы, пентхаусы финансистов, банки и штаб-квартира полиции',
    unlockedAtRank: 'Apprentice Detective',
    casesCount: 2,
    accentColor: '#0ea5e9',
    icon: 'Building2',
  },
  {
    id: 'suburbs',
    name: 'Пригород',
    subtitle: 'Студенческие общежития кампуса, тихие аллеи и модные ателье',
    unlockedAtRank: 'Amateur Sleuth',
    casesCount: 2,
    accentColor: '#ec4899',
    icon: 'Home',
  },
  {
    id: 'industrial_zone',
    name: 'Промзона',
    subtitle: 'Склады, паровые трубы, авторемонтные мастерские и заводские цеха',
    unlockedAtRank: 'Senior Investigator',
    casesCount: 1,
    accentColor: '#3b82f6',
    icon: 'Factory',
  },
  {
    id: 'port_area',
    name: 'Портовый район',
    subtitle: 'Причалы, туманные доки, крики чаек и уютные рыбные траттории',
    unlockedAtRank: 'Apprentice Detective',
    casesCount: 1,
    accentColor: '#f97316',
    icon: 'Anchor',
  },
  {
    id: 'university_campus',
    name: 'Университетский кампус',
    subtitle: 'Готические библиотеки, научные лаборатории и архивы древностей',
    unlockedAtRank: 'Senior Investigator',
    casesCount: 2,
    accentColor: '#8b5cf6',
    icon: 'GraduationCap',
  },
];
