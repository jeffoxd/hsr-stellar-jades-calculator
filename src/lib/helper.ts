/**
 * Turns string to title case (eg: I Am A Good Boy), capitilise first letter of each word
 * @param text string of text to title case
 * @returns text that is title cased
 */
export function titleCaseText(text: string): string {
  return text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
