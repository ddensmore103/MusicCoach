import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Song } from '@/types';

interface SongListItemProps {
  song: Song;
  onPlay?: (songId: string) => void;
}

export function SongListItem({ song, onPlay }: SongListItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-5 py-2.5 transition-colors active:bg-surface-tertiary">
      {/* Thumbnail */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface-tertiary">
        <Image
          src={song.thumbnailUrl}
          alt={song.title}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text-primary truncate">
          {song.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-secondary truncate">
            {song.subtitle}
          </span>
          <span className="text-xs text-text-tertiary">·</span>
          <span className="text-xs text-text-tertiary flex-shrink-0">
            {song.timestamp}
          </span>
        </div>
      </div>

      {/* Play Button */}
      <button
        onClick={() => onPlay?.(song.id)}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-indigo/10 text-brand-indigo transition-all hover:bg-brand-indigo/20 active:scale-95"
        aria-label={`Play ${song.title}`}
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
}
