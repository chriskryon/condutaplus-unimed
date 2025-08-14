import React, { useState } from 'react';
import { ufsAndMunicipios } from '../data/ufs-municipios';
// import { cities } from '../data/cities-uf';
import { useBusca } from '../context/BuscaContext';


type FiltrosProps = {
  onBuscar: (uf: string, cidade: string) => void;
};

// ...existing code...
const Filtros = ({ onBuscar }: FiltrosProps) => {
  const { uf, cidade, loading } = useBusca() as any;
  const [selectedUf, setSelectedUf] = useState(uf || '');
  const [selectedCidade, setSelectedCidade] = useState(cidade || '');

  // keep local selects in sync when navigating between pages
  React.useEffect(() => {
    setSelectedUf(uf || '');
  }, [uf]);
  React.useEffect(() => {
    setSelectedCidade(cidade || '');
  }, [cidade]);

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
      onBuscar(selectedUf, selectedCidade);
    }
  }

  function handleLimpar() {
    setSelectedUf('');
    setSelectedCidade('');
    onBuscar('', '');
  }

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white/70 rounded-2xl border border-white/40 backdrop-blur-md shadow-lg px-3 sm:px-6 md:px-8 py-5 sm:py-6 flex flex-col items-center w-full max-w-[95%]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full items-end">
          <div className="sm:col-span-1 min-w-0">
            <label className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">UF</label>
            <select
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm sm:text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
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
            <label className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">Cidade</label>
            <select
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm sm:text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={selectedCidade}
              onChange={e => handleCidadeChange(e.target.value)}
              disabled={!selectedUf}
            >
              <option value="">Selecione</option>
              {cidades.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1 flex gap-2 w-full">
            <button
              onClick={handleBuscar}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#313a85] to-[#5aaeaa] text-white text-sm sm:text-base font-semibold shadow hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!selectedUf || !selectedCidade || loading}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              Buscar
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm sm:text-base font-medium transition"
            >
              Limpar
            </button>
          </div>
        </div>
        {(selectedUf || selectedCidade) && (
          <div className="mt-4 text-xs text-gray-600 flex flex-wrap gap-2">
            {selectedUf ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">UF: <strong>{selectedUf}</strong></span> : null}
            {selectedCidade ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">Cidade: <strong className="truncate max-w-[200px] sm:max-w-none">{selectedCidade}</strong></span> : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default Filtros;
