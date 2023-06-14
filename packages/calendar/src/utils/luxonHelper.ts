import { DateTime } from 'luxon';
import { getCurrentTime } from './common';
import Datez from 'datez';
//
// Support for local datetime, timezones and floating times
//
const FLOATING_DATETIME = 'floating'; // fixed datetime without timezone
const UTC_TIMEZONE = 'UTC';

export const TIMESTAMP_FORMAT = "yyyy-MM-dd HH:mm:ss 'Z'";
export const DATE_HOUR_FORMAT = 'd. MMM, HH:mm';
export const DATE_FORMAT = 'd. MMMM';
export const TIME_FORMAT = 'HH:mm';
export const DATE_DAY_FORMAT = 'd. MMMM (EEEEEE)';
export const WEEK_DAY_FORMAT = 'cccc';
export const WEEK_DAY_FORMAT_MEDIUM = 'ccc';
export const WEEK_DAY_FORMAT_SHORT = 'EEEEEE';
export const DATE_MONTH_YEAR_FORMAT = 'd. MMMM yyyy';
export const EVENTS_DAY_FORMAT = 'dd-MM-yyyy';

/**
 * Parse datetime according different rules like local datetime, floating time and timezones
 * @param date
 * @param zone
 * @param deviceTimezone
 * @constructor
 */
export const DatetimeParser = (
  date: DateTime | string,
  zone: string,
  deviceTimezone?: string
): string => {
  const dateString: string = typeof date === 'string' ? date : date.toString();

  const isFloatingDatetime: boolean = zone === FLOATING_DATETIME;

  // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
  if (isFloatingDatetime) {
    const dateFloating: DateTime = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE,
    });

    return dateFloating.toUTC().toISO();
  }

  const thisDate: DateTime = DateTime.fromISO(dateString);

  // Adjust datetime to device timezone
  if (deviceTimezone) {
    const dateConvert: DateTime = Datez.setZone(thisDate, zone);

    return dateConvert.setZone(deviceTimezone).toString();
  }

  return Datez.setZone(thisDate, zone).toString();
};

const LuxonHelper = {
  parseToDateTime: (date: string | DateTime): DateTime =>
    typeof date === 'string' ? DateTime.fromISO(date) : date,

  getLastDayOfMonth: (date: DateTime): DateTime => {
    const daysInMonth: number = date.daysInMonth;

    return date.set({ day: daysInMonth });
  },

  getFirstDayOfMonth: (date: DateTime): DateTime => date.set({ day: 1 }),

  isSameDay: (dateA: DateTime, dateB: DateTime): boolean => {
    return (
      dateA.year === dateB.year &&
      dateA.month === dateB.month &&
      dateA.day === dateB.day
    );
  },

  isBefore: (dateA: string, dateB: string): boolean =>
    DateTime.fromISO(dateB).valueOf() - DateTime.fromISO(dateA).valueOf() > 0,

  isBeforeInDateTime: (dateA: DateTime, dateB: DateTime): boolean =>
    dateB.valueOf() - dateA.valueOf() > 0,

  isBeforeAny: (dateA: string, dateB: string): boolean => {
    const dateADateTime: DateTime = LuxonHelper.parseToDateTime(dateA);
    const dateBDateTime: DateTime = LuxonHelper.parseToDateTime(dateB);

    return dateBDateTime.valueOf() - dateADateTime.valueOf() > 0;
  },

  isToday: (dateA: DateTime, timezone: string | undefined): boolean => {
    const todayDate = getCurrentTime(timezone);

    return (
      dateA.day === todayDate.day &&
      dateA.month === todayDate.month &&
      dateA.year === todayDate.year
    );
  },

  isTodayOrInFuture: (
    dateA: DateTime,
    timezone: string | undefined
  ): boolean => {
    const todayDate = getCurrentTime(timezone);

    return (
      dateA.day >= todayDate.day &&
      dateA.month === todayDate.month &&
      dateA.year === todayDate.year
    );
  },

  isSameMonth: (dateA: DateTime, dateB: DateTime): boolean => {
    return dateA.month === dateB.month && dateA.year === dateB.year;
  },

  isNearDateOrInFuture: (
    selectedDate: DateTime,
    calendarDay: DateTime
  ): boolean => {
    return (
      selectedDate.day >= calendarDay.day &&
      selectedDate.month === calendarDay.month &&
      selectedDate.year === calendarDay.year
    );
  },

  isCurrentMonth: (dateA: DateTime, timezone: string | undefined): boolean => {
    const todayDate = getCurrentTime(timezone);

    return dateA.month === todayDate.month && dateA.year === todayDate.year;
  },

  parseToString: (date: DateTime | string): string => {
    if (typeof date !== 'string') {
      if (date.isValid) {
        return date.toUTC().toString();
      }
    }

    return date.toString() as string;
  },
  toUtcString: (date: string): string => DateTime.fromISO(date).toUTC().toISO(),
  toUtc: (date: DateTime): string => date.toUTC().toISO(),
  setTimezone: (dateString: string, timezone: string): string =>
    Datez.setZone(DateTime.fromISO(dateString), timezone).toString(),
  toHumanDate: (dateString: string): string =>
    DateTime.fromISO(dateString).toFormat('d LLL yyyy hh:mm'),
};

export default LuxonHelper;
