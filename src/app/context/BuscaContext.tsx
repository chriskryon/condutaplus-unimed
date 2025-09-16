"use client";
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useToast } from "./ToastContext";
import { Unidade } from "../types";

type BuscaContextType = {
  uf: string;
  cidade: string;
  tipo: string;
  dados: Unidade[];
  loading: boolean;
  error: string | null;
  buscar: (uf: string, cidade: string, tipo?: string) => Promise<void>;
};

const BuscaContext = createContext<BuscaContextType | undefined>(undefined);

export const BuscaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar sempre como vazio para evitar hydration error
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipo, setTipo] = useState("");

  // Após o mount, sincronizar com localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUf = localStorage.getItem("busca_uf") || "";
      const storedCidade = localStorage.getItem("busca_cidade") || "";
      const storedTipo = localStorage.getItem("busca_tipo") || "";
      setUf(storedUf);
      setCidade(storedCidade);
      setTipo(storedTipo);
      // Se houver filtros válidos, buscar automaticamente
      if (storedUf && storedCidade) {
        // Precisa aguardar o setUf/setCidade/setTipo antes de buscar
        setTimeout(() => {
          buscar(storedUf, storedCidade, storedTipo);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Salvar filtros no localStorage sempre que mudarem
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("busca_uf", uf);
      localStorage.setItem("busca_cidade", cidade);
      localStorage.setItem("busca_tipo", tipo);
    }
  }, [uf, cidade, tipo]);
  const [dados, setDados] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simple in-memory cache with TTL
  const cacheRef = useRef<Map<string, { ts: number; dados: Unidade[] }>>(new Map());
  const TTL_MS = 5 * 60 * 1000; // 5 minutes
  const { addToast } = useToast();

  const buscar = useCallback(async (ufParam: string, cidadeParam: string, tipoParam?: string) => {
    setUf(ufParam);
    setCidade(cidadeParam);
    setTipo(tipoParam || "");
    setLoading(true);
    addToast("Carregando dados...", "info", 1500);
    setError(null);
    setDados([]);

    if (!ufParam || !cidadeParam) {
      setLoading(false);
      return;
    }

    try {
      const key = `${ufParam}|${cidadeParam}|${tipoParam || ""}`;
      const cached = cacheRef.current.get(key);
      if (cached && Date.now() - cached.ts < TTL_MS) {
        setDados(cached.dados);
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams({
        uf: ufParam,
        cidade: cidadeParam,
        ...(tipoParam && { tipo: tipoParam })
      });
      const res = await fetch(`/api/busca?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDados(data);
        cacheRef.current.set(key, { ts: Date.now(), dados: data });
      } else {
        throw new Error(`Erro ao carregar dados: ${res.status}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao buscar dados";
      setError(msg);
      addToast(msg, "error", 4000);
    } finally {
      setLoading(false);
      addToast("Dados carregados", "success", 1500);
    }
  }, [TTL_MS]);

  return (
    <BuscaContext.Provider value={{ uf, cidade, tipo, dados, loading, error, buscar }}>
      {children}
    </BuscaContext.Provider>
  );
};

export function useBusca() {
  const ctx = useContext(BuscaContext);
  if (!ctx) throw new Error("useBusca must be used within a BuscaProvider");
  return ctx;
}
