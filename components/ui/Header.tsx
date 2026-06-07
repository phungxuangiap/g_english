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

    console.log('Header: Checking auth state...');
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      console.log('Header: User data:', user);
      console.log('Header: Error:', error);
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Header: Auth state changed:', _event, session?.user);
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
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fffdf8]/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(167,158,143,0.12)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-pixel text-xl font-extrabold text-[#5267a8] hover:text-[#7b6fc7]">
          ENGLISH APP
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/lessons"
            className="font-mono text-sm font-semibold text-[#7b8197] hover:text-[#5267a8]"
          >
            Lessons
          </Link>
          <Link
            href="/library"
            className="font-mono text-sm font-semibold text-[#7b8197] hover:text-[#5267a8]"
          >
            Library
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#7b8197]">
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
