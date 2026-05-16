# English Learning App

A full-stack web application for learning English through YouTube videos with interactive transcripts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- 🎥 **YouTube Video Player** - Watch videos with synchronized transcripts
- 📝 **Interactive Transcripts** - Click any sentence to jump to that moment in the video
- 🔁 **Loop Sentences** - Repeat individual sentences for focused practice
- ⭐ **Personal Library** - Save and review your favorite sentences
- 🤖 **Auto-Fetch Transcripts** - Automatically retrieve transcripts from YouTube videos
- 🎨 **Pixel/Retro Theme** - Spotify-inspired dark theme with pixel art aesthetics
- 🔐 **Authentication** - Secure user accounts with Supabase Auth
- ✏️ **Full CRUD** - Create, read, update, and delete lessons

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd english-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to your project's SQL Editor and run the schema:
   ```bash
   # Copy the contents of supabase-schema.sql and paste into Supabase SQL Editor
   ```
   
   c. Enable Email authentication:
   - Go to Authentication > Providers
   - Enable "Email" provider

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Find these values in your Supabase project settings under API.

5. **Run the development server**
```bash
npm run dev
```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Lesson

1. **Sign up** - Create an account at `/auth/signup`
2. **Create a lesson** - Click "CREATE LESSON" or go to `/lessons/new`
3. **Add video details**:
   - Enter a lesson title
   - Paste a YouTube URL
   - Click "AUTO FETCH" to automatically get the transcript, or paste manually
4. **Save** - Click "CREATE LESSON"

### Watching Lessons

1. Go to "MY LESSONS" to see all your lessons
2. Click on a lesson to open the player
3. **Interact with transcripts**:
   - Click any sentence to jump to that moment
   - Click the 🔁 icon to loop a sentence
   - Click the ⭐ icon to save to your library

### Managing Lessons

- **Edit** - Click "EDIT" button on any lesson page
- **Delete** - Click "DELETE" button (with confirmation)
- **Update transcript** - Edit and save changes to existing lessons

## 📝 Transcript Formats

The app supports multiple transcript formats:

### Simple Format (MM:SS.mmm)
```
[00:00.160] Hello, welcome to today's lesson.
[00:09.400] Many people have this problem.
```

### Extended Format (HH:MM:SS.mmm)
```
[00:00:03.500] Hello, welcome to today's lesson.
[00:00:07.200] We're going to talk about habits.
```

### SRT Format
```
1
00:00:03,500 --> 00:00:07,200
Hello, welcome to today's lesson.

2
00:00:07,200 --> 00:00:11,800
We're going to talk about habits.
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Make sure `.env.local` exists** with your Supabase credentials

2. **Build and run**:
```bash
docker-compose up --build
```

3. **Access the app** at [http://localhost:3000](http://localhost:3000)

### Docker Commands

```bash
# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Video Player**: YouTube IFrame API
- **Transcript Fetching**: [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
english-app/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── lessons/             # Lesson pages and actions
│   ├── library/             # User library page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── lessons/            # Lesson-specific components
│   ├── player/             # Video player components
│   ├── transcript/         # Transcript components
│   └── ui/                 # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase client setup
│   ├── transcript.ts       # Transcript parsing
│   └── youtube-transcript.ts # YouTube API integration
├── types/                   # TypeScript type definitions
├── supabase-schema.sql     # Database schema
└── docker-compose.yml      # Docker configuration
```

## 🔧 Development

### Build for production
```bash
npm run build
```

### Run production build locally
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## 🗄️ Database Schema

The app uses three main tables:

- **lessons** - Stores lesson metadata (title, YouTube URL, user)
- **transcript_segments** - Stores individual transcript segments with timestamps
- **library_items** - Stores user's saved sentences

Row Level Security (RLS) policies ensure users can only access their own data.

## 🔐 Authentication

The app uses Supabase Auth with email/password authentication. Users must be authenticated to:
- Create lessons
- Edit/delete lessons
- Save sentences to library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- YouTube IFrame API for video playback
- Supabase for backend infrastructure
- Next.js team for the amazing framework
- [youtube-transcript](https://github.com/Kakulukian/youtube-transcript) for transcript fetching

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for English learners worldwide
