const bangkokTimeZone = "Asia/Bangkok";

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
