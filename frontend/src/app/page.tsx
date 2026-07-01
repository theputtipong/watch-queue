// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Catalog } from '../components/Catalog/Catalog';
import { UserSelector } from '../components/Shared/UserSelector';
import { PlaySquare } from 'lucide-react';

export default function Home() {
  const [userId, setUserId] = useState('user1');

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <PlaySquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              WatchQueue
            </h1>
          </div>

          {/* User Selector จำลองการเปลี่ยน User */}
          <UserSelector currentUserId={userId} onUserChange={setUserId} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Your Personal <span className="text-blue-500">Watch</span> List
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          ค้นหาและจัดการคิววิดีโอที่คุณต้องการดูได้อย่างง่ายดาย พร้อมระบบบันทึกสถานะเรียลไทม์ (Optimistic UI)
        </p>
      </section>

      {/* Main Content: Catalog Component */}
      <section className="px-6 relative z-10">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <Catalog userId={userId} />
      </section>
    </main>
  );
}
