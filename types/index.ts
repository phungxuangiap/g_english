export interface Lesson {
  id: string;
  user_id: string;
  title: string;
  youtube_url: string;
  youtube_video_id: string;
  created_at: string;
  updated_at: string;
}

export interface TranscriptSegment {
  id: string;
  lesson_id: string;
  start_time: number;
  end_time: number;
  text: string;
  sequence_order: number;
  created_at: string;
}

export interface LibraryItem {
  id: string;
  user_id: string;
  segment_id: string;
  lesson_id: string;
  note: string | null;
  review_count: number;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface ParsedSegment {
  start_time: number;
  end_time: number;
  text: string;
  sequence_order: number;
}
