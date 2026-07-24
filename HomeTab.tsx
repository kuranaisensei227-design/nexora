'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Pickaxe } from 'lucide-react';
import { UserData } from '@/types';

interface HomeTabProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

interface TapAnimation {
  id: number;
  x: number;
  y: number;
}

export default function HomeTab({ userData, setUserData, triggerHaptic }: HomeTabProps) {
  const [taps, setTaps] = useState<TapAnimation[]>([]);

  // Auto Energy Recharge
  useEffect(() => {
    const timer = setInterval(() => {
      setUserData((prev) => {
        if (prev.energy < prev.maxEnergy) {
          return { ...prev, energy: Math.min(prev.maxEnergy, prev.energy + prev.boostLevel.rechargeSpeed) };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setUserData]);

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    if (userData.energy < userData.boostLevel.tapPower) return;

    triggerHaptic('light');

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setTaps((prev) => [...prev, { id: Date.now(), x, y }]);

    setUserData((prev) => ({
      ...prev,
      balance: prev.balance + prev.boostLevel.tapPower,
      totalTap: prev.totalTap + 1,
      energy: Math.max(0, prev.energy - prev.boostLevel.tapPower),
    }));
  };

  const removeTap = (id: number) => {
    setTaps((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-120px)] p-4 text-white">
      {/* Coin Balance Header */}
      <div className="flex flex-col items-center mt-4">
        <h2 className="text-gray-400 text-xs font-semibold tracking-wider uppercase">Nexora Balance</h2>
        <motion.div 
          key={userData.balance}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mt-1"
        >
          {userData.balance.toLocaleString()} 🪙
        </motion.div>
      </div>

      {/* Main Interactive Mining Coin */}
      <div className="relative my-auto">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleTap}
          disabled={userData.energy < userData.boostLevel.tapPower}
          className={`relative w-64 h-64 rounded-full glass-card flex items-center justify-center neon-glow-purple transition-opacity ${
            userData.energy < userData.boostLevel.tapPower ? 'opacity-50 cursor-not-allowed' : 'active:neon-glow-blue'
          }`}
        >
          <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-inner">
            <Pickaxe size={80} className="text-white drop-shadow-md animate-pulse" />
          </div>

          {/* Floating Tap Rewards */}
          <AnimatePresence>
            {taps.map((tap) => (
              <motion.span
                key={tap.id}
                initial={{ opacity: 1, y: tap.y - 20, x: tap.x - 20, scale: 1 }}
                animate={{ opacity: 0, y: tap.y - 100, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                onAnimationComplete={() => removeTap(tap.id)}
                className="absolute text-3xl font-extrabold text-cyan-300 pointer-events-none drop-shadow-md z-50"
              >
                +{userData.boostLevel.tapPower}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Energy Meter */}
      <div className="w-full max-w-sm glass-card p-4 rounded-2xl border border-white/10 mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="flex items-center text-sm font-semibold text-yellow-400 gap-1">
            <Zap size={18} /> Energy
          </span>
          <span className="text-xs font-bold text-gray-300">
            {userData.energy} / {userData.maxEnergy}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-cyan-400"
            animate={{ width: `${(userData.energy / userData.maxEnergy) * 100}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
