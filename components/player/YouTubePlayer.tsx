'use client';

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-[1.75rem] bg-[#dfe7ff] p-2 shadow-[10px_10px_24px_rgba(167,158,143,0.22),-10px_-10px_24px_rgba(255,255,255,0.9)] scanline">
      <div id="yt-player" className="w-full h-full overflow-hidden rounded-[1.25rem]" />
    </div>
  );
}
