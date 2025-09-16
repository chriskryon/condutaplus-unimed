import React from "react";
import { Unidade } from "../../types";

export default function ModalUnidade({ open, onClose, selectedItem, atendePlano }: {
  open: boolean;
  onClose: () => void;
  selectedItem: Unidade | null;
  atendePlano: (planosUnidade: string[] | undefined, planoVerificar: string) => boolean;
}) {
  if (!open || !selectedItem) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
              <div className="mb-2">
                {selectedItem.servicosPrestados?.length ? (
                  <ul className="space-y-1">
                    {selectedItem.servicosPrestados.map((serv) => {
                      // Mapeamento de siglas para legendas
                      const legendas: Record<string, string> = {
                        MAT: 'Maternidade',
                        PS: 'Pronto-Socorro',
                        PA: 'Pronto-Atendimento',
                        PED: 'Pediatria',
                        ORT: 'Ortopedia',
                        ONC: 'Oncologia',
                        PSI: 'Psiquiatria',
                        IC: 'Internação Cirúrgica',
                        OBS: 'Obstetrícia',
                        OFT: 'Oftalmologia',
                        OTO: 'Otorrino',
                        GIN: 'Ginecologista',
                      };
                      // Exemplo: IC | PA OBS | MAT
                      const partes = serv.split('/').map(s => s.trim());
                      const legendasExpand = partes.map(sigla => {
                        // PA OBS, PS PED, etc
                        if (sigla === 'PA OBS') return 'Pronto-Atendimento Obstetrícia';
                        if (sigla === 'PS PED') return 'Pronto-Socorro Pediatria';
                        if (sigla === 'PSI') return 'Psiquiatria';
                        if (sigla === 'IC') return 'Internação Cirúrgica';
                        if (sigla === 'MAT') return 'Maternidade';
                        if (sigla === 'PED') return 'Pediatria';
                        if (sigla === 'ORT') return 'Ortopedia';
                        if (sigla === 'ONC') return 'Oncologia';
                        if (sigla === 'OFT') return 'Oftalmologia';
                        if (sigla === 'OTO') return 'Otorrino';
                        if (sigla === 'GIN') return 'Ginecologista';
                        if (sigla === 'PS') return 'Pronto-Socorro';
                        if (sigla === 'PA') return 'Pronto-Atendimento';
                        if (sigla === 'OBS') return 'Obstetrícia';
                        return sigla;
                      });
                      return (
                        <li key={serv}>
                          <span className="font-mono text-xs text-gray-500">{serv}</span>
                          <span className="ml-2 text-gray-800 text-sm">{legendasExpand.join(' | ')}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Cidade/Estado</div>
              <div className="mb-2">{selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}</div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Planos Disponíveis</div>
              <div className="mb-2">{selectedItem.planos?.length ? selectedItem.planos.join(', ') : 'Nenhum plano informado'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
