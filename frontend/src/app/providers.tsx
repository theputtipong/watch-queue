'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // ข้อมูลถือว่าสดใหม่ 1 นาที
        refetchOnWindowFocus: false, // ป้องกันการดึงข้อมูลใหม่รัวๆ เวลากลับมาที่แท็บ
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
