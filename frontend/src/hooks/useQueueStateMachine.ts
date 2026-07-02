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
    onMutate: async (newState) => {
      await queryClient.cancelQueries({ queryKey });
      const previousQueue = queryClient.getQueryData<QueueItem[]>(queryKey);
      queryClient.setQueryData<QueueItem[]>(queryKey, (old) => {
        const queueList = old || [];
        const index = queueList.findIndex(q => q.videoId === videoId);
        const updatedItem = { videoId, state: newState, updatedAt: Date.now() };
        if (newState === 'UNSAVED') {
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
    onError: (err, newState, context) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(queryKey, context.previousQueue);
      }
      let errorMsg = err.message;
      if (err instanceof ApiError) {
        errorMsg = err.type === 'NETWORK' 
          ? `การเชื่อมต่อขัดข้อง: ${err.message}` 
          : `คำสั่งถูกปฏิเสธ: ${err.message}`;
      }
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: errorMsg } }));
    },
    onSuccess: (data, newState) => {
      let successMsg = '';
      if (newState === 'UNSAVED') successMsg = 'ลบออกจากคิวแล้ว';
      else if (newState === 'QUEUED') successMsg = 'เพิ่มเข้าคิวแล้ว';
      else if (newState === 'WATCHED') successMsg = 'ทำเครื่องหมายว่าดูแล้ว';
      window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: { message: successMsg } }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return {
    state,
    changeState: mutation.mutate,
    isMutating: mutation.isPending,
  };
}
