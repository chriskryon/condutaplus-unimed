"use client"
import Navbar from "../components/Navbar";
import Filtros from "../components/Filtros";
import { useState } from "react";
import { cities } from "../data/cities-uf";

const PLANOS = ["Clássico", "Especial 100", "Executivo", "Nacional"];

export default function Tabulacao() {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [dados, setDados] = useState<any[]>([]);

  async function handleBuscar(uf: string, cidade: string) {
    setUf(uf);
    setCidade(cidade);
    setDados([]);
    if (uf && cidade) {
      const planos = [
        { pasta: "classico", nome: "Clássico" },
        { pasta: "especial100", nome: "Especial 100" },
        { pasta: "executivo", nome: "Executivo" },
        { pasta: "nacional", nome: "Nacional" },
      ];
  const fileName = cities[uf]?.[cidade];
      const fetches = planos.map(async plano => {
        if (!fileName) return [];
        try {
          const res = await fetch(`/data/${plano.pasta}/${fileName}`);
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json)) {
              return json.map(item => ({ ...item, plano: plano.nome }));
            } else {
              return [{ ...json, plano: plano.nome }];
            }
          }
        } catch (e) {}
        return [];
      });
      const results = await Promise.all(fetches);
      const todos = results.flat();
      const mapa = new Map();
      todos.forEach(item => {
        const key = item.codigoPrestadorLocal;
        if (mapa.has(key)) {
          const existente = mapa.get(key);
          if (!existente.planos.includes(item.plano)) {
            existente.planos.push(item.plano);
          }
        } else {
          mapa.set(key, { ...item, planos: [item.plano] });
        }
      });
      setDados(Array.from(mapa.values()));
    } else {
      setDados([]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white/80 to-white/70">
      <Navbar />
      <div className="container mx-auto px-2 py-4">
        <Filtros onBuscar={handleBuscar} />
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600 bg-gray-50">Nome</th>
                {PLANOS.map(plano => (
                  <th key={plano} className="px-4 py-3 text-xs font-bold uppercase text-gray-600 bg-gray-50">
                    <span className={
                      'inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest ' +
                      (plano === 'Clássico' ? 'bg-blue-100 text-blue-800' :
                        plano === 'Especial 100' ? 'bg-purple-100 text-purple-800' :
                        plano === 'Executivo' ? 'bg-green-100 text-green-800' :
                        plano === 'Nacional' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800')
                    }>{plano}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, idx) => (
                <tr key={item.codigoPrestadorLocal || idx} className={
                  `border-t transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`
                }>
                  <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap text-base">{item.nomeFantasia}</td>
                  {PLANOS.map(plano => (
                    <td key={plano} className="px-4 py-3 text-center">
                      {item.planos.includes(plano) ? (
                        <span title="Presente" className="inline-block align-middle text-green-500 text-2xl font-bold">✔️</span>
                      ) : (
                        <span title="Não presente" className="inline-block align-middle text-gray-300 text-2xl font-bold">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {!dados.length && (
                <tr>
                  <td colSpan={1 + PLANOS.length} className="text-center text-gray-400 py-8">Nenhum resultado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
