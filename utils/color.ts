
/**
 * Generates an HSLA color value that cycles through the color spectrum.
 * @param index - The index of the current item.
 * @param total - The total number of items.
 * @returns An HSLA color string.
 */
export const generateHslaColor = (index: number, total: number): string => {
  const hue = (index / total) * 360;
  return `hsla(${hue}, 70%, 50%, 1)`;
};

/**
 * Determines whether black or white text should be used for a given HSL background color.
 * This is a simplified luminance calculation.
 * @param hslColor - The HSLA color string of the background.
 * @returns 'text-white' or 'text-gray-800'.
 */
export const getTextColorForBackground = (hslColor: string): string => {
  const match = /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/.exec(hslColor);
  if (!match) return 'text-white';

  const l = parseInt(match[3], 10);
  // The threshold for luminance to switch from white to black text. 50% is a good general value.
  return l > 50 ? 'text-gray-800' : 'text-white';
};
