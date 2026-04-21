'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  return (
    <div className="px-5 py-2">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-xl bg-surface-tertiary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-brand-indigo/20"
          aria-label="Search"
        />
      </div>
    </div>
  );
}
