/**
 * Converts a number to a string with appropriate suffixes (k, m, b, t).
 * For example, 1500 becomes "1.5k", 2000000 becomes "2m".
 *
 * @param num - The number to convert.
 * @param toFixed - The number of decimal places to include (default is 1).
 * @param isUpperCase - Whether to use uppercase suffixes (default is false).
 * @returns The converted string.
 */
declare function makeShorthandNumber(num: number, toFixed?: number, isUpperCase?: boolean): string;

export { makeShorthandNumber };
