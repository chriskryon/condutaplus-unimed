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
    if (uf && cidade && cities[uf]?.[cidade]) {
      const file = cities[uf][cidade];
      const res = await fetch(`/data/${file}`);
      if (res.ok) {
        const json = await res.json();
        setDados(json);
      } else {
        setDados([]);
      }
    } else {
      setDados([]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white/80 to-white/70">
      <Navbar />
      <div className="container mx-auto px-2 py-4">
        <Filtros onBuscar={handleBuscar} />
        <CardsList dados={dados} onCardClick={item => { setSelectedItem(item); setModalOpen(true); }} />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
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
