"use client";
import React from "react";
import { useToast } from "../context/ToastContext";

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();
  if (!toasts.length) return null;

  const color = (type: string) =>
    type === "success" ? "bg-green-600" :
    type === "error" ? "bg-red-600" :
    type === "warning" ? "bg-yellow-600" : "bg-blue-600";

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`min-w-[220px] max-w-[360px] text-white shadow-lg rounded-lg overflow-hidden`}>
          <div className={`px-3 py-2 text-sm font-medium ${color(t.type)}`}>{t.message}</div>
          <button onClick={() => removeToast(t.id)} className="w-full px-3 py-1.5 text-xs bg-white text-gray-700 hover:bg-gray-50 border-t">Fechar</button>
        </div>
      ))}
    </div>
  );
}
