import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import PixelCard from '@/components/ui/PixelCard';
import { Star } from 'lucide-react';

export default async function LibraryPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let libraryItems: any[] = [];

  if (user) {
    const { data } = await supabase
      .from('library_items')
      .select(`
        *,
        transcript_segments (
          id,
          text,
          start_time,
          end_time,
          lesson_id
        ),
        lessons (
          id,
          title
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    libraryItems = data || [];
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-pixel text-3xl text-[#ffd60a]">MY LIBRARY</h1>
          <div className="font-mono text-sm text-[#8888aa]">
            {libraryItems.length} saved sentences
          </div>
        </div>

        {!user ? (
          <PixelCard>
            <div className="p-8 text-center">
              <p className="font-mono text-[#8888aa]">
                Please sign in to view your library
              </p>
            </div>
          </PixelCard>
        ) : libraryItems.length === 0 ? (
          <PixelCard>
            <div className="p-8 text-center">
              <p className="font-mono text-[#8888aa]">
                No saved sentences yet. Start watching lessons and save your favorite sentences!
              </p>
            </div>
          </PixelCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryItems.map((item) => {
              const segment = item.transcript_segments;
              const lesson = item.lessons;

              return (
                <PixelCard key={item.id} className="hover:border-[#ffd60a] transition-colors">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Star size={20} fill="#ffd60a" className="text-[#ffd60a] shrink-0 mt-1" />
                      <p className="font-terminal text-xl text-[#e8e8f0] flex-1">
                        {segment?.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="font-mono text-[#8888aa]">
                        {lesson?.title}
                      </div>
                      <div className="font-mono text-[#444466]">
                        [{formatTime(segment?.start_time || 0)}]
                      </div>
                    </div>

                    {item.note && (
                      <div className="bg-[#0a0a0f] border border-[#333355] p-3">
                        <p className="font-mono text-sm text-[#8888aa]">{item.note}</p>
                      </div>
                    )}

                    <Link
                      href={`/lessons/${lesson?.id}?t=${segment?.start_time}`}
                      className="inline-block font-mono text-xs text-[#00f5d4] hover:text-[#ffd60a] transition-colors"
                    >
                      → Go to lesson
                    </Link>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
