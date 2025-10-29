// write a function to convert number from number to string with k, m, b, t suffix

/**
 * Converts a number to a string with appropriate suffixes (k, m, b, t).
 * For example, 1500 becomes "1.5k", 2000000 becomes "2m".
 *
 * @param num - The number to convert.
 * @param toFixed - The number of decimal places to include (default is 1).
 * @param isUpperCase - Whether to use uppercase suffixes (default is false).
 * @returns The converted string.
 */
export function makeShorthandNumber(
  num: number,
  toFixed: number = 1,
  isUpperCase: boolean = false
): string {
  const suffixes = isUpperCase
    ? ["K", "M", "B", "T", "P", "E", "Z", "Y"]
    : ["k", "m", "b", "t", "p", "e", "z", "y"];
  if (num >= 1000000000000000000000000) {
    return (num / 1000000000000000000000000).toFixed(toFixed) + suffixes[3]; // y
  } else if (num >= 1000000000000000000000) {
    return (num / 1000000000000000000000).toFixed(toFixed) + suffixes[4]; // z
  } else if (num >= 1000000000000000000) {
    return (num / 1000000000000000000).toFixed(toFixed) + suffixes[5]; // e
  } else if (num >= 1000000000000000) {
    return (num / 1000000000000000).toFixed(toFixed) + suffixes[6]; // p
  } else if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(toFixed) + suffixes[7]; // t
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(toFixed) + suffixes[8]; // b
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(toFixed) + suffixes[1]; // m
  } else if (num >= 1000) {
    return (num / 1000).toFixed(toFixed) + suffixes[0]; // k
  } else {
    return num.toString().toLowerCase().trim();
  }
}
