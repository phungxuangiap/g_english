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
    cyan: 'bg-gradient-to-br from-[#dfe7ff] to-[#efeaff] text-[#5267a8] hover:from-[#d5dfff] hover:to-[#e8e0ff]',
    green: 'bg-gradient-to-br from-[#dff7ed] to-[#eaf8d8] text-[#3f8f78] hover:from-[#d3f2e5] hover:to-[#e0f2cb]',
    yellow: 'bg-gradient-to-br from-[#fff0cf] to-[#ffe5cf] text-[#a8752b] hover:from-[#ffe6b8] hover:to-[#ffd9bd]',
    pink: 'bg-gradient-to-br from-[#ffe1ea] to-[#f2e7ff] text-[#b65d76] hover:from-[#ffd5e1] hover:to-[#eadcff]',
    red: 'bg-gradient-to-br from-[#ffe1dc] to-[#ffe9cf] text-[#b85f55] hover:from-[#ffd5ce] hover:to-[#ffe0b8]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl px-5 py-2.5 font-mono text-sm font-bold tracking-wide
        border border-white/70 ${colors[variant]}
        shadow-[6px_6px_14px_rgba(167,158,143,0.22),-6px_-6px_14px_rgba(255,255,255,0.9)]
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-[8px_8px_18px_rgba(167,158,143,0.24),-8px_-8px_18px_rgba(255,255,255,0.95)]
        active:translate-y-0 active:shadow-[inset_4px_4px_10px_rgba(167,158,143,0.16),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${className}
      `}
    >
      {children}
    </button>
  );
}
