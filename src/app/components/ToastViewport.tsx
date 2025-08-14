"use client";
import React from "react";
import { useToast } from "../context/ToastContext";

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();
  if (!toasts.length) return null;

  const accent = (type: string) =>
    type === "success"
      ? { grad: "from-emerald-400 to-emerald-600", icon: "text-emerald-600" }
      : type === "error"
      ? { grad: "from-rose-400 to-rose-600", icon: "text-rose-600" }
      : type === "warning"
      ? { grad: "from-amber-400 to-amber-600", icon: "text-amber-600" }
      : { grad: "from-sky-400 to-blue-600", icon: "text-blue-600" };

  const Icon = ({ type }: { type: string }) => {
    const c = accent(type).icon;
    if (type === "success") {
      return (
        <svg className={`h-5 w-5 ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      );
    }
    if (type === "error") {
      return (
        <svg className={`h-5 w-5 ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2.5" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    }
    if (type === "warning") {
      return (
        <svg className={`h-5 w-5 ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.49 14.7A1.5 1.5 0 003 21h18a1.5 1.5 0 001.29-2.44l-8.49-14.7a1.5 1.5 0 00-2.58 0z" />
        </svg>
      );
    }
    return (
      <svg className={`h-5 w-5 ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2.5" strokeLinecap="round" d="M12 6v6m0 6h.01" />
      </svg>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-3 pointer-events-none">
      {toasts.map((t) => {
        const c = accent(t.type);
        return (
          <div
            key={t.id}
            className="relative flex items-center gap-3 px-4 py-2.5 min-w-[240px] max-w-[380px] rounded-2xl bg-white/60 backdrop-blur-lg border border-white/50 shadow-xl shadow-black/5 ring-1 ring-white/30 pointer-events-auto"
          >
            <div className={`absolute left-0 top-1 bottom-1 w-1.5 rounded-full bg-gradient-to-b ${c.grad} ring-1 ring-white/40`} />
            <div className="pt-0.5 shrink-0">
              <div className="h-7 w-7 rounded-full bg-white/70 border border-white/60 flex items-center justify-center">
                <Icon type={t.type} />
              </div>
            </div>
            <div className="text-sm text-gray-800 pr-6 leading-6">{t.message}</div>
            <button
              aria-label="Fechar"
              onClick={() => removeToast(t.id)}
              className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/80 border border-white/60 text-gray-500 hover:text-gray-700 hover:bg-white/90 transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                <path strokeWidth="2.5" strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
