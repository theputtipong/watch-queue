'use client';
import { VideoItem, QueueState } from '../../types';
import { QueueButton } from './QueueButton';
import { useQueueStateMachine } from '../../hooks/useQueueStateMachine';
interface ItemCardProps {
  item: VideoItem;
  userId: string;
  initialQueueState: QueueState;
}
export function ItemCard({ item, userId, initialQueueState }: ItemCardProps) {
  const { state, changeState, isMutating } = useQueueStateMachine({
    userId,
    videoId: item.id,
    initialState: initialQueueState,
  });
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/20">
      {}
      <div className="aspect-video w-full bg-gray-800 relative">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
        {}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-white">
            {item.duration}
          </span>
          <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-yellow-400">
            {item.rating}
          </span>
        </div>
      </div>
      {}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-white truncate" title={item.title}>
            {item.title}
          </h3>
          <p className="text-sm text-gray-400">
            {item.genre} • {item.year}
          </p>
        </div>
        {}
        <QueueButton 
          state={state} 
          isMutating={isMutating} 
          onChangeState={changeState} 
        />
      </div>
    </div>
  );
}
