// Small, shared normalizers used across the catalog UI

/**
 * Normalize any string to a kebab-case id.
 * Examples:
 *  "Smart Watch" -> "smart-watch"
 *  "  Denim  Jacket! " -> "denim-jacket"
 */
export const norm = (s) => String(s || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

/**
 * Convenience alias for category ids (same logic as norm).
 */
export const normCategory = norm;
