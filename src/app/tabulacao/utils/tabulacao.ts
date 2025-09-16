export function atendePlano(planosUnidade: string[] | undefined, planoVerificar: string): boolean {
  if (!planosUnidade) return false;
  if (planosUnidade.includes(planoVerificar)) return true;
  switch (planoVerificar) {
    case "Especial FESP":
      return false;
    case "Pleno":
      return false;
    case "Executivo":
      return planosUnidade.includes("Pleno");
    case "Sênior":
      return planosUnidade.includes("Especial FESP");
    default:
      return false;
  }
}
