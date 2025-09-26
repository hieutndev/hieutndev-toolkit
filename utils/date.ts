/**
 * Returns a human-readable string representing the time elapsed since the given ISO date-time string.
 *
 * The function calculates the difference between the current time and the provided ISO string,
 * and returns a string such as "2 days ago", "3 hours ago", "5 minutes ago", or "10 seconds ago".
 *
 * @param isoStringTime - An ISO 8601 formatted date-time string (e.g., "2024-06-01T12:00:00Z").
 * @returns A string describing how much time has passed since the given date-time.
 */
export function getTimeAgoString(isoStringTime: string): string {
    const lastUpdatedTime = new Date(isoStringTime);
    const currentTime = new Date();

    const diffInSeconds = Math.floor((currentTime.getTime() - lastUpdatedTime.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
        return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
    }
}

/**
 * Calculates the difference between two date-time strings and returns the result as an object
 * containing the number of days, hours, minutes, and seconds.
 *
 * @param startTime - The start date-time as an ISO string or a format recognized by the Date constructor.
 * @param endTime - The end date-time as an ISO string or a format recognized by the Date constructor.
 * @returns An object with the properties:
 *   - `days`: Number of full days between the two times.
 *   - `hours`: Number of hours remaining after extracting days.
 *   - `minutes`: Number of minutes remaining after extracting hours.
 *   - `seconds`: Number of seconds remaining after extracting minutes.
 */
export function getDiffTime(startTime: string, endTime: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    return {
        days: diffInDays,
        hours: diffInHours % 24,
        minutes: diffInMinutes % 60,
        seconds: diffInSeconds % 60,
    }
}


export type TTimeStringFormat = "hms" | "h" | "m" | "s" | "hm" | "ms";

/**
 * Converts a number of seconds into a formatted time string.
 *
 * @param seconds - The total number of seconds to convert.
 * @param format - The format of the output string. 
 *   - "hms": hours, minutes, and seconds (e.g., "1h 2m 3s")
 *   - "h": hours only (e.g., "1h")
 *   - "m": minutes only (e.g., "2m")
 *   - "s": seconds only (e.g., "3s")
 *   - "hm": hours and minutes (e.g., "1h 2m")
 *   - "ms": minutes and seconds (e.g., "2m 3s")
 *   Defaults to "hms".
 * @returns The formatted time string.
 */
export function convertSecondsToTimeString(seconds: number, format: TTimeStringFormat = "hms"): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // return based on format
    switch (format) {
        case "hms":
            return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
        case "h":
            return `${hours}h`;
        case "m":
            return `${minutes}m`;
        case "s":
            return `${remainingSeconds}s`;
        case "hm":
            return `${hours}h ${minutes}m`;
        case "ms":
            return `${minutes}m ${remainingSeconds}s`;
        default:
            return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
    }
}


export type TDateRangePeriod = "24hours" | "7days" | "30days" | "12months";

/**
 * Returns the current and previous date ranges for a given period, based on a provided end date.
 *
 * @param period - The period for which to calculate the date range ("24hours", "7days", "30days", "12months").
 * @param endDateInput - The end date as a Date object or ISO string. If not provided, defaults to today.
 * @returns An object containing ISO date strings for startDate, endDate, previousStartDate, and previousEndDate.
 */
export function getDateRange(
    period: TDateRangePeriod,
    endDateInput?: Date | string
): {
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
} {
    const endDate = endDateInput
        ? (typeof endDateInput === "string" ? new Date(endDateInput) : new Date(endDateInput))
        : new Date();
    const startDate = new Date(endDate);
    const previousEndDate = new Date(startDate);
    const previousStartDate = new Date(startDate);

    switch (period) {
        case "24hours":
            startDate.setDate(endDate.getDate() - 1);
            previousEndDate.setTime(startDate.getTime());
            previousStartDate.setDate(previousEndDate.getDate() - 1);
            break;
        case "7days":
            startDate.setDate(endDate.getDate() - 7);
            previousEndDate.setTime(startDate.getTime());
            previousStartDate.setDate(previousEndDate.getDate() - 7);
            break;
        case "12months":
            startDate.setFullYear(endDate.getFullYear() - 1);
            previousEndDate.setTime(startDate.getTime());
            previousStartDate.setFullYear(previousEndDate.getFullYear() - 1);
            break;
        case "30days":
        default:
            startDate.setDate(endDate.getDate() - 30);
            previousEndDate.setTime(startDate.getTime());
            previousStartDate.setDate(previousEndDate.getDate() - 30);
            break;
    }

    return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        previousStartDate: previousStartDate.toISOString().split("T")[0],
        previousEndDate: previousEndDate.toISOString().split("T")[0],
    };
}