import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TabulacaoContextType {
  buscaNome: string;
  setBuscaNome: (v: string) => void;
  planoAtivo: string | null;
  setPlanoAtivo: (v: string | null) => void;
  filtroFesp: boolean;
  setFiltroFesp: (v: boolean) => void;
  filtroCampinas: boolean;
  setFiltroCampinas: (v: boolean) => void;
  compact: boolean;
  setCompact: (v: boolean) => void;
  ordenacao: string | null;
  setOrdenacao: (v: string | null) => void;
}

const TabulacaoContext = createContext<TabulacaoContextType | undefined>(undefined);

export const TabulacaoProvider = ({ children }: { children: ReactNode }) => {
  const [buscaNome, setBuscaNome] = useState("");
  const [planoAtivo, setPlanoAtivo] = useState<string | null>(null);
  const [filtroFesp, setFiltroFesp] = useState(false);
  const [filtroCampinas, setFiltroCampinas] = useState(false);
  const [compact, setCompact] = useState(false);
  const [ordenacao, setOrdenacao] = useState<string | null>(null);

  // Restaurar filtros do localStorage ao carregar
  useEffect(() => {
    const saved = localStorage.getItem("tabulacaoFiltros");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.buscaNome !== undefined) setBuscaNome(obj.buscaNome);
        if (obj.planoAtivo !== undefined) setPlanoAtivo(obj.planoAtivo);
        if (obj.filtroFesp !== undefined) setFiltroFesp(obj.filtroFesp);
        if (obj.filtroCampinas !== undefined) setFiltroCampinas(obj.filtroCampinas);
        if (obj.compact !== undefined) setCompact(obj.compact);
        if (obj.ordenacao !== undefined) setOrdenacao(obj.ordenacao);
      } catch {}
    }
  }, []);

  // Salvar filtros no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem("tabulacaoFiltros", JSON.stringify({
      buscaNome,
      planoAtivo,
      filtroFesp,
      filtroCampinas,
      compact,
      ordenacao
    }));
  }, [buscaNome, planoAtivo, filtroFesp, filtroCampinas, compact, ordenacao]);

  return (
    <TabulacaoContext.Provider value={{ buscaNome, setBuscaNome, planoAtivo, setPlanoAtivo, filtroFesp, setFiltroFesp, filtroCampinas, setFiltroCampinas, compact, setCompact, ordenacao, setOrdenacao }}>
      {children}
    </TabulacaoContext.Provider>
  );
};

export const useTabulacao = () => {
  const ctx = useContext(TabulacaoContext);
  if (!ctx) throw new Error("useTabulacao deve ser usado dentro do TabulacaoProvider");
  return ctx;
};
