# Setup Instructions

## Quick Start

1. **Install dependencies**
```bash
cd english-app
npm install
```

2. **Set up Supabase**
   - Go to https://supabase.com and create a new project
   - Copy your project URL and anon key
   - In the Supabase SQL Editor, run the schema from `supabase-schema.sql`
   - Enable Email authentication in Settings > Authentication

3. **Configure environment variables**
   - Copy `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open http://localhost:3000**

## Features

- ✅ YouTube video player with synchronized transcripts
- ✅ Click sentences to jump to that moment
- ✅ Loop individual sentences for practice
- ✅ Save sentences to your personal library
- ✅ Pixel/retro theme with Spotify-inspired design
- ✅ Responsive layout (desktop, tablet, mobile)

## Project Structure

```
app/
├── page.tsx              # Home page
├── lessons/
│   ├── page.tsx          # Lessons list
│   ├── new/page.tsx      # Create lesson
│   └── [id]/page.tsx     # Lesson player
└── library/page.tsx      # Saved sentences

components/
├── player/               # YouTube player components
├── transcript/           # Transcript display components
└── ui/                   # Reusable UI components

hooks/
├── useYouTubePlayer.ts   # YouTube player logic
├── useTranscriptSync.ts  # Active segment tracking
├── useLoopSegment.ts     # Loop functionality
└── useLibrary.ts         # Save/load library items

lib/
├── supabase/             # Supabase client setup
└── transcript.ts         # Transcript parsing utilities
```

## Transcript Format Examples

**Simple format:**
```
[00:00:03.500] Hello, welcome to today's lesson.
[00:00:07.200] We're going to talk about habits.
[00:00:11.800] Small habits can change your life.
```

**SRT format:**
```
1
00:00:03,500 --> 00:00:07,200
Hello, welcome to today's lesson.

2
00:00:07,200 --> 00:00:11,800
We're going to talk about habits.
```

## Notes

- Authentication is required to create lessons and save to library
- YouTube videos must be publicly accessible
- Transcripts are parsed on the client side before submission
