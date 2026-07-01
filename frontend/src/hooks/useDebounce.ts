// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom Hook สำหรับหน่วงเวลา (Debounce) ค่าที่ผู้ใช้พิมพ์
 * เพื่อลดการเรียก API ถี่เกินไปเวลาพิมพ์ค้นหา
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // ตั้งเวลาอัปเดตค่าใหม่
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // หาก value เปลี่ยนแปลงก่อนหมดเวลา จะยกเลิก timeout เดิม (Clear Timeout)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
