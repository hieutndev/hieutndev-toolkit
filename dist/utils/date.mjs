import "./chunk-Y6FXYEAI.mjs";

// utils/date.ts
function getTimeAgoString(isoStringTime) {
  const lastUpdatedTime = new Date(isoStringTime);
  const currentTime = /* @__PURE__ */ new Date();
  const diffInSeconds = Math.floor((currentTime.getTime() - lastUpdatedTime.getTime()) / 1e3);
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
function getDiffTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1e3);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  return {
    days: diffInDays,
    hours: diffInHours % 24,
    minutes: diffInMinutes % 60,
    seconds: diffInSeconds % 60
  };
}
function convertSecondsToTimeString(seconds, format = "hms") {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainingSeconds = seconds % 60;
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
function getDateRange(period, endDateInput) {
  const endDate = endDateInput ? typeof endDateInput === "string" ? new Date(endDateInput) : new Date(endDateInput) : /* @__PURE__ */ new Date();
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
    previousEndDate: previousEndDate.toISOString().split("T")[0]
  };
}
export {
  convertSecondsToTimeString,
  getDateRange,
  getDiffTime,
  getTimeAgoString
};
