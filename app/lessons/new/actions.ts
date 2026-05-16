'use server';

import { createServerClient } from '@/lib/supabase/server';
import { parseTranscript, youtubeUrlToId } from '@/lib/transcript';
import { revalidatePath } from 'next/cache';
import { createLesson as createLessonAction } from '../actions';

export async function createLesson(formData: {
  title: string;
  youtubeUrl: string;
  transcriptText: string;
}) {
  return createLessonAction(formData);
}
