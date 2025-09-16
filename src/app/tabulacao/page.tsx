"use client"
import Navbar from "../components/Navbar";
import Filtros from "../components/Filtros";
import { useMemo, useState } from "react";
import { useTabulacao } from "./context/TabulacaoContext";
import { TabulacaoProvider } from "./context/TabulacaoContext";
import CampoBuscaNome from "./components/CampoBuscaNome";
import FiltrosPlanos from "./components/FiltrosPlanos";
import TabelaUnidades from "./components/TabelaUnidades";
import ModalUnidade from "./components/ModalUnidade";
import { atendePlano } from "./utils/tabulacao";
import { useBusca } from "../context/BuscaContext";
import { Unidade } from "../types";


const PLANOS = ["Sênior", "Executivo", "Pleno", "Especial FESP"];

function TabulacaoContent() {
  const { uf, cidade, dados, buscar, loading } = useBusca();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Unidade | null>(null);
  const [planoAtivo, setPlanoAtivo] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [filtroFesp, setFiltroFesp] = useState(false);
  const [filtroCampinas, setFiltroCampinas] = useState(false);
  const [ordenacao, setOrdenacao] = useState<string | null>(null);
  const { buscaNome } = useTabulacao();

  const resumo = useMemo(() => {
    const total = dados.length || 0;
    return PLANOS.map((plano) => {
      const count = dados.filter((d: Unidade) => atendePlano(d.planos, plano)).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return { plano, count, pct };
    });
  }, [dados]);

  const dadosVisiveis = useMemo(() => {
    let filtered = dados;
    // Filtros de plano
    if (filtroFesp) {
      filtered = filtered.filter((d: Unidade) => 
        atendePlano(d.planos, "Especial FESP") || atendePlano(d.planos, "Sênior")
      );
    } else if (filtroCampinas) {
      filtered = filtered.filter((d: Unidade) => 
        atendePlano(d.planos, "Executivo") || atendePlano(d.planos, "Pleno")
      );
    } else if (planoAtivo) {
      filtered = filtered.filter((d: Unidade) => atendePlano(d.planos, planoAtivo));
    }
    // Filtro por nome (usando contexto)
    if (buscaNome && buscaNome.trim()) {
      const termo = buscaNome.toLowerCase().trim();
      filtered = filtered.filter((d: Unidade) => 
        d.nomeFantasia.toLowerCase().includes(termo)
      );
    }
    return filtered;
  }, [dados, planoAtivo, filtroFesp, filtroCampinas, buscaNome]);

  function atendePlano(planosUnidade: string[] | undefined, planoVerificar: string): boolean {
    if (!planosUnidade) return false;
    if (planosUnidade.includes(planoVerificar)) return true;
    switch (planoVerificar) {
      case "Especial FESP":
        return false;
      case "Pleno":
        return false;
      case "Executivo":
        return planosUnidade.includes("Pleno");
      case "Sênior":
        return planosUnidade.includes("Especial FESP");
      default:
        return false;
    }
  }

  // Função para acionar busca ao usar o filtro
  async function handleBuscar(uf: string, cidade: string, tipo?: string) {
    await buscar(uf, cidade, tipo);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white/80 to-white/70">
      <Navbar />
      <div className="container mx-auto px-2 py-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 px-2 sm:px-6 md:px-10 py-8 w-full max-w-4xl mx-auto">
          <Filtros onBuscar={handleBuscar} />
          {/* Badges de UF e Cidade selecionados */}
          <div className="flex flex-wrap gap-2 mb-4">
            {uf && <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">UF: <span className="font-bold">{uf}</span></span>}
            {cidade && <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">Cidade: <span className="font-bold">{cidade}</span></span>}
          </div>
          {/* Badge de unidades encontradas */}
          <div className="flex justify-center mb-4">
            <span className="inline-block bg-blue-50 text-blue-800 rounded-full px-3 py-1 font-semibold shadow-sm text-sm">
              {dadosVisiveis.length} unidade{dadosVisiveis.length !== 1 ? 's' : ''} encontrada{dadosVisiveis.length !== 1 ? 's' : ''}
            </span>
          </div>
          {/* Campo de busca */}
          <CampoBuscaNome />
          {/* Filtros de planos */}
          <FiltrosPlanos resumo={resumo} />
          {/* Tabela de unidades */}
          <TabelaUnidades
            dadosOrdenados={dadosVisiveis}
            planoAtivo={planoAtivo}
            atendePlano={atendePlano}
            setModalOpen={setModalOpen}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <ModalUnidade
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedItem={selectedItem}
          atendePlano={atendePlano}
        />
      </div>
    </div>
  );
}

export default function Tabulacao() {
  return (
    <TabulacaoProvider>
      <TabulacaoContent />
    </TabulacaoProvider>
  );
}