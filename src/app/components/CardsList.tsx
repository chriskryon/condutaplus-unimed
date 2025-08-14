import UnidadeCard from "./UnidadeCard";
import React from "react";

interface CardsListProps {
  dados: any[];
  onCardClick: (item: any) => void;
}

export default function CardsList({ dados, onCardClick }: CardsListProps) {
  if (!dados.length) {
    return <div className="text-center text-gray-500 mt-12">Nenhuma unidade encontrada.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {dados.map((item, idx) => (
        <div key={idx} onClick={() => onCardClick(item)} className="cursor-pointer">
          <UnidadeCard
            nomeFantasia={item.nomeFantasia}
            endereco={`${item.endereco.endereco}, ${item.endereco.numeroEndereco} ${item.endereco.complementoEndereco ? '- ' + item.endereco.complementoEndereco : ''}, ${item.endereco.bairro}, ${item.endereco.municipio} - ${item.endereco.sigUf}, CEP: ${item.endereco.cep}`}
            telefones={item.telefones?.map((t: any) => t.telefone) || []}
            lat={item.posicaoGeografica?.latitude}
            long={item.posicaoGeografica?.longitude}
            planos={item.planos}
          />
        </div>
      ))}
    </div>
  );
}
