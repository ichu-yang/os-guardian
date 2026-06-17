/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PetType = 'CAT' | 'DOG' | 'MECH';

export type CatBreed = 
  | 'BRITISH' 
  | 'AMERICAN' 
  | 'MAINE' 
  | 'RAGDOLL' 
  | 'MIXED_TABBY' 
  | 'MIXED_ORANGE' 
  | 'MIXED_CALICO' 
  | 'MIXED_WHITE' 
  | 'MIXED_BLACK' 
  | 'MIXED_GREY';

export type DogBreed = 'HUSKY' | 'GERMAN_SHEPHERD' | 'BORDER_COLLIE' | 'LABRADOR' | 'SHIBA';
export type MechBreed = 'RACK_SERVER' | 'QUANTUM_CORE' | 'CYBERDECK' | 'MAINFRAME';

export type PetBreed = CatBreed | DogBreed | MechBreed;

export interface PetConfig {
  id: string;      // Unique ID for multiple pets
  type: PetType;
  breed: PetBreed;
  name: string;
  level: number;
  exp: number;
  satiety: number;     // 0 - 100
  affection: number;   // 0 - 100 好感度
  lastFedTime: number; // timestamp
}

export interface Task {
  id: string;
  category: 'daily' | 'achievement' | 'legendary';
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  lastCompletedDate?: string; // YYYY-MM-DD for daily limit
  progressMax?: number;
  progressCurrent?: number;
}

export interface ShopItem {
  id: string;
  type: 'FOOD' | 'TOY' | 'REAL_GIFT';
  title: string;
  description: string;
  cost: number;
  icon: string;
  // For Food / Toys
  satietyValue?: number;
  expValue?: number;
  affectionValue?: number;
  animationTrigger?: string;
  // For Real Gift
  stock: number;
  redemptionNote?: string;
}

export interface FortuneResult {
  luckLevel: '大吉' | '吉' | '中吉' | '小吉' | '末吉' | '凶' | '大凶';
  title: string;
  quote: string;
  advice: string;
  luckScore: number;
  luckyColor: string;
  luckyColorHex: string;
  luckyWeapon: string;
  date: string;
}

export interface HelpClaimRequest {
  id: string;
  time: number;
  questionTitle: string;
  solverName: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewComment?: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  isUser: boolean;
}

export interface GameSaveState {
  coins: number;
  pets: PetConfig[];
  activePetId: string | null;
  inventory: { [itemId: string]: number }; // item ID -> quantity
  tasks: Task[];
  shopItems: ShopItem[];
  recentFortunes: FortuneResult[];
  lastGachaDate?: string; // YYYY-MM-DD
  helpClaims: HelpClaimRequest[];
  adminCodeSession: string; 
  purchasedGifts: { itemId: string; redeemedAt: number; code: string }[];
  posts: Post[];
}

