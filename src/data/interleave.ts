/** Alternate items from two lists (S1 + S2) for a mixed presentation. */
export function interleave<T>(first: T[], second: T[]): T[] {
  const out: T[] = [];
  const max = Math.max(first.length, second.length);
  for (let i = 0; i < max; i++) {
    if (i < first.length) out.push(first[i]);
    if (i < second.length) out.push(second[i]);
  }
  return out;
}
