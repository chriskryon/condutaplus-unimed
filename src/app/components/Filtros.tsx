import React, { useState } from 'react';
import { ufsAndMunicipios } from '../data/ufs-municipios';
import { useBusca } from '../context/BuscaContext';

type FiltrosProps = {
  onBuscar: (uf: string, cidade: string, tipo?: string) => void;
};

const Filtros = ({ onBuscar }: FiltrosProps) => {
  const { uf, cidade, tipo, loading } = useBusca();
  const [selectedUf, setSelectedUf] = useState(uf || '');
  const [selectedCidade, setSelectedCidade] = useState(cidade || '');
  const [selectedTipo, setSelectedTipo] = useState(tipo || '');

  // keep local selects in sync when navigating between pages
  React.useEffect(() => {
    setSelectedUf(uf || '');
  }, [uf]);
  React.useEffect(() => {
    setSelectedCidade(cidade || '');
  }, [cidade]);
  React.useEffect(() => {
    setSelectedTipo(tipo || '');
  }, [tipo]);

  const ufs = Object.keys(ufsAndMunicipios);
  const cidades = selectedUf ? ufsAndMunicipios[selectedUf] : [];

  function handleUfChange(uf: string) {
    setSelectedUf(uf);
    setSelectedCidade('');
  }

  function handleCidadeChange(cidade: string) {
    setSelectedCidade(cidade);
  }

  function handleBuscar() {
    if (selectedUf && selectedCidade) {
      onBuscar(selectedUf, selectedCidade, selectedTipo || undefined);
    }
  }

  function handleLimpar() {
    setSelectedUf('');
    setSelectedCidade('');
    setSelectedTipo('');
    onBuscar('', '', undefined);
  }

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white/90 rounded-3xl border border-gray-100 backdrop-blur-lg shadow-xl px-2 sm:px-8 md:px-12 py-6 w-full max-w-2xl flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full items-end">
          <div className="sm:col-span-1 min-w-0">
            <label htmlFor="filtros-uf" className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">UF</label>
            <select
              id="filtros-uf"
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={selectedUf}
              onChange={e => handleUfChange(e.target.value)}
            >
              <option value="">Selecione</option>
              {ufs.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1 min-w-0">
            <label htmlFor="filtros-cidade" className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">Cidade</label>
            <div className="relative w-full max-w-[320px]">
              <select
                id="filtros-cidade"
                className="w-full box-border appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition truncate pr-8"
                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                value={selectedCidade}
                onChange={e => handleCidadeChange(e.target.value)}
                disabled={!selectedUf}
              >
                <option value="">Selecione</option>
                {cidades.map(c => (
                  <option key={c} value={c}>{c.length > 40 ? c.slice(0, 37) + '...' : c}</option>
                ))}
              </select>
              {/* Ícone de seta custom para evitar corte */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
          <div className="sm:col-span-1 min-w-0">
            <label htmlFor="filtros-tipo" className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">Tipo</label>
            <select
              id="filtros-tipo"
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={selectedTipo}
              onChange={e => setSelectedTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Clínica">Clínica</option>
              <option value="Hospital">Hospital</option>
              <option value="Laboratório">Laboratório</option>
            </select>
          </div>
          <div className="sm:col-span-1 flex gap-2 w-full">
            <button
              onClick={handleBuscar}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white text-sm font-semibold shadow hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
              disabled={!selectedUf || !selectedCidade || loading}
            >
              <span className="flex items-center justify-center w-4 h-4">
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
              </span>
              <span>Buscar</span>
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition flex items-center justify-center"
              title="Limpar"
              aria-label="Limpar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {(selectedUf || selectedCidade || selectedTipo) && (
          <div className="mt-4 text-xs text-gray-600 flex flex-wrap gap-2 justify-center">
            {selectedUf ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">UF: <strong>{selectedUf}</strong></span> : null}
            {selectedCidade ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">Cidade: <strong className="truncate max-w-[120px] sm:max-w-none">{selectedCidade}</strong></span> : null}
            {selectedTipo ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">Tipo: <strong>{selectedTipo}</strong></span> : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Filtros;
