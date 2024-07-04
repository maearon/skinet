// src/app/shared/helpers/string-helpers.ts

/**
 * Helper function to convert a string to title case.
 * @param str The string to be converted to title case.
 * @returns The input string in title case.
 */
export function titleCase(str: string | null | undefined): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
