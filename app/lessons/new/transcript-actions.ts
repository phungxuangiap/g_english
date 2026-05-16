'use server';

import { fetchYouTubeTranscript } from '@/lib/youtube-transcript';
import { youtubeUrlToId } from '@/lib/transcript';

export async function fetchTranscriptFromYouTube(youtubeUrl: string) {
  const videoId = youtubeUrlToId(youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    const transcript = await fetchYouTubeTranscript(videoId);
    return { success: true, transcript };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transcript',
    };
  }
}
