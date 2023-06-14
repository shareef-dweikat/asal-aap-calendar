import { CalendarEvent } from '../common/interface';
import { DateTime } from 'luxon';
import { parseToDateTime } from './dateTimeParser';
import LuxonHelper from './luxonHelper';

export const parseAllDayEvent = (
  event: CalendarEvent,
  timezone: string
): CalendarEvent => {
  const startAtDateTime: DateTime = parseToDateTime(event.startAt, timezone);
  const endAtDateTime: DateTime = parseToDateTime(event.endAt, timezone);

  return {
    ...event,
    allDay: !LuxonHelper.isSameDay(startAtDateTime, endAtDateTime),
  };
};

export const parseAllDayEvents = (events: any, timezone: string) => {
  const result: any = {};

  if (!events) {
    return {};
  }

  Object.entries(events).forEach((keyValue: any) => {
    const eventsItems: CalendarEvent[] = keyValue[1];

    eventsItems.forEach((item: CalendarEvent) => {
      const dateKey: any = parseToDateTime(item.startAt, timezone).toFormat(
        'dd-MM-yyyy'
      );

      if (result[dateKey]) {
        result[dateKey] = [
          ...result[dateKey],
          ...[parseAllDayEvent(item, timezone)],
        ];
      } else {
        result[dateKey] = [parseAllDayEvent(item, timezone)];
      }
    });
  });

  return result;
};
