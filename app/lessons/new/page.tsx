'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { createLesson } from './actions';
import { parseTranscript } from '@/lib/transcript';

export default function NewLessonPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const previewSegments = transcriptText ? parseTranscript(transcriptText).slice(0, 5) : [];

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
        <h1 className="font-pixel text-3xl text-[#00f5d4] mb-8">CREATE LESSON</h1>

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
                  required
                  rows={12}
                  className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-terminal text-lg focus:border-[#00f5d4] focus:outline-none resize-y"
                  placeholder={`Format 1 (Simple):
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
