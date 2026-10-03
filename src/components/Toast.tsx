import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1C1B1B] text-white shadow-2xl border border-white/10 max-w-sm">
        <span className="material-symbols-outlined text-[#F5B301] text-[22px]">check_circle</span>
        <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
      </div>
    </div>
  );
};
