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
export function emailMasking(email: string, localChars: number, domainChars: number): string {
    if (!email.includes('@')) {
        return 'Invalid email';
    }

    const [localPart, ...domainParts] = email.split('@', 2);
    const domain = domainParts.join('@');

    let maskedLocal: string;
    if (localPart.length <= localChars) {
        maskedLocal = '*'.repeat(localPart.length);
    } else {
        maskedLocal = localPart.substring(0, localChars) + '*'.repeat(localPart.length - localChars);
    }

    const domainSplit = domain.split('.');
    const domainName = domainSplit[0];
    let maskedDomain: string;
    if (domainName.length > domainChars) {
        maskedDomain = domainName.substring(0, domainChars) + '*'.repeat(domainName.length - domainChars);
    } else {
        maskedDomain = domainName;
    }
    // Reconstruct domain
    const maskedFullDomain = [maskedDomain, ...domainSplit.slice(1)].join('.');

    return maskedLocal + '@' + maskedFullDomain;
}

/**
 * Generates a unique random alphanumeric string of the specified length.
 *
 * @param size - The length of the generated string. Defaults to 32.
 * @returns A randomly generated alphanumeric string of the given size.
 */
export function generateUniqueStringClient(size: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

/**
 * Generates a unique random hexadecimal string of the specified byte size using Node.js crypto.
 *
 * @param size - The number of bytes to generate. Defaults to 32.
 * @returns A randomly generated hexadecimal string of length `size * 2`.
 */
export function generateUniqueStringServer(size: number = 32): string {
    const crypto = require("crypto");
    return crypto.randomBytes(size).toString("hex");
}

/**
 * Slices the input text to a specified number of characters and appends an ellipsis ("...") if the text exceeds that length.
 *
 * @param text - The input string to be sliced.
 * @param numsSlice - The maximum number of characters to retain before adding an ellipsis. Defaults to 4.
 * @returns The sliced string, possibly with an appended ellipsis if the original text was longer than `numsSlice`.
 */
export const sliceText = (text: string, numsSlice: number = 4): string => {
    const parseText = text.toString();

    return parseText.length <= numsSlice ? parseText : parseText.slice(0, numsSlice) + "...";
};

/**
 * Generates a URL-friendly slug from a given text string.
 * Handles Vietnamese diacritics properly by converting them to their base characters.
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug with lowercase letters, numbers, and hyphens only
 */
export function generateSlug(text: string): string {
    if (!text) return "";

    // Vietnamese diacritics mapping
    const vietnameseDiacritics: Record<string, string> = {
        // a
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',

        // e
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',

        // i
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',

        // o
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',

        // u
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',

        // y
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',

        // d
        'đ': 'd', 'Đ': 'D'
    };

    let slug = text;

    // Replace Vietnamese diacritics
    for (const [diacritic, replacement] of Object.entries(vietnameseDiacritics)) {
        slug = slug.replace(new RegExp(diacritic, 'g'), replacement);
    }

    // Convert to lowercase
    slug = slug.toLowerCase();

    // Replace spaces and special characters with hyphens
    slug = slug
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    return slug;
}

/**
 * Validates if a given string is a valid URL-friendly slug.
 * A valid slug contains only lowercase letters, numbers, and hyphens,
 * and does not start or end with a hyphen.
 * 
 * @param slug - The slug string to validate
 * @returns True if the slug is valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
    if (!slug) return false;

    // Check if slug contains only lowercase letters, numbers, and hyphens
    // Should not start or end with hyphen
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    return slugRegex.test(slug);
}

