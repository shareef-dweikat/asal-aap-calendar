import {
  CalendarEvent,
  Config,
  EventLayout,
  NormalEventPosition,
} from '../../../common/interface';
import { DateTime } from 'luxon';
import { EVENT_TABLE_DELIMITER_SPACE } from '../../../common/constants';
import {
  checkOverlappingDatesForHeaderEvents,
  checkOverlappingEvents,
  isEventInRange,
} from '../../../utils/eventLayout';
import { formatDateTimeToString } from '../../../utils/common';
import { parseToDateTime } from '../../../utils/dateTimeParser';
import { stretchHeaderEventTimes } from '../../calendarHeader/calendarHeaderEvents/CalendarHeaderEvents.utils';

const formatOverflowingEvents = (events: CalendarEvent[], timezone: string) => {
  const result: any = {};

  if (!events || events.length === 0) {
    return null;
  }

  events.forEach((event) => {
    const dateTimeStartAt = parseToDateTime(event.startAt, timezone);
    const dateTimeEndAt = parseToDateTime(event.endAt, timezone);

    // get each day for multi day events
    // @ts-ignore
    const differenceInDays: number = dateTimeEndAt.diff(dateTimeStartAt).days;

    for (let i = 0; i <= differenceInDays; i++) {
      const dateKey = formatDateTimeToString(dateTimeStartAt.plus({ days: i }));

      if (!result[dateKey]) {
        result[dateKey] = [event];
      } else {
        result[dateKey] = [...result[dateKey], ...[event]];
      }
    }
  });

  return result;
};

export const getMonthRows = (calendarDays: DateTime[]): DateTime[][] => {
  const calendarDaysRows: DateTime[][] = [];

  let tempArray: DateTime[] = [];

  calendarDays.forEach((item, i) => {
    const index = i + 1;
    if (index % 7 === 0) {
      tempArray.push(item);
      calendarDaysRows.push(tempArray);
      tempArray = [];
    } else {
      tempArray.push(item);
    }
  });

  return calendarDaysRows;
};

export const sortByLength = (events: CalendarEvent[]) => {
  return events.sort((a, b) => {
    const diffA: number =
      DateTime.fromISO(a.endAt).toMillis() -
      DateTime.fromISO(a.startAt).toMillis();
    const diffB: number =
      DateTime.fromISO(b.endAt).toMillis() -
      DateTime.fromISO(b.startAt).toMillis();

    if (diffB > diffA) {
      return 1;
    } else if (diffB < diffA) {
      return -1;
    }

    return 0;
  });
};

interface MonthRowResult {
  positions: any;
  overflowingEvents: CalendarEvent[];
}

