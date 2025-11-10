// File: src/app/utils/format.utils.ts
import { SeriesCode } from '../models/catalog.models';

export function seriesColor(series: SeriesCode): string {
  switch (series) {
    case 'VX': return 'var(--vds-teal)';
    case 'CX': return 'var(--vds-amber)';
    case 'BX': return 'var(--vds-gold)';
    case 'EX': return 'var(--vds-silver)';
    case 'MX': return 'var(--vds-red)';
    case 'HX': return '#89ffa6';
    default: return 'var(--vds-silver)';
  }
}

export function matchesFilter(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}
