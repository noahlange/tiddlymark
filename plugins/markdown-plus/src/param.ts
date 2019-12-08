/**
 * Naïve, basic param-case stringifier.
 */
export default function param(str: string): string {
  return str.trim().replace(/\s/g, '-');
}
