import { CaseDefinition } from '../types';
import { CASES_1_TO_5 } from './casesBatch1';
import { CASES_6_TO_10 } from './casesBatch2';
import { DISTRICTS } from './districtsData';

export const ALL_CASES: CaseDefinition[] = [
  ...CASES_1_TO_5,
  ...CASES_6_TO_10,
];

// Alias for backwards compatibility
export const CASES_DATA = ALL_CASES;

export { DISTRICTS };
