"use client"
import Navbar from "../components/Navbar";
import Filtros from "../components/Filtros";
import { useState, useMemo } from "react";
import Modal from "../components/Modal";
import { useBusca } from "../context/BuscaContext";
import { Unidade } from "../types";

const PLANOS = ["Sênior", "Executivo", "Pleno", "Especial", "Direto FESP", "Básica"];

export default function Tabulacao() {
  const { uf, cidade, dados, buscar, loading } = useBusca();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Unidade | null>(null);
  const [planoAtivo, setPlanoAtivo] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);

  const resumo = useMemo(() => {
    const total = dados.length || 0;
    return PLANOS.map((plano) => {
      const count = dados.filter((d: Unidade) => atendePlano(d.planos, plano)).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return { plano, count, pct };
    });
  }, [dados]);

  const dadosVisiveis = useMemo(() => {
    if (!planoAtivo) return dados;
    return dados.filter((d: Unidade) => atendePlano(d.planos, planoAtivo));
  }, [dados, planoAtivo]);

  // Função que verifica se uma unidade atende determinado plano
  function atendePlano(planosUnidade: string[] | undefined, planoVerificar: string): boolean {
    if (!planosUnidade) return false;

    // Se a unidade tem o plano específico, atende
    if (planosUnidade.includes(planoVerificar)) return true;
    
    // Tratar ESPECIAL como equivalente a Especial
    if (planoVerificar === "Especial" && planosUnidade.includes("ESPECIAL")) return true;
    if (planoVerificar === "ESPECIAL" && planosUnidade.includes("Especial")) return true;

    // Hierarquia de planos - um local com plano superior pode atender planos inferiores
    switch (planoVerificar) {
      case "Básica":
        // Básica só é atendida por locais que têm Básica
        return false;
        
      case "Direto FESP":
        // Direto FESP só é atendido por locais que têm Direto FESP
        return false;
        
      case "Especial":
      case "ESPECIAL":
        // Especial/ESPECIAL é atendido por locais que têm Especial, ESPECIAL ou Básico
        return planosUnidade.includes("Básica");
        
      case "Executivo":
        // Executivo é atendido por locais que têm Executivo, Especial, ESPECIAL, Direto FESP ou Básico
        return planosUnidade.includes("Especial") || 
               planosUnidade.includes("ESPECIAL") || 
               planosUnidade.includes("Direto FESP") || 
               planosUnidade.includes("Básica");
        
      case "Pleno":
        // Pleno é atendido por locais que têm Pleno, Executivo, Especial, ESPECIAL, Direto FESP ou Básico
        return planosUnidade.includes("Executivo") || 
               planosUnidade.includes("Especial") || 
               planosUnidade.includes("ESPECIAL") || 
               planosUnidade.includes("Direto FESP") || 
               planosUnidade.includes("Básica");
        
      case "Sênior":
        // Sênior é atendido por TODOS os locais
        return true;
        
      default:
        return false;
    }
  }
  async function handleBuscar(uf: string, cidade: string, tipo?: string) { await buscar(uf, cidade, tipo); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white/80 to-white/70">
      <Navbar />
      <div className="container mx-auto px-2 py-4">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 px-2 sm:px-6 md:px-10 py-8 w-full max-w-4xl mx-auto">
          <Filtros onBuscar={handleBuscar} />
          <div className="mt-8">
            {uf && cidade ? (
              <>
                <div className="text-sm text-gray-600 mb-2 text-center">
                  {dados.length > 0 ? (
                    <span className="inline-block bg-blue-50 text-blue-800 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm">
                      {dadosVisiveis.length} unidade{dadosVisiveis.length > 1 ? 's' : ''} {planoAtivo ? `com ${planoAtivo}` : 'encontrada'}{dadosVisiveis.length > 1 ? 's' : ''}
                      {planoAtivo ? ` de ${dados.length}` : ''}
                    </span>
                  ) : null}
                </div>
                {!loading && dados.length > 0 && (
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
                          (plano === 'Especial' ? 'bg-blue-500' :
                           plano === 'Executivo' ? 'bg-green-500' :
                           plano === 'Básica' ? 'bg-yellow-500' :
                           plano === 'Sênior' ? 'bg-orange-500' :
                           plano === 'Pleno' ? 'bg-red-500' :
                           plano === 'ESPECIAL' ? 'bg-blue-500' :
                           'bg-pink-500')
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
                {/* Toggle modo compacto (mobile) */}
                {!loading && dados.length > 0 && (
                  <div className="flex justify-end md:hidden mb-3">
                    <button
                      type="button"
                      onClick={() => setCompact((v) => !v)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 backdrop-blur border border-gray-200 text-gray-700 text-xs font-medium shadow-sm hover:bg-white"
                      title={compact ? 'Mostrar tabela' : 'Modo compacto'}
                    >
                      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h10M4 17h7" />
                      </svg>
                      {compact ? 'Expandir' : 'Compactar'}
                    </button>
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
                <>
                {/* Tabela desktop sempre visível */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full min-w-[720px] bg-white rounded-xl shadow overflow-hidden">
                    <thead className="sticky top-0 z-20">
                      <tr>
                        <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-gray-600 bg-gray-50/90 backdrop-blur sticky left-0 z-30">Nome</th>
                        {PLANOS.map(plano => (
                          <th
                            key={plano}
                            className={`px-3 py-2 text-[11px] font-bold uppercase bg-gray-50/90 backdrop-blur ${planoAtivo ? (planoAtivo === plano ? 'text-gray-900' : 'text-gray-400') : 'text-gray-600'}`}
                          >
                            <span className="inline-flex items-center justify-center tracking-wide" title={plano}>
                              <span className={
                                'h-3 w-3 rounded-full ' +
                                (plano === 'Especial' ? 'bg-blue-500' :
                                  plano === 'Executivo' ? 'bg-green-500' :
                                  plano === 'Básica' ? 'bg-yellow-500' :
                                  plano === 'Sênior' ? 'bg-orange-500' :
                                  plano === 'Pleno' ? 'bg-red-500' :
                                  plano === 'ESPECIAL' ? 'bg-blue-500' :
                                  'bg-pink-500')
                              } />
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dadosVisiveis.map((item: Unidade, idx: number) => (
                        <tr
                          key={idx}
                          onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                          className={`border-t transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}>
                          <td className={`px-3 py-2 font-medium text-gray-900 text-sm truncate max-w-[220px] md:max-w-[360px] sticky left-0 z-10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} title={item.nomeFantasia}>{item.nomeFantasia}</td>
                          {PLANOS.map(plano => (
                            <td key={plano} className={`px-3 py-2 text-center ${planoAtivo ? (planoAtivo === plano ? '' : 'opacity-30') : ''}`}>
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
                      {dados.length === 0 && (
                        <tr>
                          <td colSpan={1 + PLANOS.length} className="py-16">
                            <div className="flex flex-col items-center justify-center">
                              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-200 mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-7.5 2.25a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.5 3.75v.008h.008V15.75H12z" /></svg>
                              <div className="text-lg text-blue-900 font-semibold mb-2">Nenhuma unidade encontrada</div>
                              <div className="text-gray-500">Tente alterar o filtro de UF ou cidade.</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Tabela mobile quando não compacto */}
                {!compact && (
                  <div className="overflow-x-auto md:hidden">
                    <table className="w-full min-w-[720px] bg-white rounded-xl shadow overflow-hidden">
                      <thead className="sticky top-0 z-20">
                        <tr>
                          <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-gray-600 bg-gray-50/90 backdrop-blur sticky left-0 z-30">Nome</th>
                          {PLANOS.map(plano => (
                            <th
                              key={plano}
                              className={`px-3 py-2 text-[11px] font-bold uppercase bg-gray-50/90 backdrop-blur ${planoAtivo ? (planoAtivo === plano ? 'text-gray-900' : 'text-gray-400') : 'text-gray-600'}`}
                            >
                              <span className="inline-flex items-center justify-center tracking-wide" title={plano}>
                                <span className={
                                  'h-3 w-3 rounded-full ' +
                                  (plano === 'Especial' ? 'bg-blue-500' :
                                    plano === 'Executivo' ? 'bg-green-500' :
                                    plano === 'Básica' ? 'bg-yellow-500' :
                                    plano === 'Sênior' ? 'bg-orange-500' :
                                    plano === 'Pleno' ? 'bg-red-500' :
                                    plano === 'ESPECIAL' ? 'bg-blue-500' :
                                    'bg-pink-500')
                                } />
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dadosVisiveis.map((item: Unidade, idx: number) => (
                          <tr
                            key={idx}
                            onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                            className={`border-t transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}>
                            <td className={`px-3 py-2 font-medium text-gray-900 text-sm truncate max-w-[220px] md:max-w-[360px] sticky left-0 z-10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} title={item.nomeFantasia}>{item.nomeFantasia}</td>
                            {PLANOS.map(plano => (
                              <td key={plano} className={`px-3 py-2 text-center ${planoAtivo ? (planoAtivo === plano ? '' : 'opacity-30') : ''}`}>
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
                )}
                {/* Lista compacta mobile */}
                {compact && (
                  <div className="md:hidden space-y-2">
                    {dadosVisiveis.map((item: Unidade, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedItem(item); setModalOpen(true); }}
                        className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm px-3 py-2.5 hover:bg-blue-50 transition"
                      >
                        <div className="font-medium text-gray-900 text-sm mb-1 truncate">{item.nomeFantasia}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {PLANOS.map(plano => (
                            atendePlano(item.planos, plano) ? (
                              <span key={plano} className={
                                `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ` +
                                (plano === 'Especial' ? 'bg-blue-100 text-blue-800' :
                                  plano === 'Executivo' ? 'bg-green-100 text-green-800' :
                                  plano === 'Básica' ? 'bg-yellow-100 text-yellow-800' :
                                  plano === 'Sênior' ? 'bg-orange-100 text-orange-800' :
                                  plano === 'Pleno' ? 'bg-red-100 text-red-800' :
                                  plano === 'ESPECIAL' ? 'bg-blue-100 text-blue-800' :
                                  'bg-pink-100 text-pink-800')
                              }>
                                {plano}
                              </span>
                            ) : null
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-200 mb-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.75v.008h.008V4.75H12zm0 14.5v.008h.008V19.25H12zm7.25-7.25h.008v.008H19.25V12zm-14.5 0h.008v.008H4.75V12zm12.02-5.27a7.5 7.5 0 11-10.54 10.54" /></svg>
                <div className="text-lg text-blue-900 font-semibold mb-2">Filtre por UF e cidade para ver as unidades</div>
                <div className="text-gray-500">Selecione uma UF e uma cidade para exibir a tabulação.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalhes reutilizando o mesmo conteúdo da Home */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {["Sênior","Executivo","Pleno","Especial","Direto FESP","Básica"]
                .filter((p) => atendePlano(selectedItem.planos, p))
                .map((plano: string) => (
                <span key={plano} className={
                  `inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit shadow-sm ` +
                  (plano === 'Especial' ? 'bg-blue-100 text-blue-800' :
                  plano === 'Executivo' ? 'bg-green-100 text-green-800' :
                  plano === 'Básica' ? 'bg-yellow-100 text-yellow-800' :
                  plano === 'Sênior' ? 'bg-orange-100 text-orange-800' :
                  plano === 'Pleno' ? 'bg-red-100 text-red-800' :
                  plano === 'ESPECIAL' ? 'bg-blue-100 text-blue-800' :
                  'bg-pink-100 text-pink-800')
                }>{plano}</span>
              ))}
            </div>
            <h2 className="font-bold text-2xl text-gray-900 mb-2">{selectedItem.nomeFantasia}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Endereço</div>
                <div className="text-sm text-gray-800/90 leading-snug mb-2">{selectedItem.endereco.endereco}, {selectedItem.endereco.numeroEndereco} {selectedItem.endereco.complementoEndereco ? '- ' + selectedItem.endereco.complementoEndereco : ''}, {selectedItem.endereco.bairro}, {selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}, CEP: {selectedItem.endereco.cep}</div>
                
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Serviços Prestados</div>
                <div className="mb-2">{selectedItem.servicosPrestados?.length ? selectedItem.servicosPrestados.join(', ') : '-'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Cidade/Estado</div>
                <div className="mb-2">{selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}</div>
                
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Planos Disponíveis</div>
                <div className="mb-2">{selectedItem.planos?.length ? selectedItem.planos.join(', ') : 'Nenhum plano informado'}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
  );
}