const getMonthRowPosition = (
  events: any,
  width: number,
  calendarDays: DateTime[],
  timezone: string,
  maxEventsVisible: number
): MonthRowResult => {
  const overflowEvents: CalendarEvent[] = [];
  const tableSpace: number = (width / 100) * EVENT_TABLE_DELIMITER_SPACE;
  const result: any = [];
  const usedEvents: string[] = [];

  // filter only header events
  const eventsFiltered: CalendarEvent[] = [];

  if (!events) {
    return { positions: [], overflowingEvents: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(events)?.map(([key, items]) => {
    // @ts-ignore
    items.forEach((item: CalendarEvent) => {
      // filter only relevant events
      const isInRange: boolean = isEventInRange(item, calendarDays, timezone);
      if (isInRange) {
        // correct position when external event ends in next day
        eventsFiltered.push(item);
      }
    });
  });

  // sort by length to fit more items in limited space
  const sortedByLength = sortByLength(eventsFiltered);

  // find all matching events to fit in one row
  sortedByLength?.forEach((event) => {
    const eventPositionResult: NormalEventPosition[] = [];
    // check if event was used already
    // skip iteration if event was already resolved
    if (usedEvents.includes(event.id)) {
      return true;
    }

    // set event to row
    const rowWithNotOverlappingEvents: CalendarEvent[] = [event];
    usedEvents.push(event.id);

    // compare to rest of the events
    sortedByLength.forEach((eventToCompare) => {
      // check if event was used already
      // skip iteration if event was already resolved
      if (usedEvents.includes(eventToCompare.id)) {
        return true;
      }

      // don't compare to self // maybe remove?
      if (event.id === eventToCompare.id) {
        return true;
      }

      // check if events are not overlapping
      const isOverlapping: boolean = checkOverlappingEvents(
        stretchHeaderEventTimes(event, timezone),
        stretchHeaderEventTimes(eventToCompare, timezone),
        timezone
      );

      // found not overlapping matching event
      if (!isOverlapping) {
        let isMatchingAll = true;
        // compare match with other stored events for same row
        rowWithNotOverlappingEvents.forEach((itemFromRow) => {
          const isOverlappingAll: boolean = checkOverlappingEvents(
            stretchHeaderEventTimes(itemFromRow, timezone),
            stretchHeaderEventTimes(eventToCompare, timezone),
            timezone
          );

          // prevent merging if only one conflict exists
          if (isOverlappingAll) {
            isMatchingAll = false;
          }
        });

        if (isMatchingAll) {
          // store compared event in used array and add to row
          usedEvents.push(eventToCompare.id);
          rowWithNotOverlappingEvents.push(eventToCompare);
        }
      }
    });

    // now we have row with only not overlapping events
    // sort events in row by duration to fit more events in row
    // const sortedResult: CalendarEvent[] = rowWithNotOverlappingEvents.sort(
    //   (a, b) =>
    //     DateTime.fromISO(a.endAt).toMillis() -
    //     DateTime.fromISO(a.startAt).toMillis() -
    //     (DateTime.fromISO(b.endAt).toMillis() -
    //       DateTime.fromISO(b.startAt).toMillis())
    // );

    // const sortedResult = sortByLength(rowWithNotOverlappingEvents);

    // place events accordingly in row next to each other
    rowWithNotOverlappingEvents.forEach((item) => {
      let offset = 0;
      let eventWidth = 0;
      let hasMatchingDay = false;

      calendarDays.forEach((day) => {
        if (checkOverlappingDatesForHeaderEvents(item, day, timezone)) {
          // set base offset only for first item
          eventWidth += width;
          hasMatchingDay = true;
        }

        // increment offset only till we have matching day
        if (!hasMatchingDay) {
          offset += width;
        }
      });

      const isOverflowing: boolean = result.length > maxEventsVisible;
      if (!isOverflowing) {
        // create event position data
        const eventPositionData: NormalEventPosition = {
          event: item,
          width: Math.round(eventWidth - tableSpace),
          offsetLeft: offset,
          offsetTop: 0,
          height: 20,
          zIndex: 2,
        };

        eventPositionResult.push(eventPositionData);
      } else {
        overflowEvents.push(item);
      }
    });

    // save row to result
    result.push(eventPositionResult);
  });

  const formattedResult: any = {};

  result.forEach((events: any, index: number) => {
    events.forEach((item: any) => {
      formattedResult[item.event.id] = { ...item, offsetTop: index * 25 };
    });
  });

  return { positions: formattedResult, overflowingEvents: overflowEvents };
};

export const calculateMonthPositions = (
  events: any,
  width: number,
  calendarDays: DateTime[],
  config: Config,
  maxEventsVisible: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setContext?: any
): any => {
  const result: EventLayout[] = [];
  let overflowingEvents: any = [];

  // TODO prefilter events for each row

  // split calendar days to rows
  const calendarDaysRows: DateTime[][] = getMonthRows(calendarDays);

  // get layout for each row
  calendarDaysRows.forEach((row) => {
    const rowResult: MonthRowResult = getMonthRowPosition(
      events,
      width / 7,
      row,
      config.timezone,
      maxEventsVisible
    );

    result.push(rowResult.positions);
    overflowingEvents = [...overflowingEvents, ...rowResult.overflowingEvents];
  });
  //
  // setContext(
  //   'monthOverflowEvents',
  //   formatOverflowingEvents(overflowingEvents, config.timezone)
  // );

  return {
    result,
    overflowingEvents: formatOverflowingEvents(
      overflowingEvents,
      config.timezone
    ),
  };
};
