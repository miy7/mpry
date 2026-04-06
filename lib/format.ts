const bangkokTimeZone = "Asia/Bangkok";
const bangkokUtcOffset = "+07:00";

export function formatThaiDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: bangkokTimeZone,
    dateStyle: "full",
    ...options,
  }).format(date);
}

export function formatThaiMonth(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: bangkokTimeZone,
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatThaiShortDate(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: bangkokTimeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatThaiDateTime(date: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: bangkokTimeZone,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatThaiTime(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("th-TH", {
    timeZone: bangkokTimeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatWorkedDuration(totalMinutes: number) {
  if (!totalMinutes) {
    return "0 ชม.";
  }

  const hours = totalMinutes / 60;

  if (totalMinutes % 60 === 0) {
    return `${hours.toFixed(0)} ชม.`;
  }

  return `${hours.toFixed(2)} ชม.`;
}

export function maskBankAccount(accountNo?: string | null) {
  if (!accountNo) {
    return undefined;
  }

  const cleaned = accountNo.replace(/\s+/g, "");

  if (cleaned.length <= 4) {
    return cleaned;
  }

  return `xxx-x-${cleaned.slice(-4)}`;
}

export function getBangkokDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: bangkokTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function getBangkokDateAtMidnight(date = new Date()) {
  return new Date(`${getBangkokDateKey(date)}T00:00:00.000${bangkokUtcOffset}`);
}

export function getBangkokDayBounds(date = new Date()) {
  const dateKey = getBangkokDateKey(date);

  return {
    start: new Date(`${dateKey}T00:00:00.000${bangkokUtcOffset}`),
    end: new Date(`${dateKey}T23:59:59.999${bangkokUtcOffset}`),
  };
}
