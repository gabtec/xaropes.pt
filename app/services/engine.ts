import type { SyrupResult } from '../routes/home.tsx';

export function calculateDosage(
  factor: number,
  drugConcentration: number,
  weight: number
): SyrupResult {
  const mg = factor * weight;
  const ml = mg / drugConcentration;

  return {
    mg,
    ml,
  };
}
