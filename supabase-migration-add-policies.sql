-- Add missing DELETE and UPDATE policies for transcript_segments
-- Run this in your Supabase SQL Editor

CREATE POLICY "lesson_owner_delete_segments" ON transcript_segments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));

CREATE POLICY "lesson_owner_update_segments" ON transcript_segments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));
