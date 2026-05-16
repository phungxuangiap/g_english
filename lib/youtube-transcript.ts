import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

export async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Convert to our format: [MM:SS.mmm] text
    const formatted = transcript.map((item: TranscriptItem) => {
      const startSeconds = item.offset / 1000;
      const minutes = Math.floor(startSeconds / 60);
      const seconds = Math.floor(startSeconds % 60);
      const milliseconds = Math.floor((startSeconds % 1) * 1000);

      const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      return `[${timestamp}] ${item.text}`;
    });

    return formatted.join('\n');
  } catch (error) {
    console.error('Failed to fetch YouTube transcript:', error);
    throw new Error('Failed to fetch transcript from YouTube. The video may not have captions available.');
  }
}
