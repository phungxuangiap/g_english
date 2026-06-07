'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const supabase = useMemo(() => createClient(), []);

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
        <p className="font-mono text-[#7b8197]">Loading...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-pixel text-3xl font-extrabold text-[#5267a8] mb-8">EDIT LESSON</h1>
          <EditLessonForm
            lesson={lesson}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col">
      <div className="m-4 rounded-[1.5rem] border border-white/70 bg-[#fffdf8]/75 p-4 shadow-[8px_8px_20px_rgba(167,158,143,0.14),-8px_-8px_20px_rgba(255,255,255,0.85)] flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="font-mono text-xl font-extrabold text-[#384057]">{lesson.title}</h1>
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

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <div className="lg:w-1/2 flex flex-col">
          <div className="p-4">
            <YouTubePlayer videoId={lesson.youtube_video_id} />
          </div>
          <PlayerControls isPlaying={isPlaying} onPlay={play} onPause={pause} />
          {loopSegment && (
            <div className="mx-4 mb-4 rounded-2xl border border-[#ffadc2]/50 bg-[#ffe1ea]/70 px-4 py-3 shadow-[inset_3px_3px_8px_rgba(182,93,118,0.1)]">
              <p className="font-mono text-sm font-bold text-[#b65d76] animate-pulse">
                🔁 LOOP ACTIVE
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 lg:flex-1 lg:overflow-hidden">
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
              <p className="font-mono text-[#7b8197]">Loading player...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
