import {
  CALENDAR_NAVIGATION_DIRECTION,
  CALENDAR_VIEW,
  WEEKDAY_START,
} from '../common/enums';
import { DateTime } from 'luxon';
import { calculateCalendarDays } from './calendarDays';

/**
 * Calculate new calendar days
 * @param calendarDays
 * @param calendarView
 * @param direction
 * @param weekDayStart
 * @param dispatchContext
 */
export const getNewCalendarDays = (
  calendarDays: DateTime[],
  calendarView: CALENDAR_VIEW,
  direction: CALENDAR_NAVIGATION_DIRECTION,
  weekDayStart: WEEKDAY_START,
  dispatchContext?: any
): DateTime[] => {
  const setSelectedDate = (date: DateTime) => {
    if (dispatchContext) {
      dispatchContext('selectedDate', date);
    }
  };

  const newCalendarDays: DateTime[] = calculateCalendarDays(
    direction,
    calendarDays,
    calendarView,
    setSelectedDate,
    weekDayStart
  );

  if (dispatchContext) {
    dispatchContext('calendarDays', newCalendarDays);
  }

  return newCalendarDays;
  // dispatchContext(
  //   'selectedDate',
  //   newCalendarDays[chooseSelectedDateIndex(calendarView)]
  // );
};

export const navigateToToday = async (
  selectedView: CALENDAR_VIEW,
  setContext: any,
  weekDayStart: WEEKDAY_START,
  dateNow: DateTime = DateTime.now()
): Promise<void> => {
  getNewCalendarDays(
    [dateNow],
    selectedView,
    CALENDAR_NAVIGATION_DIRECTION.TODAY,
    weekDayStart,
    setContext
  );
};
