// ...existing code...

import React, { useRef } from 'react';

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!open) return null;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl max-h-[90vh] w-full max-w-3xl overflow-y-auto relative p-10 sm:p-14 text-black"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-8 text-gray-400 hover:text-black text-3xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
