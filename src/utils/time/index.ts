import dayjs from "dayjs";

export function getDayTimeFromTimeStamp(time?: any): any {
  return dayjs(time).format("DD/MM/YYYY");
}
