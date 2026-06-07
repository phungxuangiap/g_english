'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { createLesson } from './actions';
import { fetchTranscriptFromYouTube } from './transcript-actions';
import { parseTranscript } from '@/lib/transcript';

export default function NewLessonPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
  const [error, setError] = useState('');

  const previewSegments = transcriptText ? parseTranscript(transcriptText).slice(0, 5) : [];

  const handleFetchTranscript = async () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL first');
      return;
    }

    setError('');
    setIsFetchingTranscript(true);

    try {
      const result = await fetchTranscriptFromYouTube(youtubeUrl);
      if (result.success && result.transcript) {
        setTranscriptText(result.transcript);
      } else {
        setError(result.error || 'Failed to fetch transcript');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
    } finally {
      setIsFetchingTranscript(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const lessonId = await createLesson({ title, youtubeUrl, transcriptText });
      router.push(`/lessons/${lessonId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lesson');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-pixel text-3xl text-[#5267a8] mb-8">CREATE LESSON</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PixelCard tint="blue">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                    className="flex-1 rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-mono text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff]"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <PixelButton
                    type="button"
                    variant="cyan"
                    onClick={handleFetchTranscript}
                    disabled={isFetchingTranscript || !youtubeUrl}
                  >
                    {isFetchingTranscript ? 'FETCHING...' : 'AUTO FETCH'}
                  </PixelButton>
                </div>
              </div>

              <div>
                <label className="font-mono text-sm text-[#7b8197] block mb-2">
                  Transcript
                </label>
                <textarea
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  required
                  rows={12}
                  className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-terminal text-lg text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff] resize-y"
                  placeholder={`Click "AUTO FETCH" to get transcript automatically, or paste manually:

Format 1 (Simple):
[00:00:03.500] Hello, welcome to today's lesson.
[00:00:07.200] We're going to talk about habits.

Format 2 (SRT):
1
00:00:03,500 --> 00:00:07,200
Hello, welcome to today's lesson.`}
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
                        className="bg-[#f7f4ec]/70 border border-white/70 px-3 py-2 font-terminal text-sm text-[#7b8197]"
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
              {isSubmitting ? 'CREATING...' : 'CREATE LESSON'}
            </PixelButton>
            <PixelButton
              type="button"
              variant="cyan"
              onClick={() => router.push('/lessons')}
            >
              CANCEL
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
}
