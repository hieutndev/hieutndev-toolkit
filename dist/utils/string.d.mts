/**
 * Masks an email address by partially hiding the local part and the domain name.
 *
 * @param email - The email address to be masked.
 * @param localChars - The number of characters to keep visible at the start of the local part (before the '@').
 * @param domainChars - The number of characters to keep visible at the start of the domain name (before the first dot).
 * @returns The masked email address with the specified number of visible characters in the local part and domain name.
 * @throws {Error} If the input string is not a valid email (missing '@').
 *
 * @example
 * ```typescript
 * emailMasking('john.doe@example.com', 2, 3); // Returns 'jo******@exa****.com'
 * ```
 */
declare function emailMasking(email: string, localChars: number, domainChars: number): string;
/**
 * Generates a unique random alphanumeric string of the specified length.
 *
 * @param size - The length of the generated string. Defaults to 32.
 * @returns A randomly generated alphanumeric string of the given size.
 */
declare function generateUniqueStringClient(size?: number): string;
/**
 * Generates a unique random hexadecimal string of the specified byte size using Node.js crypto.
 *
 * @param size - The number of bytes to generate. Defaults to 32.
 * @returns A randomly generated hexadecimal string of length `size * 2`.
 */
declare function generateUniqueStringServer(size?: number): string;
/**
 * Slices the input text to a specified number of characters and appends an ellipsis ("...") if the text exceeds that length.
 *
 * @param text - The input string to be sliced.
 * @param numsSlice - The maximum number of characters to retain before adding an ellipsis. Defaults to 4.
 * @returns The sliced string, possibly with an appended ellipsis if the original text was longer than `numsSlice`.
 */
declare const sliceText: (text: string, numsSlice?: number) => string;
/**
 * Generates a URL-friendly slug from a given text string.
 * Handles Vietnamese diacritics properly by converting them to their base characters.
 *
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug with lowercase letters, numbers, and hyphens only
 */
declare function generateSlug(text: string): string;
/**
 * Validates if a given string is a valid URL-friendly slug.
 * A valid slug contains only lowercase letters, numbers, and hyphens,
 * and does not start or end with a hyphen.
 *
 * @param slug - The slug string to validate
 * @returns True if the slug is valid, false otherwise
 */
declare function isValidSlug(slug: string): boolean;

export { emailMasking, generateSlug, generateUniqueStringClient, generateUniqueStringServer, isValidSlug, sliceText };
