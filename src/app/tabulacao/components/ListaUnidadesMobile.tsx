import React from "react";
import { Unidade } from "../../types";
import { MapPin } from "lucide-react";
const PLANOS = ["Sênior", "Executivo", "Pleno", "Especial FESP"];

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
      <ul className="space-y-4 px-1">
        {dadosOrdenados.map((item, idx) => (
          <li
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
            onClick={() => { setSelectedItem(item); setModalOpen(true); }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[16px] text-gray-900 line-clamp-2 flex-1">{item.nomeFantasia}</span>
            </div>
            {/* Legenda de grupos */}
            <div className="flex flex-col gap-0.5 mb-1">
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold uppercase">
                <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                Unimed FESP
              </div>
              <div className="flex flex-wrap gap-1 mb-1 ml-3">
                {["Sênior", "Especial FESP"].map((plano: string) => (
                  <span
                    key={plano}
                    className={
                      `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest w-fit ` +
                      (planoAtivo && planoAtivo !== plano ? 'opacity-30' : '') +
                      (atendePlano(item.planos, plano)
                        ? (plano === 'Especial FESP'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800')
                        : 'bg-gray-100 text-gray-400 line-through')
                    }
                  >
                    {plano}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold uppercase mt-1">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                Unimed Campinas
              </div>
              <div className="flex flex-wrap gap-1 mb-1 ml-3">
                {["Executivo", "Pleno"].map((plano: string) => (
                  <span
                    key={plano}
                    className={
                      `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest w-fit ` +
                      (planoAtivo && planoAtivo !== plano ? 'opacity-30' : '') +
                      (atendePlano(item.planos, plano)
                        ? (plano === 'Executivo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800')
                        : 'bg-gray-100 text-gray-400 line-through')
                    }
                  >
                    {plano}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-4 w-4 text-blue-300" />
              <span className="truncate">
                {item.endereco?.municipio} - {item.endereco?.sigUf}
                {item.endereco?.bairro ? `, ${item.endereco.bairro}` : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
