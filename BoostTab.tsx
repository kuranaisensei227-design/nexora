'use client';

import { UserData } from '@/types';
import { Zap, HandTap, BatteryCharging } from 'lucide-react';

interface BoostTabProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  triggerHaptic: () => void;
}

export default function BoostTab({ userData, setUserData, triggerHaptic }: BoostTabProps) {
  const handleUpgrade = (type: keyof UserData['boostLevel'], cost: number) => {
    if (userData.balance < cost) return;

    triggerHaptic();
    setUserData((prev) => ({
      ...prev,
      balance: prev.balance - cost,
      boostLevel: {
        ...prev.boostLevel,
        [type]: prev.boostLevel[type] + 1,
      },
      ...(type === 'energyCapacity' ? { maxEnergy: prev.maxEnergy + 500 } : {}),
    }));
  };

  const boosts = [
    {
      id: 'tapPower',
      name: 'Multitap',
      icon: HandTap,
      level: userData.boostLevel.tapPower,
      cost: userData.boostLevel.tapPower * 1000,
      desc: 'Increase coins earned per tap',
    },
    {
      id: 'energyCapacity',
      name: 'Energy Limit',
      icon: Zap,
      level: userData.boostLevel.energyCapacity,
      cost: userData.boostLevel.energyCapacity * 1000,
      desc: '+500 max energy limit',
    },
    {
      id: 'rechargeSpeed',
      name: 'Recharge Speed',
      icon: BatteryCharging,
      level: userData.boostLevel.rechargeSpeed,
      cost: userData.boostLevel.rechargeSpeed * 2000,
      desc: 'Faster energy regeneration',
    },
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Booster Shop
      </h1>

      {boosts.map((boost) => {
        const Icon = boost.icon;
        const canAfford = userData.balance >= boost.cost;

        return (
          <div key={boost.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-600/20 rounded-xl text-cyan-400">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{boost.name}</h3>
                <p className="text-xs text-gray-400">{boost.desc}</p>
                <span className="text-xs text-cyan-400 font-bold">Lvl {boost.level}</span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade(boost.id as any, boost.cost)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                canAfford
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white active:scale-95'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {boost.cost.toLocaleString()} 🪙
            </button>
          </div>
        );
      })}
    </div>
  );
}
