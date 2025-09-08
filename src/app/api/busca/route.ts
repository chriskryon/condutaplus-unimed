import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uf = searchParams.get('uf');
  const cidade = searchParams.get('cidade');
  const tipo = searchParams.get('tipo');

  console.log('API /busca chamada com:', { uf, cidade, tipo });

  if (!uf || !cidade) {
    console.log('Erro: UF ou cidade não fornecidos');
    return NextResponse.json({ error: 'UF e cidade são obrigatórios' }, { status: 400 });
  }

  try {
    let query = `
      SELECT * FROM estabelecimentos
      WHERE estado = $1 AND cidade = $2
    `;
    const params = [uf, cidade];

    if (tipo) {
      query += ` AND tipo = $3`;
      params.push(tipo);
    }

    query += ` ORDER BY nome_fantasia`;

    console.log('Executando query:', query, 'com params:', params);
    const result = await pool.query(query, params);
    console.log('Resultado da query:', result.rows.length, 'registros encontrados');
    console.log('Primeiro registro sample:', result.rows[0]);

    // Transforma os dados do banco para o tipo Unidade
    const unidades = result.rows.map(row => ({
      nomeFantasia: row.nome_fantasia,
      endereco: {
        endereco: 'Endereço não informado',
        numeroEndereco: 'S/N',
        complementoEndereco: null,
        bairro: 'Bairro não informado',
        municipio: row.cidade,
        sigUf: row.estado,
        cep: '00000-000'
      },
      planos: row.rede ? [row.rede] : [],
      servicosPrestados: row.servicos ? row.servicos.split(',').map((s: string) => s.trim()) : undefined
    }));

    // Agrupa unidades pelo nomeFantasia, juntando todos os planos/redes
    // Isso garante que cada local apareça em uma única linha, mesmo que atenda várias redes
    const unidadesAgrupadas: Record<string, typeof unidades[0]> = {};
    for (const unidade of unidades) {
      const key = unidade.nomeFantasia; // Chave de agrupamento (pode incluir endereço/cidade se necessário)
      if (!unidadesAgrupadas[key]) {
        // Se ainda não existe, adiciona a unidade
        unidadesAgrupadas[key] = { ...unidade, planos: [...(unidade.planos || [])] };
      } else {
        // Se já existe, junta os planos sem duplicar
        const planosExistentes = new Set(unidadesAgrupadas[key].planos);
        for (const plano of unidade.planos || []) {
          planosExistentes.add(plano);
        }
        unidadesAgrupadas[key].planos = Array.from(planosExistentes);
      }
    }

    // Exemplo de log para debug
    console.log('Dados agrupados sample:', Object.values(unidadesAgrupadas)[0]);
    // Retorna as unidades agrupadas para o frontend
    return NextResponse.json(Object.values(unidadesAgrupadas));
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
