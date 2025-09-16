import React from "react";
import { Unidade } from "../../types";
import { useTabulacao } from "../context/TabulacaoContext";

const PLANOS = ["Sênior", "Especial FESP", "Executivo", "Pleno"];

const SortArrow = ({ active }: { active: boolean }) => (
  <span className={`ml-1 transition-transform ${active ? "text-blue-600" : "text-gray-400"}`}>▲</span>
);

export default function TabelaUnidades({ dadosOrdenados, planoAtivo, atendePlano, setModalOpen, setSelectedItem }: {
  dadosOrdenados: Unidade[];
  planoAtivo: string | null;
  atendePlano: (planosUnidade: string[] | undefined, planoVerificar: string) => boolean;
  setModalOpen: (open: boolean) => void;
  setSelectedItem: (item: Unidade) => void;
}) {
  const { ordenacao, setOrdenacao } = useTabulacao();
  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="w-full min-w-[800px] bg-white rounded-xl shadow overflow-hidden">
        <thead className="sticky top-0 z-20">
          <tr>
            <th rowSpan={2} className="px-3 py-2 text-left text-[11px] font-bold uppercase text-gray-600 bg-gray-50/90 backdrop-blur sticky left-0 z-30">Nome</th>
            <th colSpan={2} className={`px-3 py-2 text-center text-[11px] font-bold uppercase text-gray-600 bg-gray-50/90 backdrop-blur border-l border-gray-200 cursor-pointer hover:bg-blue-100 ${ordenacao === "fesp" ? "bg-blue-100" : ""}`}
                onClick={() => setOrdenacao(ordenacao === "fesp" ? null : "fesp")}
            >
              Unimed FESP
              <SortArrow active={ordenacao === "fesp"} />
            </th>
            <th colSpan={2} className={`px-3 py-2 text-center text-[11px] font-bold uppercase text-gray-600 bg-gray-50/90 backdrop-blur border-l border-gray-200 cursor-pointer hover:bg-green-100 ${ordenacao === "campinas" ? "bg-green-100" : ""}`}
                onClick={() => setOrdenacao(ordenacao === "campinas" ? null : "campinas")}
            >
              Unimed Campinas
              <SortArrow active={ordenacao === "campinas"} />
            </th>
          </tr>
          <tr>
            <th className="px-3 py-2 text-[10px] font-bold uppercase bg-gray-50/90 backdrop-blur text-gray-600 border-l border-gray-200">
              <span className="inline-flex items-center justify-center tracking-wide" title="Sênior">
                <span className="h-3 w-3 rounded-full bg-orange-500 mr-1"></span>
                Sênior
              </span>
            </th>
            <th className="px-3 py-2 text-[10px] font-bold uppercase bg-gray-50/90 backdrop-blur text-gray-600">
              <span className="inline-flex items-center justify-center tracking-wide" title="Especial FESP">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                Especial FESP
              </span>
            </th>
            <th className="px-3 py-2 text-[10px] font-bold uppercase bg-gray-50/90 backdrop-blur text-gray-600 border-l border-gray-200">
              <span className="inline-flex items-center justify-center tracking-wide" title="Executivo">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                Executivo
              </span>
            </th>
            <th className="px-3 py-2 text-[10px] font-bold uppercase bg-gray-50/90 backdrop-blur text-gray-600">
              <span className="inline-flex items-center justify-center tracking-wide" title="Pleno">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                Pleno
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {dadosOrdenados.map((item: Unidade, idx: number) => (
            <tr
              key={idx}
              className={`border-t transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}
              onClick={() => { setSelectedItem(item); setModalOpen(true); }}
            >
              <td className={`px-3 py-2 font-medium text-gray-900 text-sm truncate max-w-[220px] md:max-w-[360px] sticky left-0 z-10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} title={item.nomeFantasia}>{item.nomeFantasia}</td>
              {PLANOS.map(plano => (
                <td key={plano} className={`px-3 py-2 text-center ${planoAtivo ? (planoAtivo === plano ? '' : 'opacity-30') : ''} ${plano === 'Executivo' ? 'border-l border-gray-200' : ''}`}>
                  {atendePlano(item.planos, plano) ? (
                    <svg aria-label="Presente" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="inline-block h-4 w-4 text-green-600 align-middle">
                      <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg aria-label="Não presente" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="inline-block h-4 w-4 text-gray-300 align-middle">
                      <path strokeWidth="2.5" strokeLinecap="round" d="M5 12h14" />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
