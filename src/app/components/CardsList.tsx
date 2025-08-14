import UnidadeCard from "./UnidadeCard";
import React from "react";
import { Telefone, Unidade } from "../types";

interface CardsListProps {
  dados: Unidade[];
  onCardClick: (item: Unidade) => void;
}

export default function CardsList({ dados, onCardClick }: CardsListProps) {
  if (!dados.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
  {dados.map((item: Unidade, idx: number) => (
        <div key={idx} onClick={() => onCardClick(item)} className="cursor-pointer">
          <UnidadeCard
            nomeFantasia={item.nomeFantasia}
            endereco={`${item.endereco.endereco}, ${item.endereco.numeroEndereco} ${item.endereco.complementoEndereco ? '- ' + item.endereco.complementoEndereco : ''}, ${item.endereco.bairro}, ${item.endereco.municipio} - ${item.endereco.sigUf}, CEP: ${item.endereco.cep}`}
            telefones={item.telefones?.map((t: Telefone) => t.telefone) || []}
            lat={item.posicaoGeografica?.latitude}
            long={item.posicaoGeografica?.longitude}
            planos={item.planos}
          />
        </div>
      ))}
    </div>
  );
}
