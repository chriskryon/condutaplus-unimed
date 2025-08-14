"use client";
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { cities } from "../data/cities-uf";
import { Unidade } from "../types";

type BuscaContextType = {
  uf: string;
  cidade: string;
  dados: Unidade[];
  loading: boolean;
  error: string | null;
  buscar: (uf: string, cidade: string) => Promise<void>;
};

const BuscaContext = createContext<BuscaContextType | undefined>(undefined);

export const BuscaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [dados, setDados] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simple in-memory cache with TTL
  const cacheRef = useRef<Map<string, { ts: number; dados: Unidade[] }>>(new Map());
  const TTL_MS = 5 * 60 * 1000; // 5 minutes

  const buscar = useCallback(async (ufParam: string, cidadeParam: string) => {
    setUf(ufParam);
    setCidade(cidadeParam);
    setLoading(true);
    setError(null);
    setDados([]);

    if (!ufParam || !cidadeParam) {
      setLoading(false);
      return;
    }

    try {
      const key = `${ufParam}|${cidadeParam}`;
      const cached = cacheRef.current.get(key);
      if (cached && Date.now() - cached.ts < TTL_MS) {
        setDados(cached.dados);
        setLoading(false);
        return;
      }
      const planos = [
        { pasta: "nacional", nome: "Nacional" },
        { pasta: "classico", nome: "Clássico" },
        { pasta: "especial100", nome: "Especial 100" },
        { pasta: "executivo", nome: "Executivo" },
      ];

      const fileName = cities[ufParam]?.[cidadeParam];
      type PlanoArquivo = { pasta: string; nome: string };
      type JsonRecord = Record<string, unknown>;
      const fetches = planos.map(async (plano: PlanoArquivo) => {
        if (!fileName) return [] as Unidade[];
        try {
          const res = await fetch(`/data/${plano.pasta}/${fileName}`);
          if (res.ok) {
            const json = (await res.json()) as JsonRecord | JsonRecord[];
            if (Array.isArray(json)) {
              return (json as JsonRecord[]).map((item) => ({ ...(item as JsonRecord), plano: plano.nome })) as unknown as Unidade[];
            }
            return [{ ...(json as JsonRecord), plano: plano.nome }] as unknown as Unidade[];
          }
        } catch {}
        return [] as Unidade[];
      });

      const results = await Promise.all(fetches);
  const todos = results.flat() as unknown as (Unidade & { plano: string })[];
  const mapa = new Map<string, Unidade & { plano?: string }>();
  todos.forEach((item) => {
        const key = String(item.codigoPrestadorLocal);
        if (mapa.has(key)) {
          const existente = mapa.get(key);
          if (existente && item.plano && !existente.planos.includes(item.plano)) {
            existente.planos.push(item.plano);
          }
        } else {
          mapa.set(key, { ...item, planos: item.plano ? [item.plano] : [] });
        }
      });
  const arr = Array.from(mapa.values()) as Unidade[];
  setDados(arr);
  cacheRef.current.set(key, { ts: Date.now(), dados: arr });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao buscar dados";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [TTL_MS]);

  return (
    <BuscaContext.Provider value={{ uf, cidade, dados, loading, error, buscar }}>
      {children}
    </BuscaContext.Provider>
  );
};

export function useBusca() {
  const ctx = useContext(BuscaContext);
  if (!ctx) throw new Error("useBusca must be used within a BuscaProvider");
  return ctx;
}
