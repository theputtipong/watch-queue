// src/hooks/useQueueStateMachine.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueueState, QueueItem } from '../types';
import { queueApi } from '../api/queueApi';
import { ApiError } from '../api/apiClient';

interface UseQueueStateMachineProps {
  userId: string;
  videoId: string;
  initialState?: QueueState;
}

export function useQueueStateMachine({ userId, videoId, initialState = 'UNSAVED' }: UseQueueStateMachineProps) {
  const queryClient = useQueryClient();

  // ดึง State ปัจจุบันจาก Cache ของ React Query ถ้ามี (ถ้ายังไม่มีใช้ initialState)
  const queryKey = ['queue', userId];
  const cachedQueue = queryClient.getQueryData<QueueItem[]>(queryKey) || [];
  const currentItem = cachedQueue.find(q => q.videoId === videoId);
  const state = currentItem ? currentItem.state : initialState;

  const mutation = useMutation({
    mutationFn: async (newState: QueueState) => {
      if (newState === 'UNSAVED') {
        await queueApi.upsertQueueItem(userId, videoId, 'UNSAVED');
        return { videoId, state: 'UNSAVED' as QueueState, updatedAt: Date.now() };
      }
      return queueApi.upsertQueueItem(userId, videoId, newState);
    },
    // เมื่อกดปุ่มปุ๊บ ทำ Optimistic Update ทันที
    onMutate: async (newState) => {
      // 1. ยกเลิก Request เดิม (ถ้ามี) เพื่อไม่ให้ค่าเก่ามาทับค่าใหม่ (ป้องกัน Race condition)
      await queryClient.cancelQueries({ queryKey });

      // 2. จำค่าเก่าไว้ก่อน Rollback
      const previousQueue = queryClient.getQueryData<QueueItem[]>(queryKey);

      // 3. เขียนทับ Cache ทันที (Optimistic Update)
      queryClient.setQueryData<QueueItem[]>(queryKey, (old) => {
        const queueList = old || [];
        const index = queueList.findIndex(q => q.videoId === videoId);
        const updatedItem = { videoId, state: newState, updatedAt: Date.now() };
        
        if (newState === 'UNSAVED') {
          // ถ้าเป็น UNSAVED ให้ลบออกจากคิว (ตามดีไซน์ของเรา)
          return queueList.filter(q => q.videoId !== videoId);
        }
        
        if (index > -1) {
          const newList = [...queueList];
          newList[index] = updatedItem;
          return newList;
        }
        return [...queueList, updatedItem];
      });

      return { previousQueue };
    },
    // ถ้ายิง API เฟล (เช่น เน็ตพัง หรือ 400 Bad Request)
    onError: (err, newState, context) => {
      // 4. Rollback กลับเป็นค่าเดิม
      if (context?.previousQueue) {
        queryClient.setQueryData(queryKey, context.previousQueue);
      }
      
      // ส่ง Toast แยกระหว่าง Network กับ Server Error
      let errorMsg = err.message;
      if (err instanceof ApiError) {
        errorMsg = err.type === 'NETWORK' 
          ? `การเชื่อมต่อขัดข้อง: ${err.message}` 
          : `คำสั่งถูกปฏิเสธ: ${err.message}`;
      }
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: errorMsg } }));
    },
    // ทำงานสำเร็จ (ยิง API ผ่าน)
    onSuccess: (data, newState) => {
      let successMsg = '';
      if (newState === 'UNSAVED') successMsg = 'ลบออกจากคิวแล้ว';
      else if (newState === 'QUEUED') successMsg = 'เพิ่มเข้าคิวแล้ว';
      else if (newState === 'WATCHED') successMsg = 'ทำเครื่องหมายว่าดูแล้ว';
      
      // ส่ง Toast แบบ Success (คุณอาจปรับแต่ง ToastProvider ให้รองรับ type ได้)
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: successMsg } }));
    },
    // ทำงานเสร็จเสมอ (ทั้งผ่านและไม่ผ่าน)
    onSettled: () => {
      // 5. ดึงข้อมูลจริงจาก Server อีกรอบเพื่อความชัวร์ (Sync)
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    state,
    changeState: mutation.mutate,
    isMutating: mutation.isPending,
  };
}
