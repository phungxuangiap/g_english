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
  activeIndex,
  loopSegmentId,
  savedIds,
  onSeek,
  onToggleLoop,
  onToggleSave,
}: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const active = activeRef.current;
      const content = contentRef.current;
      const scrollTop = active.offsetTop - content.offsetTop;

      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative h-[45vh] overflow-y-auto bg-[#0a0a0f] border-t-2 border-[#333355] lg:h-full lg:border-t-0 lg:border-l-2"
    >
      <div ref={contentRef} className="p-4 space-y-2">
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
