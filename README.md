# English Learning App

A full-stack web application for learning English through YouTube videos with interactive transcripts.

## Features

- **YouTube Video Player**: Watch videos with synchronized transcripts
- **Interactive Transcripts**: Click any sentence to jump to that moment
- **Loop Sentences**: Repeat individual sentences for practice
- **Save to Library**: Build your personal collection of sentences
- **Pixel/Retro Theme**: Spotify-inspired dark theme with pixel art aesthetics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Player**: YouTube IFrame API
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Run the SQL schema from `supabase-schema.sql` in the SQL editor
   - Enable Email authentication (or Google OAuth) in Authentication settings

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Create a Lesson**: Add a YouTube URL and transcript (supports SRT or simple timestamp format)
2. **Watch & Learn**: Click sentences to jump, loop for practice, save favorites
3. **Build Your Library**: Review saved sentences anytime

## Transcript Format

Simple format:
```
[00:00:03.500] Hello, welcome to today's lesson.
[00:00:07.200] We're going to talk about habits.
```

SRT format:
```
1
00:00:03,500 --> 00:00:07,200
Hello, welcome to today's lesson.
```
