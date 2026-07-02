'use client';
import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
interface ToastMessage {
  id: number;
  message: string;
}
export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast = { id: Date.now(), message: customEvent.detail.message };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };
    window.addEventListener('SHOW_TOAST', handleShowToast);
    return () => window.removeEventListener('SHOW_TOAST', handleShowToast);
  }, []);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5" />
          <span>{toast.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
