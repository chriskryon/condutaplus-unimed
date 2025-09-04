// Shared domain types used across pages/components

export type Telefone = { telefone: string };

export type Endereco = {
  endereco: string;
  numeroEndereco: string | number;
  complementoEndereco?: string | null;
  bairro: string;
  municipio: string;
  sigUf: string;
  cep: string;
};

export type PosicaoGeografica = {
  latitude: number;
  longitude: number;
};

export type Documento = { crm?: string };

export type Cooperativa = { nomePessoaDivulg?: string };

export type Especialidade = { codigo: string };

export type Unidade = {
  codigoPrestadorLocal: string | number;
  codigoPrestador?: string | number;
  nomeFantasia: string;
  endereco: Endereco;
  telefones?: Telefone[];
  posicaoGeografica?: PosicaoGeografica;
  documento?: Documento;
  corpoClinico?: boolean;
  priorizado?: boolean;
  local?: string | null;
  especialidadesAtendidas?: Especialidade[];
  servicosPrestados?: string[];
  cooperativa?: Cooperativa;
  planos?: string[];
};
