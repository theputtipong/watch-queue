// src/components/Catalog/FilterBar.tsx
'use client';

import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  genre: string;
  onGenreChange: (genre: string) => void;
}

const GENRES = ['All', 'Sci-Fi', 'Action', 'Drama', 'Crime'];

export function FilterBar({ searchQuery, onSearchChange, genre, onGenreChange }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full max-w-4xl mx-auto mb-8 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-black/40 text-white placeholder:text-gray-500 rounded-xl py-3 pl-12 pr-4 outline-none border border-transparent focus:border-blue-500/50 focus:bg-black/60 transition-all"
        />
      </div>

      {/* Genre Filter */}
      <div className="relative w-full md:w-auto min-w-[200px]">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full bg-black/40 text-white rounded-xl py-3 pl-12 pr-4 outline-none appearance-none border border-transparent focus:border-blue-500/50 cursor-pointer"
        >
          {GENRES.map((g) => (
            <option key={g} value={g} className="bg-gray-900 text-white">
              {g}
            </option>
          ))}
        </select>
        {/* Dropdown arrow icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
