'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PixelButton from './PixelButton';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b-2 border-[#333355] bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-pixel text-xl text-[#00f5d4] hover:text-[#00d4b8]">
          ENGLISH APP
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/lessons"
            className="font-mono text-sm text-[#8888aa] hover:text-[#00f5d4]"
          >
            Lessons
          </Link>
          <Link
            href="/library"
            className="font-mono text-sm text-[#8888aa] hover:text-[#00f5d4]"
          >
            Library
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#8888aa]">
                    {user.email}
                  </span>
                  <PixelButton variant="red" onClick={handleSignOut}>
                    SIGN OUT
                  </PixelButton>
                </div>
              ) : (
                <Link href="/auth/login">
                  <PixelButton variant="cyan">SIGN IN</PixelButton>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
