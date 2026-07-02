'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ItemCard } from '../../components/ItemCard/ItemCard';
import { SkeletonCard } from '../../components/Catalog/SkeletonCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useUserQueue } from '../../hooks/useUserQueue';
import { UserSelector } from '../../components/Shared/UserSelector';
import { ArrowLeft, ListVideo } from 'lucide-react';
export default function MyQueuePage() {
  const [userId, setUserId] = useState('user1');
  const { data: contents = [], isLoading: isContentsLoading } = useCatalog({ search: '', genre: 'All' });
  const { data: userQueue = [], isLoading: isQueueLoading } = useUserQueue(userId);
  const isLoading = isContentsLoading || isQueueLoading;
  const queuedContents = contents.filter(item => 
    userQueue.some(q => q.videoId === item.id && (q.state === 'QUEUED' || q.state === 'WATCHED'))
  );
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </Link>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <ListVideo className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              My Queue
            </h1>
          </div>
          <UserSelector currentUserId={userId} onUserChange={setUserId} />
        </div>
      </header>
      {}
      <section className="px-6 py-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">วิดีโอที่บันทึกไว้</h2>
          <p className="text-gray-400 mt-2">รายการทั้งหมดที่คุณบันทึกไว้ในคิวหรือดูจบแล้ว</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : queuedContents.length === 0 ? (
          <div className="text-center text-gray-500 mt-32">
            <p className="text-2xl font-semibold mb-2">ไม่มีวิดีโอในคิว</p>
            <p>กลับไปที่หน้าหลักเพื่อเลือกวิดีโอที่คุณสนใจ</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
              เลือกดูวิดีโอ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {queuedContents.map((item) => {
              const queueItem = userQueue.find(q => q.videoId === item.id);
              return (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  userId={userId}
                  initialQueueState={queueItem!.state}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
