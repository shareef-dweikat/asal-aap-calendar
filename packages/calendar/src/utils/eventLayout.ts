/**
 * Calculate normal event positions for one day
 * @param daysNum
 * @param events
 * @param baseWidth
 * @param isDark
 * @param defaultTimezone
 */
import { CALENDAR_VIEW } from '../common/enums';
import {
  CalendarEvent,
  Config,
  NormalEventPosition,
} from '../common/interface';
import { DateTime, Interval } from 'luxon';
import {
  EVENT_MIN_HEIGHT,
  EVENT_TABLE_DELIMITER_SPACE,
  SHOW_TIME_THRESHOLD,
} from '../common/constants';
import { getDaysNum, parseToDate } from './calendarDays';
import { parseToDateTime } from './dateTimeParser';

export const checkOverlappingEvents = (
  eventA: CalendarEvent,
  eventB: CalendarEvent,
  timezone: string
): boolean => {
  const startAtFirst: DateTime = parseToDateTime(
    eventA.startAt,
    timezone,
    timezone
  );
  const endAtFirst: DateTime = parseToDateTime(
    eventA.endAt,
    timezone,
    timezone
  );
  const startAtSecond: DateTime = parseToDateTime(
    eventB.startAt,
    timezone,
    timezone
  );
  const endAtSecond: DateTime = parseToDateTime(
    eventB.endAt,
    timezone,
    timezone
  );

  return Interval.fromDateTimes(startAtFirst, endAtFirst).overlaps(
    Interval.fromDateTimes(startAtSecond, endAtSecond)
  );
};

const adjustForMinimalHeight = (
  eventA: any,
  eventB: any,
  hourHeight: number
): { eventA: any; eventB: any } => {
  const result: any = {
    eventA: { ...eventA },
    eventB: { ...eventB },
  };

  const eventADiff: number =
    // @ts-ignore
    DateTime.fromISO(eventA.endAt)
      .diff(DateTime.fromISO(eventA.startAt))
      .toObject().minutes /
    (60 / hourHeight);
  const eventBDiff: number =
    // @ts-ignore
    DateTime.fromISO(eventB.endAt)
      .diff(DateTime.fromISO(eventB.startAt))
      .toObject().minutes /
    (60 / hourHeight);

  if (eventADiff < EVENT_MIN_HEIGHT) {
    result.eventA.endAt = DateTime.fromISO(result.eventA.endAt)
      .plus({
        minutes: EVENT_MIN_HEIGHT - eventADiff,
      })
      .toString();
  }
  if (eventBDiff < EVENT_MIN_HEIGHT) {
    result.eventB.endAt = DateTime.fromISO(result.eventB.endAt)
      .plus({
        minutes: EVENT_MIN_HEIGHT - eventBDiff,
      })
      .toString();
  }

  return result;
};

export const filterEventsByCalendarIDs = (
  events: any,
  calendarIDsHidden?: string[]
) => {
  if (!calendarIDsHidden || calendarIDsHidden.length === 0) {
    return events;
  }

  return events.filter((item: any) => {
    if (item.calendarID) {
      if (calendarIDsHidden?.includes(item.calendarID)) {
        return false;
      } else {
        return item;
      }
    }

    return item;
  });
};

