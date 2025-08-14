import React from 'react';

interface CardProps {
  nomeFantasia: string;
  endereco: string;
  telefones: string[];
  lat: number;
  long: number;
  planos: string[];
}

const UnidadeCard: React.FC<CardProps> = ({ nomeFantasia, endereco, telefones, lat, long, planos }) => {
  // Ordenação desejada das badges
  const ordemPlanos = ['Clássico', 'Especial 100', 'Nacional', 'Executivo'];
  const planosOrdenados = ordemPlanos.filter(p => planos.includes(p));
  return (
    <div className="backdrop-blur-md bg-white/90 border border-gray-100 rounded-2xl shadow-xl p-7 mb-4 flex flex-col gap-3 transition hover:scale-[1.03] hover:shadow-2xl cursor-pointer h-[360px] min-h-[360px]">
      <div className="flex gap-1 mb-1 flex-wrap">
        {planosOrdenados.map((plano) => (
          <span key={plano} className={
            `inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit shadow-sm ` +
            (plano === 'Clássico' ? 'bg-blue-100 text-blue-800' :
            plano === 'Especial 100' ? 'bg-purple-100 text-purple-800' :
            plano === 'Executivo' ? 'bg-green-100 text-green-800' :
            plano === 'Nacional' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800')
          }>{plano}</span>
        ))}
      </div>
      <h2 className="font-bold text-2xl text-gray-900 mb-1 tracking-tight leading-tight truncate mt-1" title={nomeFantasia}>{nomeFantasia}</h2>
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
        className="inline-block mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white text-sm font-semibold shadow hover:brightness-110 transition"
      >
        Ver no Google Maps
      </a>
    </div>
  );
};

export default UnidadeCard;
