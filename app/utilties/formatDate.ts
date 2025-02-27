export function formatDate(
  dateString: string,
  includeTime?: boolean,
  includeDay?: boolean
) {
  const date = new Date(Date.parse(dateString));
  const today = new Date();

  const diffDays = today.getUTCDate() - date.getUTCDate();
  const diffMonths = today.getUTCMonth() - date.getUTCMonth();
  const diffYears = today.getUTCFullYear() - date.getUTCFullYear();
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    return `Today${includeTime ? `, ${time}` : ""}`;
  } else if (diffYears === 0 && diffDays === 1 && diffMonths === 0) {
    return includeTime ? `Yesterday, ${time}` : "Yesterday";
  } else if (includeTime && includeDay) {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}, ${
      days[date.getDay()]
    }, ${time}`;
  } else if (includeDay) {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}, ${
      days[date.getDay()]
    }`;
  } else if (includeTime) {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}, ${time}`;
  } else {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  }
}
