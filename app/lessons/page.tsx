import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { Lesson } from '@/types';

const cardTints = ['blue', 'mint', 'peach', 'pink', 'lavender'] as const;

export default async function LessonsPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let lessons: Lesson[] = [];

  if (user) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    lessons = data || [];
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-pixel text-3xl text-[#5267a8]">MY LESSONS</h1>
          <Link href="/lessons/new">
            <PixelButton variant="green">+ NEW LESSON</PixelButton>
          </Link>
        </div>

        {!user ? (
          <PixelCard tint="lavender">
            <div className="p-8 text-center">
              <p className="font-mono text-[#7b8197]">
                Please sign in to view your lessons
              </p>
            </div>
          </PixelCard>
        ) : lessons.length === 0 ? (
          <PixelCard tint="mint">
            <div className="p-8 text-center">
              <p className="font-mono text-[#7b8197] mb-4">
                No lessons yet. Create your first lesson to get started!
              </p>
              <Link href="/lessons/new">
                <PixelButton variant="green">CREATE LESSON</PixelButton>
              </Link>
            </div>
          </PixelCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <PixelCard tint={cardTints[lesson.id.charCodeAt(0) % cardTints.length]} className="h-full hover:border-[#9fb7ff] transition-colors cursor-pointer">
                  <div className="p-6">
                    <h3 className="font-mono text-lg text-[#384057] mb-2">
                      {lesson.title}
                    </h3>
                    <p className="font-mono text-sm text-[#aeb4c5]">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </PixelCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
