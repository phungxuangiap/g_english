'use server';

import { createServerClient } from '@/lib/supabase/server';
import { parseTranscript, youtubeUrlToId } from '@/lib/transcript';
import { revalidatePath } from 'next/cache';

export async function createLesson(formData: {
  title: string;
  youtubeUrl: string;
  transcriptText: string;
}) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const videoId = youtubeUrlToId(formData.youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const segments = parseTranscript(formData.transcriptText);
  if (segments.length === 0) {
    throw new Error('No valid transcript segments found');
  }

  // Insert lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .insert({
      user_id: user.id,
      title: formData.title,
      youtube_url: formData.youtubeUrl,
      youtube_video_id: videoId,
    })
    .select()
    .single();

  if (lessonError) {
    console.error('Lesson insert error:', lessonError);
    throw new Error(`Failed to create lesson: ${lessonError.message}`);
  }

  if (!lesson) {
    throw new Error('Failed to create lesson: no data returned');
  }

  // Insert transcript segments
  const segmentsToInsert = segments.map((seg) => ({
    lesson_id: lesson.id,
    start_time: seg.start_time,
    end_time: seg.end_time,
    text: seg.text,
    sequence_order: seg.sequence_order,
  }));

  const { error: segmentsError } = await supabase
    .from('transcript_segments')
    .insert(segmentsToInsert);

  if (segmentsError) {
    console.error('Segments insert error:', segmentsError);
    throw new Error(`Failed to create transcript segments: ${segmentsError.message}`);
  }

  revalidatePath('/lessons');
  return lesson.id;
}

export async function updateLesson(
  lessonId: string,
  formData: {
    title: string;
    youtubeUrl: string;
    transcriptText?: string;
  }
) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const videoId = youtubeUrlToId(formData.youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Update lesson
  const { error: lessonError } = await supabase
    .from('lessons')
    .update({
      title: formData.title,
      youtube_url: formData.youtubeUrl,
      youtube_video_id: videoId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lessonId)
    .eq('user_id', user.id);

  if (lessonError) {
    console.error('Lesson update error:', lessonError);
    throw new Error(`Failed to update lesson: ${lessonError.message}`);
  }

  // If transcript is provided, replace all segments
  if (formData.transcriptText && formData.transcriptText.trim()) {
    const segments = parseTranscript(formData.transcriptText);
    if (segments.length === 0) {
      throw new Error('No valid transcript segments found');
    }

    // Delete old segments
    const { error: deleteError, count } = await supabase
      .from('transcript_segments')
      .delete({ count: 'exact' })
      .eq('lesson_id', lessonId);

    console.log('Deleted segments count:', count);
    if (deleteError) {
      console.error('Segments delete error:', deleteError);
      throw new Error(`Failed to delete old segments: ${deleteError.message}`);
    }

    // Insert new segments
    const segmentsToInsert = segments.map((seg) => ({
      lesson_id: lessonId,
      start_time: seg.start_time,
      end_time: seg.end_time,
      text: seg.text,
      sequence_order: seg.sequence_order,
    }));

    console.log('Inserting segments count:', segmentsToInsert.length);
    const { error: segmentsError } = await supabase
      .from('transcript_segments')
      .insert(segmentsToInsert);

    if (segmentsError) {
      console.error('Segments insert error:', segmentsError);
      throw new Error(`Failed to create transcript segments: ${segmentsError.message}`);
    }
  }

  revalidatePath('/lessons');
  revalidatePath(`/lessons/${lessonId}`);
  return lessonId;
}

export async function deleteLesson(lessonId: string) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Lesson delete error:', error);
    throw new Error(`Failed to delete lesson: ${error.message}`);
  }

  revalidatePath('/lessons');
}
