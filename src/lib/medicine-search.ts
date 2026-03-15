import type { Medicine } from '@/data/medicines';

export interface MedicineSearchResult {
  results: Medicine[];
  suggestions: Medicine[];
}

export function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildHaystack(locale: 'en' | 'zh', m: Medicine): string {
  const parts: string[] = [];
  parts.push(m.name);
  if (m.generic_name) parts.push(m.generic_name);
  if (m.atc_code) parts.push(m.atc_code);
  if (m.aliases?.length) parts.push(...m.aliases);
  parts.push(...m.active_ingredients);
  parts.push(...(locale === 'zh' ? m.contraindications.zh : m.contraindications.en));
  parts.push(...(locale === 'zh' ? m.side_effects.zh : m.side_effects.en));
  return normalizeQuery(parts.join(' '));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const v0 = new Array(b.length + 1).fill(0);
  const v1 = new Array(b.length + 1).fill(0);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v0[b.length];
}

function similarity(a: string, b: string): number {
  const na = normalizeQuery(a);
  const nb = normalizeQuery(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const dist = levenshtein(na, nb);
  const denom = Math.max(na.length, nb.length);
  return denom === 0 ? 0 : 1 - dist / denom;
}

export function searchMedicines(
  query: string,
  medicines: Medicine[],
  locale: 'en' | 'zh',
  options?: { limit?: number; suggestionLimit?: number }
): MedicineSearchResult {
  const q = normalizeQuery(query);
  if (!q) return { results: medicines, suggestions: [] };

  const limit = options?.limit ?? 200;
  const suggestionLimit = options?.suggestionLimit ?? 5;

  const results = medicines.filter((m) => buildHaystack(locale, m).includes(q)).slice(0, limit);
  if (results.length > 0) return { results, suggestions: [] };

  const scored = medicines
    .map((m) => {
      const base = similarity(q, m.name);
      const gen = m.generic_name ? similarity(q, m.generic_name) : 0;
      const alias = m.aliases?.length ? Math.max(...m.aliases.map((a) => similarity(q, a))) : 0;
      const score = Math.max(base, gen, alias);
      return { m, score };
    })
    .filter((x) => x.score >= 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, suggestionLimit)
    .map((x) => x.m);

  return { results: [], suggestions: scored };
}
