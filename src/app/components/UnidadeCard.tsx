import React from 'react';

interface CardProps {
  nomeFantasia: string;
  endereco: string;
  telefones: string[];
  lat?: number;
  long?: number;
  planos?: string[];
}

const UnidadeCard: React.FC<CardProps> = ({ nomeFantasia, endereco, telefones, lat, long, planos }) => {
  const ordemPlanos = ['Sênior', 'Executivo', 'Pleno', 'Especial FESP'];
  
  // Função que verifica se uma unidade atende determinado plano
  function atendePlano(planosUnidade: string[] | undefined, planoVerificar: string): boolean {
    if (!planosUnidade) return false;
    
    // Se a unidade tem o plano diretamente, retorna true
    if (planosUnidade.includes(planoVerificar)) return true;
    
    // Hierarquia de planos - um local com plano superior pode atender planos inferiores
    switch (planoVerificar) {
      case "Especial FESP":
        // Especial FESP só é atendido por locais que têm Especial FESP
        return false;
        
      case "Pleno":
        // Pleno é atendido apenas por locais que têm Pleno
        return false;
        
      case "Executivo":
        // Executivo é atendido por locais que têm Executivo ou Pleno
        return planosUnidade.includes("Pleno");
        
      case "Sênior":
        // Sênior é atendido por locais que têm Sênior ou Especial FESP
        return planosUnidade.includes("Especial FESP");
        
      default:
        return false;
    }
  }
  
  const planosOrdenados = ordemPlanos.filter(p => atendePlano(planos, p));

  return (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 mb-1 flex flex-col transition hover:scale-[1.01] hover:shadow-md cursor-pointer min-h-[60px] h-auto overflow-hidden">
      {/* Badges */}
      {/* Título */}
      <div className="flex items-center min-h-[1.5em] mb-1">
        <h2
          className="font-bold text-[16px] text-gray-800 tracking-tight leading-snug line-clamp-2 w-full"
          title={nomeFantasia}
        >
          {nomeFantasia}
        </h2>
      </div>
      {/* Badges */}
      <div className="flex gap-1 mb-0 flex-wrap">
        {planosOrdenados.map((plano) => (
          <span
            key={plano}
            className={
              `inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit shadow-sm ` +
              (plano === 'Especial FESP'
                ? 'bg-blue-100 text-blue-800'
                : plano === 'Executivo'
                ? 'bg-green-100 text-green-800'
                : plano === 'Sênior'
                ? 'bg-orange-100 text-orange-800'
                : plano === 'Pleno'
                ? 'bg-red-100 text-red-800'
                : 'bg-pink-100 text-pink-800')
            }
          >
            {plano}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UnidadeCard;
