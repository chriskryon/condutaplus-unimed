
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT DISTINCT uf, cidade
      FROM unidades
      ORDER BY uf, cidade
    `;
    const result = await pool.query(query);

    const ufsAndMunicipios: Record<string, string[]> = {};
    result.rows.forEach((row: { uf: string; cidade: string }) => {
      if (!ufsAndMunicipios[row.uf]) {
        ufsAndMunicipios[row.uf] = [];
      }
      ufsAndMunicipios[row.uf].push(row.cidade);
    });

    return NextResponse.json(ufsAndMunicipios);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
