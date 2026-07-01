// src/components/ItemCard/QueueButton.tsx
'use client';

import { Play, Plus, Check } from 'lucide-react';
import { QueueState } from '../../types';

interface QueueButtonProps {
  state: QueueState;
  isMutating: boolean;
  onChangeState: (newState: QueueState) => void;
}

export function QueueButton({ state, isMutating, onChangeState }: QueueButtonProps) {
  // สไตล์และไอคอนสำหรับแต่ละ State
  const config = {
    UNSAVED: {
      label: 'Add to Queue',
      icon: Plus,
      color: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
      nextState: 'QUEUED' as QueueState,
    },
    QUEUED: {
      label: 'Mark as Watched',
      icon: Play,
      color: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30',
      nextState: 'WATCHED' as QueueState,
    },
    WATCHED: {
      label: 'Watched (Remove)',
      icon: Check,
      color: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30',
      nextState: 'UNSAVED' as QueueState,
    },
  };

  const currentConfig = config[state];
  const Icon = currentConfig.icon;

  return (
    <button
      disabled={isMutating}
      onClick={() => onChangeState(currentConfig.nextState)}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
        ${currentConfig.color}
        ${isMutating ? 'opacity-50 cursor-not-allowed scale-95' : 'active:scale-95'}
      `}
    >
      <Icon className={`w-4 h-4 ${isMutating ? 'animate-pulse' : ''}`} />
      <span className="text-sm">{currentConfig.label}</span>
    </button>
  );
}
