// src/__tests__/hooks/useQueueStateMachine.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useQueueStateMachine } from '../../hooks/useQueueStateMachine';
import { queueApi } from '../../api/queueApi';

// Mock API
jest.mock('../../api/queueApi');

describe('useQueueStateMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with provided state', () => {
    const { result } = renderHook(() =>
      useQueueStateMachine({ userId: 'u1', videoId: 'v1', initialState: 'QUEUED' })
    );
    expect(result.current.state).toBe('QUEUED');
    expect(result.current.isMutating).toBe(false);
  });

  it('should optimistically update state on success', async () => {
    (queueApi.upsertQueueItem as jest.Mock).mockResolvedValueOnce({ state: 'WATCHED' });

    const { result } = renderHook(() =>
      useQueueStateMachine({ userId: 'u1', videoId: 'v1', initialState: 'QUEUED' })
    );

    await act(async () => {
      await result.current.changeState('WATCHED');
    });

    expect(result.current.state).toBe('WATCHED');
    expect(queueApi.upsertQueueItem).toHaveBeenCalledWith('u1', 'v1', 'WATCHED');
  });

  it('should rollback state if API fails', async () => {
    (queueApi.upsertQueueItem as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() =>
      useQueueStateMachine({ userId: 'u1', videoId: 'v1', initialState: 'QUEUED' })
    );

    await act(async () => {
      await result.current.changeState('WATCHED');
    });

    // ต้อง Rollback กลับไปที่ QUEUED เนื่องจาก API Error
    expect(result.current.state).toBe('QUEUED');
  });

  it('should prevent race conditions when isMutating is true', async () => {
    // หน่วงเวลา mock API เพื่อให้จำลองสถานะ pending
    let resolveApi: any;
    (queueApi.upsertQueueItem as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        resolveApi = resolve;
      });
    });

    const { result } = renderHook(() =>
      useQueueStateMachine({ userId: 'u1', videoId: 'v1', initialState: 'UNSAVED' })
    );

    // ครั้งที่ 1: เรียกเพื่อเปลี่ยนเป็น QUEUED
    act(() => {
      result.current.changeState('QUEUED');
    });

    expect(result.current.isMutating).toBe(true);
    expect(result.current.state).toBe('QUEUED'); // Optimistic

    // ครั้งที่ 2: กดรัวๆ พยายามเปลี่ยนเป็น WATCHED (ควรถูก ignore)
    await act(async () => {
      await result.current.changeState('WATCHED');
    });

    // ตรวจสอบว่า API ถูกเรียกไปแค่ 1 ครั้ง (ครั้งแรก)
    expect(queueApi.upsertQueueItem).toHaveBeenCalledTimes(1);
    expect(queueApi.upsertQueueItem).toHaveBeenCalledWith('u1', 'v1', 'QUEUED');

    // จำลองให้ API ตอบกลับสำเร็จ
    await act(async () => {
      resolveApi({ state: 'QUEUED' });
    });

    expect(result.current.isMutating).toBe(false);
  });
});
