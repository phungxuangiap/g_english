import { ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  tint?: 'blue' | 'mint' | 'peach' | 'pink' | 'lavender' | 'cream';
}

export default function PixelCard({ children, className = '', active = false, tint = 'cream' }: PixelCardProps) {
  const tints = {
    blue: 'from-[#eef3ff]/95 to-[#fffdf8]/90',
    mint: 'from-[#e8fbf2]/95 to-[#fffdf8]/90',
    peach: 'from-[#fff0cf]/95 to-[#fffdf8]/90',
    pink: 'from-[#ffe8ef]/95 to-[#fffdf8]/90',
    lavender: 'from-[#f0eefb]/95 to-[#fffdf8]/90',
    cream: 'from-[#fffdf8]/95 to-[#fff8eb]/90',
  };

  return (
    <div
      className={`
        rounded-[1.75rem] border bg-gradient-to-br ${tints[tint]}
        ${active ? 'border-[#9fb7ff]/70 shadow-[10px_10px_24px_rgba(167,158,143,0.22),-10px_-10px_24px_rgba(255,255,255,0.9),0_0_0_6px_rgba(159,183,255,0.18)]' : 'border-white/70 shadow-[10px_10px_24px_rgba(167,158,143,0.2),-10px_-10px_24px_rgba(255,255,255,0.9)]'}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
