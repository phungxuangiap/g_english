'use client';

import { TranscriptSegment } from '@/types';
import { Repeat, Star } from 'lucide-react';

interface TranscriptLineProps {
  segment: TranscriptSegment;
  isActive: boolean;
  isLooping: boolean;
  isSaved: boolean;
  onSeek: (time: number) => void;
  onToggleLoop: (segment: TranscriptSegment) => void;
  onToggleSave: (segmentId: string) => void;
}

export default function TranscriptLine({
  segment,
  isActive,
  isLooping,
  isSaved,
  onSeek,
  onToggleLoop,
  onToggleSave,
}: TranscriptLineProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`
        flex gap-3 px-4 py-3 cursor-pointer
        border-l-4 transition-all duration-150
        ${
          isActive
            ? 'border-[#00f5d4] bg-[#0a1a1a] text-[#00f5d4] [text-shadow:0_0_10px_#00f5d4]'
            : 'border-transparent text-[#8888aa] hover:bg-[#111118]'
        }
      `}
      onClick={() => onSeek(segment.start_time)}
    >
      <span className="font-mono text-xs text-[#444466] shrink-0 mt-1">
        [{formatTime(segment.start_time)}]
      </span>
      <span className="font-terminal text-xl flex-1">{segment.text}</span>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLoop(segment);
          }}
          className={`
            p-1.5 rounded transition-all
            ${
              isLooping
                ? 'text-[#ff2d78] [filter:drop-shadow(0_0_6px_#ff2d78)] animate-pulse'
                : 'text-[#444466] hover:text-[#8888aa]'
            }
          `}
        >
          <Repeat size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(segment.id);
          }}
          className={`
            p-1.5 rounded transition-all
            ${
              isSaved
                ? 'text-[#ffd60a] [filter:drop-shadow(0_0_6px_#ffd60a)]'
                : 'text-[#444466] hover:text-[#8888aa]'
            }
          `}
        >
          <Star size={16} fill={isSaved ? '#ffd60a' : 'none'} />
        </button>
      </div>
    </div>
  );
}
