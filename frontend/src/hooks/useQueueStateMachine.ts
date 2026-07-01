// src/hooks/useQueueStateMachine.ts
import { useState, useCallback, useRef } from "react";
import { QueueState } from "../types";
import { queueApi } from "../api/queueApi";

interface UseQueueStateMachineProps {
  userId: string;
  videoId: string;
  initialState?: QueueState;
}

export function useQueueStateMachine({
  userId,
  videoId,
  initialState = "UNSAVED",
}: UseQueueStateMachineProps) {
  const [state, setState] = useState<QueueState>(initialState);
  const [isMutating, setIsMutating] = useState(false);
  // ใช้ ref สำหรับเก็บสถานะก่อนหน้าในกรณีที่ API เกิดข้อผิดพลาด (Rollback)
  const previousStateRef = useRef<QueueState>(initialState);

  // Sync state จากภายนอก (ในกรณีที่โหลดจาก API)
  // แต่ในที่นี้เราจัดการผ่าน state ภายใน และจะ update state เมื่อ props.initialState เปลี่ยน
  if (initialState !== previousStateRef.current && !isMutating) {
    setState(initialState);
    previousStateRef.current = initialState;
  }

  const changeState = useCallback(
    async (newState: QueueState) => {
      // ป้องกัน Race condition (ไม่ให้คลิกซ้ำขณะรอ API)
      if (isMutating) return;

      // อัปเดต ref ก่อน
      previousStateRef.current = state;

      // 1. อัปเดต UI ทันที (Optimistic UI)
      setState(newState);
      setIsMutating(true);

      try {
        // 2. เรียก API ไปยัง Backend
        if (newState === "UNSAVED") {
          // ในระบบของเรา ถ้ายกเลิก Queue สามารถเรียก API แบบเปลี่ยน State ก็ได้
          await queueApi.upsertQueueItem(userId, videoId, "UNSAVED");
        } else {
          await queueApi.upsertQueueItem(userId, videoId, newState);
        }
        setIsMutating(false);
      } catch (error: any) {
        // 3. ถ้า API ล้มเหลว ให้ทำการ Rollback กลับไป State เดิม
        console.error("Failed to change queue state:", error);
        setState(previousStateRef.current);
        window.dispatchEvent(
          new CustomEvent("SHOW_TOAST", {
            detail: {
              message: `Failed to update queue state: ${error.message}`,
            },
          }),
        );
        setIsMutating(false);
      }
    },
    [isMutating, state, userId, videoId],
  );

  return { state, changeState, isMutating };
}
