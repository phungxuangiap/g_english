'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/lessons');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="font-pixel text-3xl text-[#00f5d4] mb-8 text-center">
          LOGIN
        </h1>

        <PixelCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-mono text-sm text-[#8888aa] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-mono focus:border-[#00f5d4] focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="font-mono text-sm text-[#8888aa] block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0f] border-2 border-[#333355] text-[#e8e8f0] px-4 py-2 font-mono focus:border-[#00f5d4] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-[#ff2d78] bg-opacity-20 border-2 border-[#ff2d78] px-4 py-2 font-mono text-sm text-[#ff2d78]">
                {error}
              </div>
            )}

            <PixelButton
              type="submit"
              variant="green"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
            </PixelButton>

            <p className="text-center font-mono text-sm text-[#8888aa] mt-4">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#00f5d4] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </PixelCard>
      </div>
    </div>
  );
}
