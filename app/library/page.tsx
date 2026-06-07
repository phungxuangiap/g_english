import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import PixelCard from '@/components/ui/PixelCard';
import { Star } from 'lucide-react';

const cardTints = ['peach', 'pink', 'lavender', 'blue', 'mint'] as const;

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
          <h1 className="font-pixel text-3xl text-[#d29431]">MY LIBRARY</h1>
          <div className="font-mono text-sm text-[#7b8197]">
            {libraryItems.length} saved sentences
          </div>
        </div>

        {!user ? (
          <PixelCard tint="lavender">
            <div className="p-8 text-center">
              <p className="font-mono text-[#7b8197]">
                Please sign in to view your library
              </p>
            </div>
          </PixelCard>
        ) : libraryItems.length === 0 ? (
          <PixelCard tint="peach">
            <div className="p-8 text-center">
              <p className="font-mono text-[#7b8197]">
                No saved sentences yet. Start watching lessons and save your favorite sentences!
              </p>
            </div>
          </PixelCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryItems.map((item, index) => {
              const segment = item.transcript_segments;
              const lesson = item.lessons;

              return (
                <PixelCard key={item.id} tint={cardTints[index % cardTints.length]} className="hover:border-[#ffd89e] transition-colors">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Star size={20} fill="#ffd89e" className="text-[#d29431] shrink-0 mt-1" />
                      <p className="font-terminal text-xl text-[#384057] flex-1">
                        {segment?.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="font-mono text-[#7b8197]">
                        {lesson?.title}
                      </div>
                      <div className="font-mono text-[#aeb4c5]">
                        [{formatTime(segment?.start_time || 0)}]
                      </div>
                    </div>

                    {item.note && (
                      <div className="rounded-2xl bg-[#f7f4ec]/70 border border-white/70 p-3 shadow-[inset_3px_3px_8px_rgba(167,158,143,0.1)]">
                        <p className="font-mono text-sm text-[#7b8197]">{item.note}</p>
                      </div>
                    )}

                    <Link
                      href={`/lessons/${lesson?.id}?t=${segment?.start_time}`}
                      className="inline-block font-mono text-xs font-bold text-[#5267a8] hover:text-[#d29431] transition-colors"
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
