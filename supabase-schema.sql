-- Users managed by Supabase Auth (auth.users)

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcript segments table
CREATE TABLE transcript_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  text TEXT NOT NULL,
  sequence_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library (saved sentences)
CREATE TABLE library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  segment_id UUID REFERENCES transcript_segments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  note TEXT,
  review_count INT DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, segment_id)
);

-- RLS Policies
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;

-- Lessons: owner full access
CREATE POLICY "owner_all_lessons" ON lessons FOR ALL USING (auth.uid() = user_id);

-- Segments: accessible if user owns the lesson
CREATE POLICY "lesson_owner_read_segments" ON transcript_segments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));

CREATE POLICY "lesson_owner_insert_segments" ON transcript_segments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));

CREATE POLICY "lesson_owner_delete_segments" ON transcript_segments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));

CREATE POLICY "lesson_owner_update_segments" ON transcript_segments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM lessons WHERE lessons.id = lesson_id AND lessons.user_id = auth.uid()
  ));

-- Library: owner full access
CREATE POLICY "owner_all_library" ON library_items FOR ALL USING (auth.uid() = user_id);
