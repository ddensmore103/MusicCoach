import Image from 'next/image';
import type { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  onStartLesson?: () => void;
}

export function LessonCard({ lesson, onStartLesson }: LessonCardProps) {
  return (
    <div className="px-5 py-2">
      <h2 className="mb-3 text-lg font-semibold text-text-primary">
        Your Lesson
      </h2>

      <div className="gradient-lesson-card flex items-center gap-4 rounded-2xl p-4 shadow-card">
        {/* Robot Illustration */}
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={lesson.imageUrl}
            alt="AI Music Coach"
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-tight">
            {lesson.title}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary leading-snug">
            {lesson.subtitle}
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartLesson}
          className="flex-shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-brand-indigo shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          Start Lesson
        </button>
      </div>
    </div>
  );
}
