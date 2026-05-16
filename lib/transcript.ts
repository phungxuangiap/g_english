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
    // Parse simple [HH:MM:SS.mmm] format
    let order = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const match = line.match(/^\[(\d{2}):(\d{2}):(\d{2})\.(\d{3})\]\s*(.+)$/);
      if (match) {
        const [, hours, minutes, seconds, ms, text] = match;
        const start_time = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms) / 1000;

        // End time is start of next segment or +4 seconds
        let end_time = start_time + 4;
        if (i + 1 < lines.length) {
          const nextMatch = lines[i + 1].match(/^\[(\d{2}):(\d{2}):(\d{2})\.(\d{3})\]/);
          if (nextMatch) {
            const [, h, m, s, ms] = nextMatch;
            end_time = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
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
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
