import React from 'react';

interface CardProps {
  nomeFantasia: string;
  endereco: string;
  telefones: string[];
  lat: number;
  long: number;
}

const UnidadeCard: React.FC<CardProps> = ({ nomeFantasia, endereco, telefones, lat, long }) => {
  return (
  <div className="backdrop-blur-md bg-white/90 border border-gray-100 rounded-2xl shadow-xl p-7 mb-4 flex flex-col gap-4 transition hover:scale-[1.03] hover:shadow-2xl cursor-pointer h-[340px] min-h-[340px]">
      <h2 className="font-bold text-2xl text-gray-900 mb-1 tracking-tight leading-tight truncate" title={nomeFantasia}>{nomeFantasia}</h2>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase font-semibold tracking-widest">Endereço</span>
        <span className="text-base text-gray-800 leading-snug break-words">{endereco}</span>
      </div>
      {telefones.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase font-semibold tracking-widest">Telefones</span>
          <ul className="flex flex-wrap gap-2 mt-1">
            {telefones.map((tel, i) => (
              <li key={i} className="text-sm text-gray-700 bg-gray-100 rounded px-2 py-0.5 font-mono">{tel}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex-1" />
      <a
        href={`https://www.google.com/maps?q=${lat},${long}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow hover:bg-gray-800 transition"
      >
        Ver no Google Maps
      </a>
    </div>
  );
};

export default UnidadeCard;
