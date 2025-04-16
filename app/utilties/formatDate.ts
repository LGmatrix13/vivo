/**
 * Format a UTC date string into "Today", "Yesterday", or MM/DD[, Day][, Time] format in EST/EDT
 */
export function formatDate(
  dateString: string,
  includeTime?: boolean,
  includeDay?: boolean
) {
  const EDT_OFFSET = 4 * 60 * 60 * 1000; // 4 hours behind UTC for EDT

  const utcDate = new Date(dateString); // Original UTC date
  const now = new Date(); // Current time in local time zone (usually UTC in backend)

  // Manually adjust UTC date to EST/EDT
  const estDate = new Date(utcDate.getTime() - EDT_OFFSET);

  // Get today's date and yesterday's date in EST/EDT
  const today = new Date(now.getTime() - EDT_OFFSET); // Today's date in EST/EDT
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Extract parts of the EST date
  const estMonth = estDate.getMonth() + 1; // Months are 0-indexed
  const estDay = estDate.getDate();
  const estWeekday = estDate.toLocaleString("en-US", { weekday: "long" });
  const estHour = estDate.getHours();
  const estMinute = estDate.getMinutes();
  const ampm = estHour >= 12 ? "PM" : "AM";

  // Format the time
  const time = `${estHour % 12 || 12}:${
    estMinute < 10 ? "0" + estMinute : estMinute
  } ${ampm}`;

  // Check if the date is today or yesterday
  const isToday = estDate.getDate() === today.getDate();
  const isYesterday = estDate.getDate() === yesterday.getDate();

  // Return "Today" or "Yesterday" or the formatted date
  if (isToday) {
    return `Today${includeTime ? `, ${time}` : ""}`;
  }

  if (isYesterday) {
    return `Yesterday${includeTime ? `, ${time}` : ""}`;
  }

  // Format as MM/DD or MM/DD, Day if includeDay is true, with time if includeTime is true
  let result = `${estMonth}/${estDay}`;
  if (includeDay) result += `, ${estWeekday}`;
  if (includeTime) result += `, ${time}`;
  return result;
}

export function formatDateWithoutOffset(dateString: string) {
  const utcDate = new Date(dateString); // Original UTC date
  const now = new Date(); // Current time in local time zone (usually UTC in backend)

  // Manually adjust UTC date to EST/EDT
  const estDate = new Date(utcDate.getTime());

  // Get today's date and yesterday's date in EST/EDT
  const today = new Date(now.getTime()); // Today's date in EST/EDT
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Extract parts of the EST date
  const estMonth = estDate.getMonth() + 1; // Months are 0-indexed
  const estDay = estDate.getDate();
  const estWeekday = estDate.toLocaleString("en-US", { weekday: "long" });
  const estHour = estDate.getHours();
  const estMinute = estDate.getMinutes();
  const ampm = estHour >= 12 ? "PM" : "AM";

  // Format the time
  const time = `${estHour % 12 || 12}:${
    estMinute < 10 ? "0" + estMinute : estMinute
  } ${ampm}`;

  // Check if the date is today or yesterday
  const isToday = estDate.getDate() === today.getDate();
  const isYesterday = estDate.getDate() === yesterday.getDate();

  // Return "Today" or "Yesterday" or the formatted date
  if (isToday) {
    return `Today`;
  }

  if (isYesterday) {
    return `Yesterday`;
  }

  // Format as MM/DD or MM/DD, Day if includeDay is true, with time if includeTime is true
  const result = `${estMonth}/${estDay}`;
  return result;
}
