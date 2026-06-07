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
        flex gap-3 rounded-2xl px-4 py-3 cursor-pointer
        border transition-all duration-200
        ${
          isActive
            ? 'border-[#9fb7ff]/70 bg-gradient-to-r from-[#edf2ff] via-[#f0eefb] to-[#e8fbf2] text-[#384057] shadow-[inset_4px_4px_10px_rgba(159,183,255,0.18),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]'
            : 'border-transparent text-[#7b8197] hover:bg-white/60 hover:shadow-[4px_4px_12px_rgba(167,158,143,0.12),-4px_-4px_12px_rgba(255,255,255,0.8)]'
        }
      `}
      onClick={() => onSeek(segment.start_time)}
    >
      <span className="font-mono text-xs font-bold text-[#aeb4c5] shrink-0 mt-1">
        [{formatTime(segment.start_time)}]
      </span>
      <span className="font-terminal text-lg leading-relaxed flex-1">{segment.text}</span>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLoop(segment);
          }}
          className={`
            p-1.5 rounded-xl transition-all
            ${
              isLooping
                ? 'bg-[#ffe1ea] text-[#b65d76] shadow-[inset_3px_3px_8px_rgba(182,93,118,0.14)] animate-pulse'
                : 'text-[#aeb4c5] hover:bg-[#fff0cf] hover:text-[#a8752b]'
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
            p-1.5 rounded-xl transition-all
            ${
              isSaved
                ? 'bg-[#fff0cf] text-[#d29431] shadow-[inset_3px_3px_8px_rgba(168,117,43,0.14)]'
                : 'text-[#aeb4c5] hover:bg-[#fff0cf] hover:text-[#d29431]'
            }
          `}
        >
          <Star size={16} fill={isSaved ? '#ffd89e' : 'none'} />
        </button>
      </div>
    </div>
  );
}
