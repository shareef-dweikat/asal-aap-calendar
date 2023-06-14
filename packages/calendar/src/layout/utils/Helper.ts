import { CalendarEvent, Config } from '../index';
import { DateTime } from 'luxon';
import { parseToDateTime } from './LuxonHelper';

export const formatToDateKey = (date: DateTime, timezone?: string) => {
  if (!timezone || date.zoneName === timezone) {
    return date.toFormat('dd-MM-yyyy');
  }

  return date.setZone(timezone).toFormat('dd-MM-yyyy');
};

export const parseToCalendarDays = (
  calendarDays: DateTime[] | string[]
): DateTime[] => {
  if (typeof calendarDays[0] === 'string') {
    return calendarDays.map((item: any) => DateTime.fromISO(item));
  }

  return calendarDays as DateTime[];
};

export const isEventFloating = (event: CalendarEvent) => {
  if (event?.timezoneStartAt === 'floating') {
    return true;
  }

  return false;
};

const getRelativeHourHeight = (config: Config) => 60 / config.hourHeight;

export const sortEvents = (events: CalendarEvent[]) =>
  events.sort((a: CalendarEvent, b: CalendarEvent) => {
    return a.startAt.localeCompare(b.startAt);
  });

const getStartDate = (event: CalendarEvent, config: Config) =>
  parseToDateTime(event.startAt, config.timezone, isEventFloating(event));

const getEndDate = (event: CalendarEvent, config: Config) =>
  parseToDateTime(event.endAt, config.timezone, isEventFloating(event));

/**
 * Set UTC for floating dates or use config timezone
 * @param timezone
 * @param isFloating
 */
export const parseTimezone = (timezone: string, isFloating?: boolean) => {
  if (isFloating) {
    return 'UTC';
  }

  return timezone;
};

/**
 * Get offset from top by diff between top position and event starting position
 * @param event
 * @param config
 */
export const calculateOffsetTop = (event: CalendarEvent, config: Config) => {
  let startDate = getStartDate(event, config);

  const topPosition = startDate.set({
    hour: 0,
    minute: 0,
    second: 0,
  });

  const startDateOffset = startDate.offset;
  const topPositionOffset = topPosition.offset;

  // make offset correction when top position is in different DST zone than
  // startDate
  if (startDateOffset !== topPositionOffset) {
    if (topPositionOffset > startDateOffset) {
      startDate = startDate.minus({
        minutes: topPositionOffset - startDateOffset,
      });
    } else {
      startDate = startDate.plus({
        minutes: startDateOffset - topPositionOffset,
      });
    }
  }

  const hourHeightValue = getRelativeHourHeight(config);

  const diffInMinutes = startDate
    .diff(topPosition, 'minutes')
    .toObject().minutes;

  if (diffInMinutes) {
    return diffInMinutes / hourHeightValue;
  }

  return 0;
};

/**
 * Get event height by diff in end and start date
 * @param event
 * @param config
 */
export const calculateEventHeight = (event: CalendarEvent, config: Config) => {
  const startDate = getStartDate(event, config);
  const endDate = getEndDate(event, config);

  const diffInMinutes = endDate.diff(startDate, 'minutes').toObject().minutes;

  const hourHeightValue = getRelativeHourHeight(config);

  if (diffInMinutes) {
    return diffInMinutes / hourHeightValue;
  }

  return 0;
};
