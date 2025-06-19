import * as dateFns from 'date-fns';

export const TIME_FORMAT_INPUT = 'HHmmss';
export const DATE_FORMAT_INPUT = 'yyyyMMdd';
export const DATE_TIME_FORMAT_INPUT = DATE_FORMAT_INPUT + TIME_FORMAT_INPUT;

export const TIME_FORMAT_DISPLAY = 'HH:mm:ss';
export const DATE_FORMAT_DISPLAY = 'dd/MM/yyyy';

export function formatTimeToString(
  timestamp?: number,
  formatOutput:
    | 'dd/MM/yyyy'
    | 'yyyy/MM/dd'
    | 'dd/MM/yyyy HH:mm:ss'
    | 'dd/MM/yyyy HH:mm' = DATE_FORMAT_DISPLAY
) {
  if (timestamp == null) {
    return null;
  }
  return dateFns.format(new Date(timestamp), formatOutput);
}

export function formatDateToString(
  date?: Date,
  formatOutput = DATE_FORMAT_INPUT
) {
  if (date == null) {
    return date;
  }
  return dateFns.format(date, formatOutput);
}

export function formatTimeToDisplay(
  stringInput?: string,
  formatOutput = TIME_FORMAT_DISPLAY,
  formatInput = DATE_TIME_FORMAT_INPUT,
  ignoreTimeZone?: boolean
) {
  try {
    if (!stringInput) {
      return null;
    }
    let time = dateFns.parse(stringInput, formatInput, new Date());
    if (ignoreTimeZone !== true) {
      time = dateFns.addHours(time, 7);
    }
    return dateFns.format(time, formatOutput);
  } catch (error) {
    return null;
  }
}

export function formatDateToDisplay(
  stringInput?: string,
  formatOutput = DATE_FORMAT_DISPLAY,
  formatInput = DATE_FORMAT_INPUT,
  ignoreTimeZone?: boolean
) {
  try {
    if (!stringInput) {
      return null;
    }
    let time = dateFns.parse(stringInput, formatInput, new Date());
    if (ignoreTimeZone !== true) {
      time = dateFns.addHours(time, 7);
    }
    return dateFns.format(time, formatOutput);
  } catch (error) {
    return null;
  }
}

export function formatStringToDate(
  stringInput: string | undefined,
  formatInput = DATE_FORMAT_INPUT
) {
  if (stringInput == null) {
    return new Date();
  }

  return dateFns.parse(stringInput, formatInput, new Date());
}

export function addDays(date: Date, day: number) {
  return dateFns.addDays(date, day);
}

export function formatTimeToUTC(a: Date, offsetTimeZone = 0) {
  const year = a.getFullYear();
  const month = a.getMonth();
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  return Date.UTC(year, month, date, hour + offsetTimeZone, min, sec);
}

export function getDateAMonthAgo() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
}
