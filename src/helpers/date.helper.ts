import {format} from "date-fns";

export function formatDatePretty(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy");
}
