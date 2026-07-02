// src/components/Shared/UserSelector.tsx
'use client';

import { User, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface UserSelectorProps {
  currentUserId: string;
  onUserChange: (userId: string) => void;
}

export function UserSelector({ currentUserId, onUserChange }: UserSelectorProps) {
  const [inputValue, setInputValue] = useState(currentUserId);
  const debouncedValue = useDebounce(inputValue, 500);

  // ส่งค่ากลับไปหา Parent เมื่อพิมพ์เสร็จ (ผ่าน Debounce)
  useEffect(() => {
    onUserChange(debouncedValue.trim());
  }, [debouncedValue, onUserChange]);

  const isEmpty = inputValue.trim() === '';

  return (
    <div className="relative flex flex-col items-end">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-colors">
        <User className="w-4 h-4 text-gray-300" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="กรอก User ID..."
          className="bg-transparent text-white outline-none w-32 text-sm font-medium placeholder-gray-500"
        />
      </div>
      
      {/* Inline Error Message */}
      {isEmpty && (
        <div className="absolute top-full mt-2 right-0 flex items-center gap-1 text-xs text-white bg-white/10 px-2 py-1 rounded border border-white/20 backdrop-blur-md whitespace-nowrap shadow-lg">
          <AlertCircle className="w-3 h-3" />
          <span>User ID ห้ามเว้นว่าง</span>
        </div>
      )}
    </div>
  );
}
