"use client"
import Navbar from "./components/Navbar";
import Filtros from "./components/Filtros";
import CardsList from "./components/CardsList";
import Modal from "./components/Modal";
import { useState } from "react";
import { cities } from "./data/cities-uf";

export default function Home() {
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [dados, setDados] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
      // Unifica por codigoPrestadorLocal, agrupando planos
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
        {uf && cidade && (
          <div className="text-sm text-gray-600 mt-2 mb-4 text-center">
            {dados.length > 0 ? (
              <span className="inline-block bg-blue-50 text-blue-800 rounded-full px-3 py-1 font-semibold shadow-sm">{dados.length} unidade{dados.length > 1 ? 's' : ''} encontrada{dados.length > 1 ? 's' : ''}</span>
            ) : null}
          </div>
        )}
        <CardsList dados={dados} onCardClick={item => { setSelectedItem(item); setModalOpen(true); }} />
        {uf && cidade && dados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-200 mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-7.5 2.25a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5 3.75v.008h.008V15.75H12z" /></svg>
            <div className="text-lg text-blue-900 font-semibold mb-2">Nenhuma unidade encontrada</div>
            <div className="text-gray-500">Tente alterar o filtro de UF ou cidade.</div>
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {selectedItem.planos?.map((plano: string) => (
                <span key={plano} className={
                  `inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit shadow-sm ` +
                  (plano === 'Clássico' ? 'bg-blue-100 text-blue-800' :
                  plano === 'Especial 100' ? 'bg-purple-100 text-purple-800' :
                  plano === 'Executivo' ? 'bg-green-100 text-green-800' :
                  plano === 'Nacional' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800')
                }>{plano}</span>
              ))}
            </div>
            <h2 className="font-bold text-2xl text-gray-900 mb-2">{selectedItem.nomeFantasia}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Endereço</div>
                <div className="text-base text-gray-800 mb-2">{selectedItem.endereco.endereco}, {selectedItem.endereco.numeroEndereco} {selectedItem.endereco.complementoEndereco ? '- ' + selectedItem.endereco.complementoEndereco : ''}, {selectedItem.endereco.bairro}, {selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}, CEP: {selectedItem.endereco.cep}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Telefones</div>
                <div className="mb-2">{selectedItem.telefones?.map((t: any) => t.telefone).join(', ') || '-'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">CRM</div>
                <div className="mb-2">{selectedItem.documento?.crm || '-'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Latitude/Longitude</div>
                <div className="mb-2">{selectedItem.posicaoGeografica?.latitude}, {selectedItem.posicaoGeografica?.longitude}</div>
                
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Corpo Clínico</div>
                <div className="mb-2">{selectedItem.corpoClinico ? 'Sim' : 'Não'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Prioridade</div>
                <div className="mb-2">{selectedItem.priorizado ? 'Sim' : 'Não'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Local</div>
                <div className="mb-2">{selectedItem.local ?? '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Especialidades</div>
                <div className="mb-2">{selectedItem.especialidadesAtendidas?.map((e: any) => e.codigo).join(', ') || '-'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Serviços Prestados</div>
                <div className="mb-2">{selectedItem.servicosPrestados?.length ? selectedItem.servicosPrestados.join(', ') : '-'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Cooperativa</div>
                <div className="mb-2">{selectedItem.cooperativa?.nomePessoaDivulg || '-'}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Código Prestador</div>
                <div className="mb-2">{selectedItem.codigoPrestador}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Código Local</div>
                <div className="mb-2">{selectedItem.codigoPrestadorLocal}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Link Google Maps</div>
                <div className="mb-2">
                  <a href={`https://www.google.com/maps?q=${selectedItem.posicaoGeografica?.latitude},${selectedItem.posicaoGeografica?.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Abrir</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
