import Link from 'next/link';
import PixelButton from '@/components/ui/PixelButton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8 rounded-[2rem] bg-gradient-to-br from-[#eef3ff]/75 via-[#fffdf8]/75 to-[#ffe8ef]/70 p-10 shadow-[14px_14px_34px_rgba(167,158,143,0.16),-14px_-14px_34px_rgba(255,255,255,0.85)]">
        <h1 className="font-pixel text-4xl md:text-6xl font-extrabold text-[#5267a8] mb-4">
          ENGLISH
          <br />
          LEARNING
        </h1>
        <p className="font-mono text-lg text-[#7b8197] max-w-2xl mx-auto">
          Learn English by watching YouTube videos with interactive transcripts.
          Loop sentences, save to your library, and master the language.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/lessons">
            <PixelButton variant="cyan">VIEW LESSONS</PixelButton>
          </Link>
          <Link href="/lessons/new">
            <PixelButton variant="green">CREATE LESSON</PixelButton>
          </Link>
          <Link href="/library">
            <PixelButton variant="yellow">MY LIBRARY</PixelButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
