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
    <div className="flex items-center gap-4 p-4 bg-[#111118] border-t-2 border-[#333355]">
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
