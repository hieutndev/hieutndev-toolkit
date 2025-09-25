type TDateFormat = "fullDate" | "onlyDate" | "onlyMonthYear" | "onlyDateReverse" | "onlyTime";
type TTimeFormat = "fullTime" | "onlyHours" | "onlyMinutes" | "onlySeconds" | "onlyHourAndMinute" | "onlyMinuteAndSecond";
declare function formatDate(isoString: string | Date, format?: TDateFormat): string;
declare function getMonthYearName(isoString: string): string;
declare function getLastTimeString(isoString: string): string;
declare function getDiffTime(startTime: string, endTime: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};
declare function formatTime(seconds: number, format?: TTimeFormat): string;

export { type TDateFormat, type TTimeFormat, formatDate, formatTime, getDiffTime, getLastTimeString, getMonthYearName };
