import { CALENDAR_VIEW, CalendarEvent, Config } from '../../index';
import { DateTime } from 'luxon';
import { DayViewResult, KeyedDayViewResult, KeyedEvents } from '../../types';
import { EVENT_TABLE_DELIMITER_SPACE } from '../../constants';
import { LuxonHelper, parseToDateTime } from '../../utils/LuxonHelper';
import { calculatePositionForHeaderEvents } from '../../utils/headerViewHelper';
import {
  formatToDateKey,
  isEventFloating,
  parseTimezone,
  sortEvents,
} from '../../utils/Helper';
import {
  getCorrectWidth,
  getDaysNum,
  getEventDateTime,
} from '../../utils/KalendHelper';
import {
  getEventsLayouts,
  groupEvents,
  parseToDayViewResult,
} from './daysViewHelper';
import { parseAllDayEventsArray } from '../../utils/allDayEvents';

const calculateNormalEventPositions = (
  events: CalendarEvent[],
  baseWidth: number,
  config: any,
  selectedView: any,
  dateKey: string
) => {
  const result: DayViewResult[] = [];

  if (!events?.length) {
    return result;
  }

  const tableWidth: number = baseWidth / getDaysNum(selectedView);
  const tableSpace: number = (tableWidth / 100) * EVENT_TABLE_DELIMITER_SPACE;

  // sort by event start
  const sortedEvents = sortEvents(events);

  // TODO can be moved to any iteration before to optimize
  // add offset top and height
  const layoutEvents = getEventsLayouts(sortedEvents, config);

  // group events based on overlapping
  const layoutGroups = groupEvents(layoutEvents);

  // now adjust layout for each event
  layoutGroups.forEach((groups) => {
    const count = groups.length;
    const eventWidth = tableWidth / count;

    groups.forEach((groupItem, index) => {
      const dayViewResult = parseToDayViewResult(
        dateKey,
        eventWidth,
        tableWidth,
        tableSpace,
        index,
        groupItem
      );

      result.push(dayViewResult);
    });
  });

  return result;
};

const calculateDaysViewLayout = (
  calendarDays: DateTime[],
  events: any,
  baseWidth: number,
  config: any,
  selectedView: any
) => {
  const result: KeyedDayViewResult = {};
  calendarDays.forEach((calendarDay) => {
    const formattedDayString: string = formatToDateKey(
      calendarDay,
      config.timezone
    );
    const dayEvents = events[formattedDayString];

    result[formattedDayString] = calculateNormalEventPositions(
      dayEvents,
      baseWidth,
      config,
      selectedView,
      formattedDayString
    );
  });

  return result;
};

const filterEvents = (events: CalendarEvent[], config: Config) => {
  // filter to header and normal events
  const headerEvents: KeyedEvents = {};
  const headerEventsTemp: CalendarEvent[] = [];
  const normalEvents: KeyedEvents = {};

  events.forEach((event) => {
    const { dateTimeStart, dateTimeEnd } = getEventDateTime(event, config);
    const key = formatToDateKey(
      dateTimeStart,
      parseTimezone(config.timezone, isEventFloating(event))
    );

    // need to store each occurrence
    const daySpawns: string[] = [];

    if (event.allDay) {
      headerEventsTemp.push(event);
      if (headerEvents[key]) {
        headerEvents[key] = [...headerEvents[key], ...[event]];
      } else {
        headerEvents[key] = [event];
      }
    } else {
      // check if start and end on different days
      const isSameDay = LuxonHelper.isSameDay(dateTimeStart, dateTimeEnd);

      // origin date to determine when event starts in each row
      let originDate = formatToDateKey(
        dateTimeStart,
        parseTimezone(config.timezone, isEventFloating(event))
      );

      // handle multi-day
      if (!isSameDay) {
        for (let i = 0; i <= 1; i++) {
          const refDate = dateTimeStart.plus({ days: i });
          originDate = formatToDateKey(
            refDate,
            parseTimezone(config.timezone, isEventFloating(event))
          );

          const dateKey = formatToDateKey(
            refDate,
            parseTimezone(config.timezone, isEventFloating(event))
          );

          // store each day in multi-day event range
          daySpawns.push(dateKey);

          const eventClone: CalendarEvent = {
            ...event,
            originDate,
            daysAfter: 1 - i,
            original: {
              startAt: event.startAt,
              endAt: event.endAt,
            },
            startAt:
              i === 1
                ? parseToDateTime(
                    event.endAt,
                    config.timezone,
                    isEventFloating(event)
                  )
                    .set({ hour: 0, minute: 0, second: 0 })
                    .toUTC()
                    .toString()
                : event.startAt,
            endAt:
              i === 0
                ? parseToDateTime(
                    event.startAt,
                    config.timezone,
                    isEventFloating(event)
                  )
                    .set({ hour: 23, minute: 59, second: 59 })
                    .toUTC()
                    .toString()
                : event.endAt,
          };

          eventClone.daySpawns = daySpawns;

          if (!normalEvents[originDate]) {
            normalEvents[originDate] = [eventClone];
          } else {
            normalEvents[originDate] = [
              ...normalEvents[originDate],
              ...[eventClone],
            ];
          }
        }
      } else if (normalEvents[key]) {
        normalEvents[key] = [...normalEvents[key], event];
      } else {
        normalEvents[key] = [event];
      }
    }
  });

  return {
    normalEvents,
    headerEvents,
    headerEventsTemp,
  };
};

export const getDaysViewLayout = (
  events: any,
  calendarDays: DateTime[],
  config: Config,
  width: number,
  selectedView: CALENDAR_VIEW,
  isMobile?: boolean
) => {
  // add allDay flag to events
  const eventsParsed: CalendarEvent[] = parseAllDayEventsArray(
    events,
    config.timezone
  );

  // filter to header and normal events
  const { headerEventsTemp, normalEvents } = filterEvents(eventsParsed, config);

  const headerPositions = calculatePositionForHeaderEvents(
    headerEventsTemp,
    getCorrectWidth(width, isMobile || false, CALENDAR_VIEW.WEEK),
    calendarDays,
    config,
    selectedView
  );

  const normalPositions = calculateDaysViewLayout(
    calendarDays,
    normalEvents,
    getCorrectWidth(width, isMobile || false, CALENDAR_VIEW.WEEK),
    config,
    selectedView
  );

  return { normalPositions, headerPositions };
};
