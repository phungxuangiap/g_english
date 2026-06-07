import { ParsedSegment } from '@/types';

export function parseTranscript(raw: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const lines = raw.trim().split('\n');

  // Detect format: SRT or simple timestamp format
  const isSRT = /^\d+$/.test(lines[0]?.trim());

  if (isSRT) {
    // Parse SRT format
    let i = 0;
    let order = 0;
    while (i < lines.length) {
      // Skip sequence number
      if (/^\d+$/.test(lines[i]?.trim())) {
        i++;
      }

      // Parse timestamp line
      const timestampLine = lines[i]?.trim();
      if (timestampLine && timestampLine.includes('-->')) {
        const [startStr, endStr] = timestampLine.split('-->').map(s => s.trim());
        const start_time = srtTimeToSeconds(startStr);
        const end_time = srtTimeToSeconds(endStr);
        i++;

        // Collect text lines until empty line
        const textLines: string[] = [];
        while (i < lines.length && lines[i]?.trim()) {
          textLines.push(lines[i].trim());
          i++;
        }

        if (textLines.length > 0) {
          segments.push({
            start_time,
            end_time,
            text: textLines.join(' '),
            sequence_order: order++,
          });
        }
      }
      i++;
    }
  } else {
    // Parse simple timestamp format - supports both [HH:MM:SS.mmm] and [MM:SS.mmm]
    let order = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Try [HH:MM:SS.mmm] format first
      let match = line.match(/^\[(\d{2}):(\d{2}):(\d{2})\.(\d{3})\]\s*(.+)$/);
      let start_time = 0;
      let text = '';

      if (match) {
        const [, hours, minutes, seconds, ms, txt] = match;
        start_time = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms) / 1000;
        text = txt;
      } else {
        // Try [MM:SS.mmm] format
        match = line.match(/^\[(\d{2}):(\d{2})\.(\d{3})\]\s*(.+)$/);
        if (match) {
          const [, minutes, seconds, ms, txt] = match;
          start_time = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms) / 1000;
          text = txt;
        }
      }

      if (match && text) {
        // End time is start of next segment or +4 seconds
        let end_time = start_time + 4;
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          // Try both formats for next line
          let nextMatch = nextLine.match(/^\[(\d{2}):(\d{2}):(\d{2})\.(\d{3})\]/);
          if (nextMatch) {
            const [, h, m, s, ms] = nextMatch;
            end_time = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
          } else {
            nextMatch = nextLine.match(/^\[(\d{2}):(\d{2})\.(\d{3})\]/);
            if (nextMatch) {
              const [, m, s, ms] = nextMatch;
              end_time = parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
            }
          }
        }

        segments.push({
          start_time,
          end_time,
          text,
          sequence_order: order++,
        });
      }
    }
  }

  return segments;
}

function srtTimeToSeconds(timeStr: string): number {
  // Format: 00:00:03,500 or 00:00:03.500
  const parts = timeStr.replace(',', '.').split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

export function youtubeUrlToId(url: string): string | null {
  const value = url.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);
    const hostname = parsedUrl.hostname.replace(/^www\./, '').replace(/^m\./, '');

    if (hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0];
      return isYouTubeVideoId(videoId) ? videoId : null;
    }

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      const videoId = parsedUrl.searchParams.get('v');
      if (isYouTubeVideoId(videoId)) {
        return videoId;
      }

      const [, route, routeVideoId] = parsedUrl.pathname.split('/');
      if (['embed', 'shorts', 'live'].includes(route) && isYouTubeVideoId(routeVideoId)) {
        return routeVideoId;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function isYouTubeVideoId(value: string | null | undefined): value is string {
  return /^[a-zA-Z0-9_-]{11}$/.test(value ?? '');
}
