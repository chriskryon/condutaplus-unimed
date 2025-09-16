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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-md p-4 max-w-xl w-full relative max-h-[80vh] overflow-y-auto text-black"
        onClick={e => e.stopPropagation()}
      >
  <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  <div className="space-y-6">
          <div className="flex gap-1 mb-2 flex-wrap">
            {["Sênior", "Executivo", "Pleno", "Especial FESP"]
              .filter((plano) => atendePlano(selectedItem.planos, plano))
              .map((plano: string) => (
                <span key={plano} className={
                  `inline-block px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest w-fit bg-gray-50 text-gray-700 border border-gray-200`
                }>{plano}</span>
              ))
            }
          </div>
          <h2 className="font-semibold text-lg text-gray-900 mb-2 leading-tight">{selectedItem.nomeFantasia}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium mb-1">Endereço</div>
              <div className="text-sm text-gray-800/90 leading-snug mb-4">{selectedItem.endereco.endereco}, {selectedItem.endereco.numeroEndereco} {selectedItem.endereco.complementoEndereco ? '- ' + selectedItem.endereco.complementoEndereco : ''}, {selectedItem.endereco.bairro}, {selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}, CEP: {selectedItem.endereco.cep}</div>
              
              <div className="text-xs text-gray-500 uppercase font-medium mb-1 mt-4">Serviços Prestados</div>
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
                        OTO: 'Otorrinolaringologia',
                        GIN: 'Ginecologia',
                      };
                      // Exemplo: IC | PA OBS | MAT
                      const partes = serv.split('/').map(s => s.trim());
                      const legendasExpand = partes.map(sigla => {
                        // PA aninhado: PA XXX => Pronto-Atendimento [Especialidade]
                        if (/^PA (.+)$/.test(sigla)) {
                          const sub = sigla.substring(3).trim();
                          if (legendas[sub]) return `Pronto-Atendimento ${legendas[sub]}`;
                          return `Pronto-Atendimento ${sub}`;
                        }
                        // PS aninhado: PS XXX => Pronto-Socorro [Especialidade]
                        if (/^PS (.+)$/.test(sigla)) {
                          const sub = sigla.substring(3).trim();
                          if (legendas[sub]) return `Pronto-Socorro ${legendas[sub]}`;
                          return `Pronto-Socorro ${sub}`;
                        }
                        if (legendas[sigla]) return legendas[sigla];
                        return sigla;
                      });
                      // Só mostra legenda se pelo menos uma parte for diferente do texto original
                      const mostrarLegenda = legendasExpand.some((legenda, idx) => legenda !== partes[idx]);
                      return (
                        <li key={serv}>
                          <span className="font-mono text-xs text-gray-500">{serv}</span>
                          {mostrarLegenda && (
                            <span className="ml-2 text-gray-800 text-sm">{legendasExpand.join(' | ')}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium mb-1">Cidade/Estado</div>
              <div className="mb-4">{selectedItem.endereco.municipio} - {selectedItem.endereco.sigUf}</div>
              <div className="text-xs text-gray-500 uppercase font-medium mb-1 mt-4">Planos Disponíveis</div>
              <div className="mb-2">
                {(() => {
                  const PLANOS = ["Sênior", "Executivo", "Pleno", "Especial FESP"];
                  const planosAtendidos = PLANOS.filter(plano => atendePlano(selectedItem.planos, plano));
                  return planosAtendidos.length ? planosAtendidos.join(', ') : 'Nenhum plano informado';
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
