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

    // Transform DB data to match Unidade type
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

    console.log('Dados transformados sample:', unidades[0]);

    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
