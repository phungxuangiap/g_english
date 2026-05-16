import { useMemo } from 'react';
import { TranscriptSegment } from '@/types';

export function useTranscriptSync(segments: TranscriptSegment[], currentTime: number) {
  const activeIndex = useMemo(() => {
    return segments.findIndex(
      (s) => currentTime >= s.start_time && currentTime < s.end_time
    );
  }, [segments, currentTime]);

  const activeSegment = activeIndex >= 0 ? segments[activeIndex] : null;

  return { activeIndex, activeSegment };
}
