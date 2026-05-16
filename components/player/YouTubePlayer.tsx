'use client';

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return (
    <div className="relative w-full aspect-video bg-black scanline">
      <div id="yt-player" className="w-full h-full" />
    </div>
  );
}
