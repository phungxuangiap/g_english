'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { updateLesson } from '@/app/lessons/actions';
import { parseTranscript } from '@/lib/transcript';
import { createClient } from '@/lib/supabase/client';
import { Lesson } from '@/types';

interface EditLessonFormProps {
  lesson: Lesson;
  onCancel: () => void;
}

export default function EditLessonForm({ lesson, onCancel }: EditLessonFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(lesson.title);
  const [youtubeUrl, setYoutubeUrl] = useState(lesson.youtube_url);
  const [transcriptText, setTranscriptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingTranscript, setLoadingTranscript] = useState(true);

  useEffect(() => {
    async function loadTranscript() {
      const supabase = createClient();
      const { data } = await supabase
        .from('transcript_segments')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('sequence_order', { ascending: true });

      if (data && data.length > 0) {
        const transcriptLines = data.map(
          (seg) => `[${formatTime(seg.start_time)}] ${seg.text}`
        );
        setTranscriptText(transcriptLines.join('\n'));
      }
      setLoadingTranscript(false);
    }

    loadTranscript();
  }, [lesson.id]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const previewSegments = transcriptText ? parseTranscript(transcriptText).slice(0, 5) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Starting update...');
      await updateLesson(lesson.id, {
        title,
        youtubeUrl,
        transcriptText: transcriptText.trim() || undefined,
      });
      console.log('Update complete, navigating...');
      onCancel(); // Exit edit mode instead of router.push
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
      setIsSubmitting(false);
    }
  };

  if (loadingTranscript) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="font-mono text-[#8888aa]">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PixelCard>
        <div className="p-6 space-y-4">
          <div>
            <label className="font-mono text-sm text-[#8888aa] block mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-mono focus:border-[#00f5d4] focus:outline-none"
              placeholder="e.g. Daily Habits - English Lesson"
            />
          </div>

          <div>
            <label className="font-mono text-sm text-[#8888aa] block mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
              className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-mono focus:border-[#00f5d4] focus:outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="font-mono text-sm text-[#8888aa] block mb-2">
              Transcript
            </label>
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={12}
              className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-terminal text-lg focus:border-[#00f5d4] focus:outline-none resize-y"
              placeholder="Paste your transcript here"
            />
          </div>

          {previewSegments.length > 0 && (
            <div>
              <label className="font-mono text-sm text-[#8888aa] block mb-2">
                Preview (first 5 segments)
              </label>
              <div className="space-y-2">
                {previewSegments.map((seg, i) => (
                  <div
                    key={i}
                    className="bg-[#0a0a0f] border border-[#333355] px-3 py-2 font-terminal text-sm text-[#8888aa]"
                  >
                    [{seg.start_time.toFixed(1)}s - {seg.end_time.toFixed(1)}s] {seg.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-[#ff2d78] bg-opacity-20 border-2 border-[#ff2d78] px-4 py-2 font-mono text-sm text-[#ff2d78]">
              {error}
            </div>
          )}
        </div>
      </PixelCard>

      <div className="flex gap-4">
        <PixelButton type="submit" variant="green" disabled={isSubmitting}>
          {isSubmitting ? 'UPDATING...' : 'UPDATE LESSON'}
        </PixelButton>
        <PixelButton type="button" variant="cyan" onClick={onCancel}>
          CANCEL
        </PixelButton>
      </div>
    </form>
  );
}