export const calculateNormalEventPositions = (
  events: any,
  baseWidth: number,
  config: Config,
  selectedView: CALENDAR_VIEW,
  dateKey: string
): NormalEventPosition[] => {
  const result: NormalEventPosition[] = [];

  let offsetCount: any = []; //Store every event id of overlapping items
  let offsetCountFinal: any; //Sort events by id number
  const tableWidth: number = baseWidth / getDaysNum(selectedView);
  const tableSpace: number = (tableWidth / 100) * EVENT_TABLE_DELIMITER_SPACE;

  if (events) {
    const eventsData: any = events;
    // Filter all day events and multi day events
    eventsData
      .filter((item: any) => !item.allDay)
      .map((event: any) => {
        let width = 1; //Full width
        let offsetLeft = 0;
        // Compare events
        eventsData.forEach((item2: any) => {
          if (event.id !== item2.id && !item2.allDay) {
            // adjust events to have at least minimal height to check
            // overlapping
            const { eventA, eventB } = adjustForMinimalHeight(
              event,
              item2,
              config.hourHeight
            );

            if (
              checkOverlappingEvents(eventA, eventB, config.timezone) &&
              !eventB.allDay
            ) {
              width = width + 1; //add width for every overlapping item
              offsetCount.push(item2.id); // set offset for positioning
              offsetCount.push(event.id); // set offset for positioning
            }
          }
        });

        const offsetTop: any =
          // @ts-ignore
          parseToDateTime(event.startAt, config.timezone, config.timezone)
            .diff(
              parseToDateTime(
                event.startAt,
                config.timezone,
                config.timezone
              ).set({
                hour: 0,
                minute: 0,
                second: 0,
              }),
              'minutes'
            )
            .toObject().minutes /
          (60 / config.hourHeight); // adjust based on hour column height

        const eventHeight: any =
          // @ts-ignore
          parseToDateTime(event.endAt, config.timezone)
            .diff(parseToDateTime(event.startAt, config.timezone), 'minutes')
            .toObject().minutes /
          (60 / config.hourHeight); // adjust based on hour column height

        const eventWidth: number = tableWidth / width;

        //sort items for proper calculations of offset by id
        // prevent different order in loop
        if (offsetCount.length > 0) {
          offsetCountFinal = offsetCount.sort();
        }

        if (offsetCountFinal) {
          offsetLeft = eventWidth * offsetCountFinal.indexOf(event.id); //count offset
        }

        //event.left
        // Current status: events is displayed in wrong place
        offsetCount = [];
        offsetCountFinal = '';

        result.push({
          dateKey,
          event,
          height:
            eventHeight < EVENT_MIN_HEIGHT ? EVENT_MIN_HEIGHT : eventHeight,
          width: eventWidth,
          offsetLeft,
          offsetTop,
          zIndex: 2,
          meta: {
            isFullWidth: width === 1,
            showTime:
              eventWidth >= SHOW_TIME_THRESHOLD &&
              eventHeight >= SHOW_TIME_THRESHOLD,
            centerText: eventHeight <= SHOW_TIME_THRESHOLD,
          },
        });
      });
  }

  const partialResult: NormalEventPosition[] = result.map(
    (item: NormalEventPosition) => {
      // full event width
      if (item.meta?.isFullWidth) {
        return {
          ...item,
          width: Math.round(item.width - tableSpace), // add some padding,
        };
      } else if (item.offsetLeft > 0) {
        return {
          ...item,
          width: Math.round(item.width),
          offsetLeft: item.offsetLeft - tableSpace,
          zIndex: item.zIndex ? item.zIndex + 2 : 2,
        };
      } else {
        return { ...item, width: Math.round(item.width) };
      }
    }
  );

  return partialResult;
};

export const calculateDaysViewLayout = (
  calendarDays: DateTime[],
  events: any,
  baseWidth: number,
  config: Config,
  selectedView: CALENDAR_VIEW
) => {
  const result: any = {};
  calendarDays.forEach((calendarDay) => {
    const formattedDayString: string = calendarDay.toFormat('dd-MM-yyyy');
    const dayEvents: any = events[formattedDayString];

    const groupedPositions: any = {};

    const positions = calculateNormalEventPositions(
      dayEvents,
      baseWidth,
      config,
      selectedView,
      formattedDayString
    );

    positions.forEach((item: any) => {
      if (groupedPositions[item.event.id]) {
        groupedPositions[item.event.id] = item;
      } else {
        groupedPositions[item.event.id] = item;
      }
    });

    result[formattedDayString] = groupedPositions;
  });

  return result;
};

export const checkOverlappingDatesForHeaderEvents = (
  event: CalendarEvent,
  day: DateTime,
  timezone: string
): boolean => {
  const dateStart = parseToDateTime(event.startAt, timezone);
  const dateEnd = parseToDateTime(event.endAt, timezone);
  const dayTruncated: number = parseToDate(day)
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();

  const eventStartTruncated: number = dateStart
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();
  const eventEndTruncated: number = dateEnd
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();

  // fix wrong positioning when external all day event ends in next day
  if (event.externalID) {
    return (
      dayTruncated >= eventStartTruncated && dayTruncated < eventEndTruncated
    );
  } else {
    return (
      dayTruncated >= eventStartTruncated && dayTruncated <= eventEndTruncated
    );
  }
};

export const isEventInRange = (
  event: CalendarEvent,
  days: DateTime[],
  timezone: string
): boolean => {
  let hasMatch = false;

  for (const day of days) {
    if (checkOverlappingDatesForHeaderEvents(event, day, timezone)) {
      hasMatch = true;
      return true;
      // return false;
    }
  }

  return hasMatch;
};
