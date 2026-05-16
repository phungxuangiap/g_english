import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useLibrary(userId: string | undefined) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const loadSavedIds = useCallback(async () => {
    if (!userId) return;

    const { data } = await supabase
      .from('library_items')
      .select('segment_id')
      .eq('user_id', userId);

    if (data) {
      setSavedIds(new Set(data.map((item) => item.segment_id)));
    }
  }, [userId, supabase]);

  const toggleSave = useCallback(
    async (segmentId: string, lessonId: string) => {
      if (!userId) return;

      const isSaved = savedIds.has(segmentId);

      if (isSaved) {
        // Remove from library
        await supabase
          .from('library_items')
          .delete()
          .eq('user_id', userId)
          .eq('segment_id', segmentId);

        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(segmentId);
          return next;
        });
      } else {
        // Add to library
        await supabase.from('library_items').insert({
          user_id: userId,
          segment_id: segmentId,
          lesson_id: lessonId,
        });

        setSavedIds((prev) => new Set(prev).add(segmentId));
      }
    },
    [userId, savedIds, supabase]
  );

  return { savedIds, loadSavedIds, toggleSave };
}
