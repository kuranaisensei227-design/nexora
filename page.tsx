'use client';

import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import Navigation from '@/components/Navigation';
import HomeTab from '@/components/HomeTab';
import BoostTab from '@/components/BoostTab';
import { UserData } from '@/types';

export default function App() {
  const { user, triggerHaptic } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');

  const [userData, setUserData] = useState<UserData>({
    uid: user?.id?.toString() || 'guest_123',
    telegramId: user?.id || 12345678,
    username: user?.username || 'Guest Miner',
    balance: 5000,
    totalTap: 0,
    level: 1,
    energy: 1000,
    maxEnergy: 1000,
    boostLevel: {
      tapPower: 1,
      energyCapacity: 1,
      rechargeSpeed: 1,
    },
    referralCode: 'NEX-998',
    taskCompleted: [],
    createdAt: Date.now(),
  });

  return (
    <main className="min-h-screen bg-[#080b11] text-white selection:bg-purple-500/30">
      {activeTab === 'home' && (
        <HomeTab userData={userData} setUserData={setUserData} triggerHaptic={triggerHaptic} />
      )}
      {activeTab === 'boost' && (
        <BoostTab userData={userData} setUserData={setUserData} triggerHaptic={triggerHaptic} />
      )}
      {/* Referral, Task, Profile tabs implementation standard structure */}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} triggerHaptic={triggerHaptic} />
    </main>
  );
}
