'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lesson, TranscriptSegment } from '@/types';
import YouTubePlayer from '@/components/player/YouTubePlayer';
import PlayerControls from '@/components/player/PlayerControls';
import TranscriptPanel from '@/components/transcript/TranscriptPanel';
import EditLessonForm from '@/components/lessons/EditLessonForm';
import DeleteLessonButton from '@/components/lessons/DeleteLessonButton';
import PixelButton from '@/components/ui/PixelButton';
import { deleteLesson } from '../actions';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useTranscriptSync } from '@/hooks/useTranscriptSync';
import { useLoopSegment } from '@/hooks/useLoopSegment';
import { useLibrary } from '@/hooks/useLibrary';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const supabase = createClient();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [loopSegment, setLoopSegment] = useState<TranscriptSegment | null>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  const { currentTime, isPlaying, isReady, play, pause, seekTo } = useYouTubePlayer(
    lesson?.youtube_video_id || ''
  );
  const { activeIndex, activeSegment } = useTranscriptSync(segments, currentTime);
  const { savedIds, loadSavedIds, toggleSave } = useLibrary(userId);

  useLoopSegment(loopSegment, currentTime, seekTo);

  useEffect(() => {
    async function loadLesson() {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonData) {
        setLesson(lessonData);
      }

      const { data: segmentsData } = await supabase
        .from('transcript_segments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('sequence_order', { ascending: true });

      if (segmentsData) {
        setSegments(segmentsData);
      }
    }

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    }

    loadLesson();
    loadUser();
  }, [lessonId, supabase, isEditing]);

  useEffect(() => {
    if (userId) {
      loadSavedIds();
    }
  }, [userId, loadSavedIds]);

  const handleToggleLoop = (segment: TranscriptSegment) => {
    setLoopSegment((prev) => (prev?.id === segment.id ? null : segment));
  };

  const handleToggleSave = async (segmentId: string) => {
    await toggleSave(segmentId, lessonId);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-[#8888aa]">Loading...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-pixel text-3xl text-[#00f5d4] mb-8">EDIT LESSON</h1>
          <EditLessonForm
            lesson={lesson}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b-2 border-[#333355] flex justify-between items-center">
        <h1 className="font-mono text-xl text-[#e8e8f0]">{lesson.title}</h1>
        <div className="flex gap-3">
          <PixelButton variant="cyan" onClick={() => setIsEditing(true)}>
            EDIT
          </PixelButton>
          <DeleteLessonButton
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            onDelete={deleteLesson}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-1/2 flex flex-col">
          <div className="p-4">
            <YouTubePlayer videoId={lesson.youtube_video_id} />
          </div>
          <PlayerControls isPlaying={isPlaying} onPlay={play} onPause={pause} />
          {loopSegment && (
            <div className="px-4 py-2 bg-[#ff2d78] bg-opacity-20 border-t-2 border-[#ff2d78]">
              <p className="font-mono text-sm text-[#ff2d78] animate-pulse">
                🔁 LOOP ACTIVE
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 flex-1 overflow-hidden">
          {isReady ? (
            <TranscriptPanel
              segments={segments}
              currentTime={currentTime}
              activeIndex={activeIndex}
              loopSegmentId={loopSegment?.id || null}
              savedIds={savedIds}
              onSeek={seekTo}
              onToggleLoop={handleToggleLoop}
              onToggleSave={handleToggleSave}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="font-mono text-[#8888aa]">Loading player...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
