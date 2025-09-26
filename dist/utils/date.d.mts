/**
 * Returns a human-readable string representing the time elapsed since the given ISO date-time string.
 *
 * The function calculates the difference between the current time and the provided ISO string,
 * and returns a string such as "2 days ago", "3 hours ago", "5 minutes ago", or "10 seconds ago".
 *
 * @param isoStringTime - An ISO 8601 formatted date-time string (e.g., "2024-06-01T12:00:00Z").
 * @returns A string describing how much time has passed since the given date-time.
 */
declare function getTimeAgoString(isoStringTime: string): string;
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
declare function getDiffTime(startTime: string, endTime: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
type TTimeStringFormat = "hms" | "h" | "m" | "s" | "hm" | "ms";
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
declare function convertSecondsToTimeString(seconds: number, format?: TTimeStringFormat): string;
type TDateRangePeriod = "24hours" | "7days" | "30days" | "12months";
/**
 * Returns the current and previous date ranges for a given period, based on a provided end date.
 *
 * @param period - The period for which to calculate the date range ("24hours", "7days", "30days", "12months").
 * @param endDateInput - The end date as a Date object or ISO string. If not provided, defaults to today.
 * @returns An object containing ISO date strings for startDate, endDate, previousStartDate, and previousEndDate.
 */
declare function getDateRange(period: TDateRangePeriod, endDateInput?: Date | string): {
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
};

export { type TDateRangePeriod, type TTimeStringFormat, convertSecondsToTimeString, getDateRange, getDiffTime, getTimeAgoString };
