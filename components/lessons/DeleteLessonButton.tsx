'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PixelButton from '@/components/ui/PixelButton';

interface DeleteLessonButtonProps {
  lessonId: string;
  lessonTitle: string;
  onDelete: (lessonId: string) => Promise<void>;
}

export default function DeleteLessonButton({
  lessonId,
  lessonTitle,
  onDelete,
}: DeleteLessonButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(lessonId);
      router.push('/lessons');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete lesson');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (!showConfirm) {
    return (
      <PixelButton variant="red" onClick={() => setShowConfirm(true)}>
        DELETE
      </PixelButton>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm text-[#ff2d78]">
        Delete "{lessonTitle}"?
      </span>
      <PixelButton
        variant="red"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'DELETING...' : 'CONFIRM'}
      </PixelButton>
      <PixelButton
        variant="cyan"
        onClick={() => setShowConfirm(false)}
        disabled={isDeleting}
      >
        CANCEL
      </PixelButton>
    </div>
  );
}
