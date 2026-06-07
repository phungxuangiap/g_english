'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      router.push('/lessons');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="font-pixel text-3xl text-[#5267a8] mb-8 text-center">
          SIGN UP
        </h1>

        <PixelCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-mono text-sm text-[#7b8197] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-mono text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="font-mono text-sm text-[#7b8197] block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-white/70 bg-[#fffdf8] px-4 py-3 font-mono text-[#384057] shadow-[inset_4px_4px_10px_rgba(167,158,143,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none focus:ring-4 focus:ring-[#dfe7ff]"
                placeholder="••••••••"
              />
              <p className="text-xs text-[#7b8197] mt-1 font-mono">
                Minimum 6 characters
              </p>
            </div>

            {error && (
              <div className="bg-[#ffe1ea] bg-opacity-20 border-2 border-[#ffadc2] px-4 py-2 font-mono text-sm text-[#b65d76]">
                {error}
              </div>
            )}

            <PixelButton
              type="submit"
              variant="green"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </PixelButton>

            <p className="text-center font-mono text-sm text-[#7b8197] mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#5267a8] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </PixelCard>
      </div>
    </div>
  );
}
