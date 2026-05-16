import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Creating Supabase client with:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    env: process.env.NODE_ENV,
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseAnonKey ? 'present' : 'missing',
    });
    throw new Error('Supabase URL and Anon Key are required. Check your .env.local file.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
