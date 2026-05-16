import { ReactNode } from 'react';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'green' | 'yellow' | 'pink' | 'red';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function PixelButton({
  children,
  onClick,
  variant = 'cyan',
  type = 'button',
  disabled = false,
  className = '',
}: PixelButtonProps) {
  const colors = {
    cyan: 'border-[#00f5d4] text-[#00f5d4] hover:bg-[#00f5d4] shadow-[4px_4px_0px_#003333]',
    green: 'border-[#1db954] text-[#1db954] hover:bg-[#1db954] shadow-[4px_4px_0px_#0a3d1f]',
    yellow: 'border-[#ffd60a] text-[#ffd60a] hover:bg-[#ffd60a] shadow-[4px_4px_0px_#665500]',
    pink: 'border-[#ff2d78] text-[#ff2d78] hover:bg-[#ff2d78] shadow-[4px_4px_0px_#660030]',
    red: 'border-[#ff2d78] text-[#ff2d78] hover:bg-[#ff2d78] shadow-[4px_4px_0px_#660030]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-mono text-xs
        bg-transparent border-2 ${colors[variant]}
        px-4 py-2
        hover:text-black hover:shadow-none
        hover:translate-x-[2px] hover:translate-y-[2px]
        transition-all duration-100
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
