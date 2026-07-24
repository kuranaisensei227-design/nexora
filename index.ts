export interface UserBoostLevel {
  tapPower: number;
  energyCapacity: number;
  rechargeSpeed: number;
}

export interface UserData {
  uid: string;
  telegramId: number | string;
  username: string;
  photo?: string;
  balance: number;
  totalTap: number;
  level: number;
  energy: number;
  maxEnergy: number;
  boostLevel: UserBoostLevel;
  referralCode: string;
  referredBy?: string;
  taskCompleted: string[];
  createdAt: number;
  lastDailyReward?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  reward: number;
  url: string;
  type: 'telegram' | 'twitter' | 'web';
}
