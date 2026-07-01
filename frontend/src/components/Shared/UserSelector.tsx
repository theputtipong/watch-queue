// src/components/Shared/UserSelector.tsx
'use client';

import { User } from 'lucide-react';

interface UserSelectorProps {
  currentUserId: string;
  onUserChange: (userId: string) => void;
}

const USERS = [
  { id: 'user1', name: 'User 1 (Admin)' },
  { id: 'user2', name: 'User 2 (Guest)' },
];

export function UserSelector({ currentUserId, onUserChange }: UserSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
      <User className="w-4 h-4 text-gray-300" />
      <select
        value={currentUserId}
        onChange={(e) => onUserChange(e.target.value)}
        className="bg-transparent text-white outline-none cursor-pointer text-sm font-medium"
      >
        {USERS.map((u) => (
          <option key={u.id} value={u.id} className="text-black">
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}
