import React from "react";
import { useTabulacao } from "../context/TabulacaoContext";

const PLANOS = ["Sênior", "Executivo", "Pleno", "Especial FESP"];

type ResumoPlano = {
  plano: string;
  count: number;
  pct: number;
};

export default function FiltrosPlanos({ resumo }: { resumo: ResumoPlano[] }) {
  const {
    planoAtivo,
    setPlanoAtivo,
    filtroFesp,
    setFiltroFesp,
    filtroCampinas,
    setFiltroCampinas,
    buscaNome,
    setBuscaNome,
  } = useTabulacao();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-3">
      {/* Botão filtro Especial/Sênior */}
      <button
        type="button"
        onClick={() => {
          setFiltroFesp(!filtroFesp);
          if (!filtroFesp) {
            setPlanoAtivo(null);
            setFiltroCampinas(false);
          }
        }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${
          filtroFesp
            ? "bg-[#313a85]/10 border-[#313a85]/30 text-[#1f2466]"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
        title={
          filtroFesp
            ? "Mostrar todos os planos"
            : "Mostrar apenas FESP (Especial FESP e Sênior)"
        }
      >
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
        </span>
        <span>FESP</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setFiltroCampinas(!filtroCampinas);
          if (!filtroCampinas) {
            setPlanoAtivo(null);
            setFiltroFesp(false);
          }
        }}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${
          filtroCampinas
            ? "bg-[#313a85]/10 border-[#313a85]/30 text-[#1f2466]"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
        title={
          filtroCampinas
            ? "Mostrar todos os planos"
            : "Mostrar apenas Campinas (Executivo e Pleno)"
        }
      >
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
        </span>
        <span>Campinas</span>
      </button>

      {/* Filtros individuais de plano - só mostra se filtros de grupo não estiverem ativos */}
      {!filtroFesp && !filtroCampinas &&
        resumo.map(({ plano, count, pct }) => (
          <button
            key={plano}
            type="button"
            onClick={() => setPlanoAtivo(planoAtivo === plano ? null : plano)}
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
              planoAtivo === plano
                ? "bg-[#313a85]/10 border-[#313a85]/30 text-[#1f2466]"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
            title={`Filtrar por ${plano}`}
          >
            <span
              className={
                "h-2.5 w-2.5 rounded-full " +
                (plano === "Especial FESP"
                  ? "bg-blue-500"
                  : plano === "Executivo"
                  ? "bg-green-500"
                  : plano === "Sênior"
                  ? "bg-orange-500"
                  : plano === "Pleno"
                  ? "bg-red-500"
                  : "bg-pink-500")
              }
            />
            <span>{plano}</span>
            <span className="font-semibold">{count}</span>
            <span className="text-gray-400">({pct}%)</span>
          </button>
        ))}

      {/* Botão limpar filtro */}
      {(planoAtivo || filtroFesp || filtroCampinas || buscaNome.trim()) && (
        <button
          type="button"
          onClick={() => {
            setPlanoAtivo(null);
            setFiltroFesp(false);
            setFiltroCampinas(false);
            setBuscaNome("");
          }}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          title="Limpar todos os filtros"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpar
        </button>
      )}
    </div>
  );
}
