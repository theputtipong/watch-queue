// src/components/Catalog/Catalog.tsx
'use client';

import { useState } from 'react';
import { FilterBar } from './FilterBar';
import { ItemCard } from '../ItemCard/ItemCard';
import { SkeletonCard } from './SkeletonCard';
import { useDebounce } from '../../hooks/useDebounce';
import { useCatalog } from '../../hooks/useCatalog';
import { useUserQueue } from '../../hooks/useUserQueue';

interface CatalogProps {
  userId: string;
}

export function Catalog({ userId }: CatalogProps) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');

  // ใช้ Custom Hook ช่วยทำ Debounce รอ 500ms หลังจากพิมพ์เสร็จ
  const debouncedSearch = useDebounce(search, 500);

  // ใช้ React Query สำหรับดึงข้อมูลแบบ Real-time พร้อม Cache
  const { data: contents = [], isLoading: isContentsLoading } = useCatalog({ search: debouncedSearch, genre });
  const { data: userQueue = [], isLoading: isQueueLoading } = useUserQueue(userId);

  const isLoading = isContentsLoading || isQueueLoading;

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      <FilterBar 
        searchQuery={search} 
        onSearchChange={setSearch} 
        genre={genre} 
        onGenreChange={setGenre} 
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* แรนดอมแสดง Skeleton จำนวน 8 กล่องระหว่างโหลด */}
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">ไม่พบวิดีโอที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((item) => {
            // หา State เริ่มต้นจาก userQueue ที่อยู่ใน Cache
            const queueItem = userQueue.find(q => q.videoId === item.id);
            const initialState = queueItem ? queueItem.state : 'UNSAVED';

            return (
              <ItemCard 
                key={item.id} 
                item={item} 
                userId={userId}
                initialQueueState={initialState}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
