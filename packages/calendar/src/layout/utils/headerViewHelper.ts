import { CALENDAR_VIEW, CalendarEvent, Config } from '../index';
import { DateTime } from 'luxon';
import { ItemRowLayoutResult } from '../types';
import { formatToDateKey } from './Helper';
import { getDaysNum } from './KalendHelper';
import { getRowLayout } from './commonHelper';
import { prepareMultiDayEvents } from '../views/monthView';

export const calculatePositionForHeaderEvents = (
  events: CalendarEvent[],
  width: number,
  calendarDays: DateTime[],
  config: Config,
  selectedView: CALENDAR_VIEW
): ItemRowLayoutResult => {
  if (!events) {
    return {
      positions: [],
      headerOffsetTop: 0,
      overflowingEvents: [],
    };
  }

  const breakPointDate = formatToDateKey(
    calendarDays[calendarDays.length - 1],
    config.timezone
  );

  const preparedEvents: any = prepareMultiDayEvents(
    events,
    config,
    breakPointDate,
    selectedView
  );

  return getRowLayout(
    preparedEvents,
    width / getDaysNum(selectedView),
    calendarDays,
    config.timezone,
    150,
    true
  );
};
