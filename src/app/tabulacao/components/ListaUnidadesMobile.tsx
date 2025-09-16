import React from "react";
import { Unidade } from "../../types";
const PLANOS = ["Sênior", "Especial FESP", "Executivo", "Pleno"];

export default function ListaUnidadesMobile({ dadosOrdenados, planoAtivo, atendePlano, setModalOpen, setSelectedItem }: {
  dadosOrdenados: Unidade[];
  planoAtivo: string | null;
  atendePlano: (planosUnidade: string[] | undefined, planoVerificar: string) => boolean;
  setModalOpen: (open: boolean) => void;
  setSelectedItem: (item: Unidade) => void;
}) {
  return (
    <div className="block md:hidden">
      {dadosOrdenados.length === 0 && (
        <div className="text-center text-gray-400 py-8">Nenhuma unidade encontrada</div>
      )}
      <ul className="space-y-3">
        {dadosOrdenados.map((item, idx) => (
          <li
            key={idx}
            className="bg-white rounded-xl shadow border border-gray-100 p-3 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
            onClick={() => { setSelectedItem(item); setModalOpen(true); }}
          >
            <div className="font-semibold text-gray-900 text-base line-clamp-2">{item.nomeFantasia}</div>
            <div className="flex flex-wrap gap-1">
              {PLANOS.map((plano: string) => (
                <span
                  key={plano}
                  className={
                    `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest w-fit ` +
                    (planoAtivo && planoAtivo !== plano ? 'opacity-30' : '') +
                    (atendePlano(item.planos, plano)
                      ? (plano === 'Especial FESP'
                        ? 'bg-blue-100 text-blue-800'
                        : plano === 'Executivo'
                        ? 'bg-green-100 text-green-800'
                        : plano === 'Sênior'
                        ? 'bg-orange-100 text-orange-800'
                        : plano === 'Pleno'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-pink-100 text-pink-800')
                      : 'bg-gray-100 text-gray-400 line-through')
                  }
                >
                  {plano}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {item.endereco?.endereco}, {item.endereco?.municipio} - {item.endereco?.sigUf}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
