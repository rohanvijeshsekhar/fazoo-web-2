/**
 * Helper utilities for row transformations.
 * Converts SQLite integer booleans (0/1) to JS booleans (true/false)
 * and parses JSON text fields.
 */

/**
 * Convert a row's boolean integer fields to actual booleans.
 * @param {Object} row - Database row
 * @param {string[]} boolFields - Field names to convert
 * @returns {Object} Transformed row
 */
function convertBooleans(row, boolFields = ['active', 'contacted']) {
  if (!row) return row;
  const result = { ...row };
  for (const field of boolFields) {
    if (field in result) {
      result[field] = result[field] === 1 || result[field] === true;
    }
  }
  return result;
}

/**
 * Parse JSON text fields in a row.
 * @param {Object} row - Database row
 * @param {string[]} jsonFields - Field names to parse
 * @returns {Object} Transformed row
 */
function parseJsonFields(row, jsonFields = []) {
  if (!row) return row;
  const result = { ...row };
  for (const field of jsonFields) {
    if (field in result && typeof result[field] === 'string') {
      try {
        result[field] = JSON.parse(result[field]);
      } catch {
        // Keep as-is if parse fails
      }
    }
  }
  return result;
}

/**
 * Generate a URL-friendly slug from a string.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get current datetime in ISO format.
 */
function nowISO() {
  return new Date().toISOString();
}

module.exports = { convertBooleans, parseJsonFields, slugify, todayISO, nowISO };
