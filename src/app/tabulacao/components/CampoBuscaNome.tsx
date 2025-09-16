import React from "react";
import { useTabulacao } from "../context/TabulacaoContext";

export default function CampoBuscaNome() {
  const { buscaNome, setBuscaNome } = useTabulacao();
  return (
    <div className="mb-4 max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nome da unidade..."
          value={buscaNome}
          onChange={(e) => setBuscaNome(e.target.value)}
          className="w-full pl-12 pr-10 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition text-black placeholder-gray-500 shadow-sm bg-white/80"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {buscaNome && (
          <button
            onClick={() => setBuscaNome("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
            tabIndex={-1}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
