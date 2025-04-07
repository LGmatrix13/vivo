/**
 * format date in simplier notation for tables
 */
export function formatDate(
  dateString: string,
  includeTime?: boolean,
  includeDay?: boolean
) {
  const date = new Date(Date.parse(dateString));
  const today = new Date(
    new Date().toLocaleString("en", {
      timeZone: "America/New_York",
    })
  );

  const diffDays = today.getDate() - date.getDate();
  const diffMonths = today.getMonth() - date.getMonth();
  const diffYears = today.getFullYear() - date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    return `Today${includeTime ? `, ${time}` : ""}`;
  } else if (diffYears === 0 && diffDays === 1 && diffMonths === 0) {
    return includeTime ? `Yesterday, ${time}` : "Yesterday";
  } else if (includeTime && includeDay) {
    return `${date.getMonth() + 1}/${date.getDate()}, ${
      days[date.getDay()]
    }, ${time}`;
  } else if (includeDay) {
    return `${date.getMonth() + 1}/${date.getDate()}, ${days[date.getDay()]}`;
  } else if (includeTime) {
    return `${date.getMonth() + 1}/${date.getDate()}, ${time}`;
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
