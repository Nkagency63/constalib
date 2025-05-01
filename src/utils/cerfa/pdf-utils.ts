
/**
 * Utilitaires pour la manipulation de PDF
 */

/**
 * Divise un texte en lignes de longueur maximale spécifiée
 * @param text Texte à diviser
 * @param maxCharsPerLine Nombre maximum de caractères par ligne
 * @returns Tableau de lignes de texte
 */
export function splitTextIntoLines(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
