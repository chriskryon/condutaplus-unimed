"use client"
import Navbar from "./components/Navbar";
import Filtros from "./components/Filtros";
import CardsList from "./components/CardsList";
import Modal from "./components/Modal";
import { useMemo, useState } from "react";
import { useBusca } from "./context/BuscaContext";
import { Unidade } from "./types";

const PLANOS = ["Nacional", "Clássico", "Especial 100", "Executivo"];

export default function Home() {
  const { uf, cidade, dados, buscar, loading } = useBusca() as any;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Unidade | null>(null);
  const [planoAtivo, setPlanoAtivo] = useState<string | null>(null);

  const resumo = useMemo(() => {
    const total = dados.length || 0;
    return PLANOS.map((plano) => {
      const count = dados.filter((d: Unidade) => d.planos?.includes(plano)).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return { plano, count, pct };
    });
  }, [dados]);

  const dadosVisiveis = useMemo(() => {
    if (!planoAtivo) return dados;
    return dados.filter((d: Unidade) => d.planos?.includes(planoAtivo));
  }, [dados, planoAtivo]);

  async function handleBuscar(uf: string, cidade: string) { await buscar(uf, cidade); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white/80 to-white/70">
      <Navbar />
      <div className="container mx-auto px-2 py-4">
  <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 px-2 sm:px-6 md:px-10 py-8 w-full max-w-4xl mx-auto">
  <Filtros onBuscar={handleBuscar} />
        {uf && cidade && (
          <div className="text-sm text-gray-600 mt-2 mb-2 text-center">
            {dados.length > 0 ? (
              <span className="inline-block bg-blue-50 text-blue-800 rounded-full px-3 py-1 font-semibold shadow-sm">
                {dadosVisiveis.length} unidade{dadosVisiveis.length > 1 ? 's' : ''} {planoAtivo ? `com ${planoAtivo}` : 'encontrada'}{dadosVisiveis.length > 1 ? 's' : ''}
                {planoAtivo ? ` de ${dados.length}` : ''}
              </span>
            ) : null}
          </div>
        )}
        {!loading && uf && cidade && dados.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {resumo.map(({ plano, count, pct }) => (
              <button
                key={plano}
                type="button"
                onClick={() => setPlanoAtivo(prev => (prev === plano ? null : plano))}
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                  planoAtivo === plano
                    ? 'bg-[#313a85]/10 border-[#313a85]/30 text-[#1f2466]'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                title={`Filtrar por ${plano}`}
              >
                <span className={
                  'h-2.5 w-2.5 rounded-full ' +
                  (plano === 'Nacional' ? 'bg-yellow-500' :
                   plano === 'Clássico' ? 'bg-blue-500' :
                   plano === 'Especial 100' ? 'bg-purple-500' :
                   'bg-green-500')
                } />
                <span>{plano}</span>
                <span className="font-semibold">{count}</span>
                <span className="text-gray-400">({pct}%)</span>
              </button>
            ))}
            {planoAtivo && (
              <button
                type="button"
                onClick={() => setPlanoAtivo(null)}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                title="Limpar filtro"
              >
                Limpar
              </button>
            )}
          </div>
        )}
  {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500">
            <svg className="animate-spin h-5 w-5 text-[#313a85] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Carregando...
          </div>
        ) : (
          <CardsList dados={dadosVisiveis} onCardClick={(item: Unidade) => { setSelectedItem(item); setModalOpen(true); }} />
        )}
        {uf && cidade && dados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-200 mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-7.5 2.25a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5 3.75v.008h.008V15.75H12z" /></svg>
            <div className="text-lg text-blue-900 font-semibold mb-2">Nenhuma unidade encontrada</div>
            <div className="text-gray-500">Tente alterar o filtro de UF ou cidade.</div>
          </div>
        )}
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {['Nacional','Clássico','Especial 100','Executivo']
                .filter((p) => selectedItem.planos?.includes(p))
                .map((plano: string) => (
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
                <div className="text-sm text-gray-800/90 leading-snug mb-2">{selectedItem.endereco.endereco}, {selectedItem.endereco.numeroEndereco} {selectedItem.endereco.complementoEndereco ? '- ' + selectedItem.endereco.complementoEndereco : ''}, {selectedItem.endereco.bairro}, {selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}, CEP: {selectedItem.endereco.cep}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Telefones</div>
                <div className="mb-2">{selectedItem.telefones?.map((t) => t.telefone).join(', ') || '-'}</div>
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
                <div className="mb-2">{selectedItem.especialidadesAtendidas?.map((e) => e.codigo).join(', ') || '-'}</div>
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
