import { useEffect, useRef } from 'react';
import { TranscriptSegment } from '@/types';

export function useLoopSegment(
  loopSegment: TranscriptSegment | null,
  currentTime: number,
  seekTo: (seconds: number) => void
) {
  const lastSeekRef = useRef<number>(0);

  useEffect(() => {
    if (!loopSegment) return;

    const now = Date.now();
    // Prevent rapid seeking (debounce)
    if (now - lastSeekRef.current < 500) return;

    if (currentTime >= loopSegment.end_time) {
      seekTo(loopSegment.start_time);
      lastSeekRef.current = now;
    }
  }, [currentTime, loopSegment, seekTo]);
}
