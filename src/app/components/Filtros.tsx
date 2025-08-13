import React, { useState } from 'react';
import { ufsAndMunicipios } from '../data/ufs-municipios';
import { cities } from '../data/cities-uf';


type FiltrosProps = {
  onBuscar: (uf: string, cidade: string) => void;
};

// ...existing code...
const Filtros = ({ onBuscar }: FiltrosProps) => {
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');

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

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white/95 rounded-3xl shadow-2xl border border-gray-100 px-10 py-8 flex flex-col items-center w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-6 w-full items-end justify-center">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">UF</label>
            <select
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={selectedUf}
              onChange={e => handleUfChange(e.target.value)}
            >
              <option value="">Selecione</option>
              {ufs.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold mb-2 text-gray-600 tracking-wide uppercase">Cidade</label>
            <select
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
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
          <button
            className="h-12 px-8 rounded-xl bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-50 mt-6 sm:mt-0"
            onClick={handleBuscar}
            disabled={!selectedUf || !selectedCidade}
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filtros;
