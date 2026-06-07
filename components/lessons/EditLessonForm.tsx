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
        <p className="font-mono text-[#7b8197]">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PixelCard tint="lavender">
        <div className="p-6 space-y-4">
          <div>
            <label className="font-mono text-sm text-[#7b8197] block mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-mono text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff]"
              placeholder="e.g. Daily Habits - English Lesson"
            />
          </div>

          <div>
            <label className="font-mono text-sm text-[#7b8197] block mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-mono text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff]"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="font-mono text-sm text-[#7b8197] block mb-2">
              Transcript
            </label>
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={12}
              className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-terminal text-lg text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff] resize-y"
              placeholder="Paste your transcript here"
            />
          </div>

          {previewSegments.length > 0 && (
            <div>
              <label className="font-mono text-sm text-[#7b8197] block mb-2">
                Preview (first 5 segments)
              </label>
              <div className="space-y-2">
                {previewSegments.map((seg, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/70 bg-[#f7f4ec]/70 px-3 py-2 font-terminal text-sm text-[#7b8197] shadow-[inset_3px_3px_8px_rgba(167,158,143,0.1)]"
                  >
                    [{seg.start_time.toFixed(1)}s - {seg.end_time.toFixed(1)}s] {seg.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-[#ffe1ea] bg-opacity-20 border-2 border-[#ffadc2] px-4 py-2 font-mono text-sm text-[#b65d76]">
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
