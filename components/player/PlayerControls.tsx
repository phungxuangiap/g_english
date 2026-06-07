'use client';

import { Play, Pause } from 'lucide-react';
import PixelButton from '@/components/ui/PixelButton';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export default function PlayerControls({ isPlaying, onPlay, onPause }: PlayerControlsProps) {
  return (
    <div className="m-4 mt-0 flex items-center gap-4 rounded-[1.5rem] bg-[#fffdf8]/85 p-4 shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
      <PixelButton
        onClick={isPlaying ? onPause : onPlay}
        variant="green"
        className="flex items-center gap-2"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        {isPlaying ? 'PAUSE' : 'PLAY'}
      </PixelButton>
    </div>
  );
}
