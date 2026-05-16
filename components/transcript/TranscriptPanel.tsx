'use client';

import { TranscriptSegment } from '@/types';
import TranscriptLine from './TranscriptLine';
import { useEffect, useRef } from 'react';

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime: number;
  activeIndex: number;
  loopSegmentId: string | null;
  savedIds: Set<string>;
  onSeek: (time: number) => void;
  onToggleLoop: (segment: TranscriptSegment) => void;
  onToggleSave: (segmentId: string) => void;
}

export default function TranscriptPanel({
  segments,
  currentTime,
  activeIndex,
  loopSegmentId,
  savedIds,
  onSeek,
  onToggleLoop,
  onToggleSave,
}: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const containerHeight = container.clientHeight;
      const activeTop = active.offsetTop;
      const activeHeight = active.clientHeight;

      const scrollTo = activeTop - containerHeight / 2 + activeHeight / 2;
      container.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-[#0a0a0f] border-l-2 border-[#333355]"
    >
      <div className="p-4 space-y-2">
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            ref={index === activeIndex ? activeRef : null}
          >
            <TranscriptLine
              segment={segment}
              isActive={index === activeIndex}
              isLooping={loopSegmentId === segment.id}
              isSaved={savedIds.has(segment.id)}
              onSeek={onSeek}
              onToggleLoop={onToggleLoop}
              onToggleSave={onToggleSave}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
