import { ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export default function PixelCard({ children, className = '', active = false }: PixelCardProps) {
  return (
    <div
      className={`
        bg-[#111118] border-2
        ${active ? 'border-[#00f5d4] shadow-[4px_4px_0px_#003333]' : 'border-[#333355] shadow-[4px_4px_0px_#333355]'}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
