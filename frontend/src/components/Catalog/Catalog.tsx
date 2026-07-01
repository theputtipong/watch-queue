// src/components/Catalog/Catalog.tsx
'use client';

import { useState, useEffect } from 'react';
import { FilterBar } from './FilterBar';
import { ItemCard } from '../ItemCard/ItemCard';
import { contentApi } from '../../api/contentApi';
import { queueApi } from '../../api/queueApi';
import { VideoItem, QueueItem } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

interface CatalogProps {
  userId: string;
}

export function Catalog({ userId }: CatalogProps) {
  const [contents, setContents] = useState<VideoItem[]>([]);
  const [userQueue, setUserQueue] = useState<QueueItem[]>([]);
  
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // ใช้ Custom Hook ช่วยทำ Debounce รอ 500ms หลังจากพิมพ์เสร็จ
  const debouncedSearch = useDebounce(search, 500);

  // โหลดรายการ Queue ของผู้ใช้ (โหลดใหม่เมื่อเปลี่ยน User)
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const queue = await queueApi.getQueue(userId);
        setUserQueue(queue);
      } catch (err) {
        console.error('Failed to load queue');
      }
    };
    fetchQueue();
  }, [userId]);

  // โหลดรายการวิดีโอ (ดึงใหม่เมื่อ Debounce Search หรือ Genre เปลี่ยน)
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const data = await contentApi.getContents(debouncedSearch, genre);
        setContents(data);
      } catch (err) {
        console.error('Failed to load contents');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContents();
  }, [debouncedSearch, genre]);

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      <FilterBar 
        searchQuery={search} 
        onSearchChange={setSearch} 
        genre={genre} 
        onGenreChange={setGenre} 
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">ไม่พบวิดีโอที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((item) => {
            // หา State เริ่มต้นจาก userQueue ที่โหลดมาจาก API ครั้งแรก
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
