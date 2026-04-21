import { SongListItem } from './SongListItem';
import type { Song } from '@/types';

interface SongListProps {
  songs: Song[];
  onViewAll?: () => void;
  onPlaySong?: (songId: string) => void;
}

export function SongList({ songs, onViewAll, onPlaySong }: SongListProps) {
  return (
    <section className="py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 mb-1">
        <h2 className="text-lg font-semibold text-text-primary">
          Recent Songs
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-medium text-brand-indigo transition-colors hover:text-brand-purple"
        >
          View All &gt;
        </button>
      </div>

      {/* Song Items */}
      <div className="space-y-0.5">
        {songs.map((song) => (
          <SongListItem key={song.id} song={song} onPlay={onPlaySong} />
        ))}
      </div>
    </section>
  );
}
