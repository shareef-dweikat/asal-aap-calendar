/* tslint:disable:no-magic-numbers */
import {
  CALENDAR_NAVIGATION_DIRECTION,
  CALENDAR_VIEW,
  WEEKDAY_START,
} from '../common/enums';
import { DateTime } from 'luxon';
import { getArrayEnd, getArrayStart } from './common';
import LuxonHelper from './luxonHelper';

const ONE_DAY = 1;
const THREE_DAYS = 3;
const SEVEN_DAYS = 7;

export const formatIsoStringDate = (stringDate: string) =>
  stringDate.slice(0, stringDate.indexOf('T'));

export const hoursArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24,
];

export const hoursArrayString = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

export const calendarColors: any = {
  red: { dark: '#ef9a9a', light: '#e53935' },
  pink: { dark: '#f48fb1', light: '#d81b60' },
  purple: { dark: '#ce93d8', light: '#8e24aa' },
  'deep purple': { dark: '#b39ddb', light: '#5e35b1' },
  indigo: { dark: '#9fa8da', light: '#3949ab' },
  blue: { dark: '#90caf9', light: '#1e88e5' },
  'light blue': { dark: '#81d4fa', light: '#039be5' },
  cyan: { dark: '#80deea', light: '#00acc1' },
  teal: { dark: '#80cbc4', light: '#00897b' },
  green: { dark: '#a5d6a7', light: '#43a047' },
  'light green': { dark: '#c5e1a5', light: '#7cb342' },
  yellow: { dark: '#fff59d', light: '#fdd835' },
  amber: { dark: '#ffe082', light: '#ffb300' },
  orange: { dark: '#ffcc80', light: '#fb8c00' },
  'deep orange': { dark: '#ffab91', light: '#f4511e' },
  brown: { dark: '#bcaaa4', light: '#6d4c41' },
  'blue grey': { dark: '#b0bec5', light: '#546e7a' },
};

export const parseEventColor = (
  colorString: string,
  isDark?: boolean
): string =>
  calendarColors[colorString]
    ? calendarColors[colorString][isDark ? 'dark' : 'light']
    : colorString;

export const daysText = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const daysTextSundayStart = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export const calculateOneDay = (date: DateTime): DateTime => {
  return date;
};

const calculateMondayStartWeekDay = (
  date: DateTime,
  calendarView: CALENDAR_VIEW
): DateTime[] => {
  const days = [];
  const dayInWeek = Number(date.weekday);
  const startDate = date.minus({ days: dayInWeek - 1 });

  if (calendarView === CALENDAR_VIEW.MONTH) {
    if (dayInWeek === 0) {
      for (let i = 6; i > 0; i--) {
        days.push(date.minus({ days: i }));
      }
      days.push(date);
    } else {
      days.push(startDate);
      for (let i = 1; i < 7; i++) {
        days.push(startDate.plus({ days: i }));
      }
    }
  } else {
    for (let i = 0; i < 7; i++) {
      days.push(startDate.plus({ days: i }));
    }
  }

  return days;
};

const calculateSundayStartWeekDay = (
  date: DateTime,
  calendarView: CALENDAR_VIEW
): DateTime[] => {
  const days = [];
  const dayInWeek = date.weekday;
  const startDate =
    dayInWeek === 7
      ? date.plus({ days: dayInWeek - 7 })
      : date.minus({ days: dayInWeek });

  if (calendarView === CALENDAR_VIEW.MONTH) {
    if (dayInWeek === 7) {
      for (let i = 6; i > 0; i--) {
        days.push(date.minus({ days: i }));
      }
      days.push(date);
    } else {
      days.push(startDate);
      for (let i = 1; i < 7; i++) {
        days.push(startDate.plus({ days: i }));
      }
    }
  } else {
    for (let i = 0; i < 7; i++) {
      days.push(startDate.plus({ days: i }));
    }
  }

  return days;
};

export const getWeekDays = (
  date: DateTime,
  calendarView: CALENDAR_VIEW,
  weekDayStart: WEEKDAY_START,
  setSelectedDate?: any
): DateTime[] => {
  // Set state
  if (setSelectedDate && calendarView !== CALENDAR_VIEW.MONTH) {
    setSelectedDate(date);
  }

  if (weekDayStart === WEEKDAY_START.MONDAY) {
    return calculateMondayStartWeekDay(date, calendarView);
  } else {
    return calculateSundayStartWeekDay(date, calendarView);
  }
};

export const getThreeDays = (
  date: DateTime,
  setSelectedDate: any,
  isGoingForward?: boolean | null,
  isChangingView?: boolean
): DateTime[] => {
  const days = [];

  if (isChangingView) {
    for (let i = 0; i <= 2; i++) {
      days.push(date.plus({ days: i }));
    }

    // Set state
    if (setSelectedDate) {
      setSelectedDate(days[0]);
    }
  } else if (isGoingForward === null || isGoingForward === undefined) {
    for (let i = 0; i <= 2; i++) {
      days.push(date.plus({ days: i }));
    }
  } else if (isGoingForward) {
    for (let i = 1; i <= 3; i++) {
      days.push(date.plus({ days: i }));
    }
  } else {
    for (let i = 3; i > 0; i--) {
      days.push(date.minus({ days: i }));
    }
  }

  if (!isChangingView) {
    // Set state
    if (setSelectedDate) {
      setSelectedDate(days[1]);
    }
  }

  return days;
};

export const getDaysNum = (calendarView: CALENDAR_VIEW): number => {
  switch (calendarView) {
    case CALENDAR_VIEW.WEEK:
      return SEVEN_DAYS;
    case CALENDAR_VIEW.THREE_DAYS:
      return THREE_DAYS;
    case CALENDAR_VIEW.DAY:
      return ONE_DAY;
    default:
      return SEVEN_DAYS;
  }
};

const getOneDay = (date: DateTime, setSelectedDate: any): DateTime[] => {
  const refDate = calculateOneDay(date);

  // Set state
  if (setSelectedDate) {
    setSelectedDate(refDate);
  }

  return [refDate];
};

export const calculateAgendaDays = (refDate: DateTime): DateTime[] => {
  const firstDayInMonth: DateTime = LuxonHelper.getFirstDayOfMonth(refDate);
  const daysInMonth: number = refDate.daysInMonth;
  const monthDays: DateTime[] = [];

  // Add missing days to month view
  for (let i = 0; i < daysInMonth; i += 1) {
    const day: DateTime = firstDayInMonth.plus({ days: i });
    monthDays.push(day);
  }

  return monthDays;
};

export const calculateMonthDays = (
  date: DateTime,
  weekDayStart: WEEKDAY_START
): DateTime[] => {
  const FIVE_WEEKS_DAYS_COUNT = 36;
  // Get reference date for calculating new month

  // Get first week of current month
  const firstDayOfCurrentMonth: DateTime = LuxonHelper.getFirstDayOfMonth(date);

  const firstWeekOfCurrentMonth: DateTime[] = getWeekDays(
    firstDayOfCurrentMonth,
    CALENDAR_VIEW.WEEK,
    weekDayStart,
    undefined
  );

  const monthDays: DateTime[] = firstWeekOfCurrentMonth;

  // Add missing days to month view
  for (let i = 1; i < FIVE_WEEKS_DAYS_COUNT; i += 1) {
    const day: DateTime = firstWeekOfCurrentMonth[6].plus({ days: i });
    monthDays.push(day);
  }

  return monthDays;
};

export const getAgendaDays = (
  date: DateTime,
  setSelectedDate: any
): DateTime[] => {
  const monthDays: DateTime[] = calculateAgendaDays(date);

  // Set state
  if (setSelectedDate) {
    setSelectedDate(date);
  }

  return monthDays;
};

export const getMonthDays = (
  date: DateTime,
  setSelectedDate: any,
  weekDayStart: WEEKDAY_START,
  isChangingView?: boolean
) => {
  const monthDays: DateTime[] = calculateMonthDays(date, weekDayStart);

  // Set state
  if (setSelectedDate && !isChangingView) {
    setSelectedDate(monthDays[15]);
  }

  return monthDays;
};

// TODO dark theme support for parsing colors
// export const mapCalendarColors = (calendars: any) => {
//   const result: any = {};
//   for (const calendar of calendars) {
//     result[calendar.id] = {
//       color: {
//         light: calendar.color.light,
//         dark: calendar.color.dark,
//       },
//     };
//   }
//
//   return result;
// };

export const parseToDate = (item: string | DateTime): DateTime =>
  typeof item === 'string' ? DateTime.fromISO(item) : item;

export const parseDateToString = (item: string | DateTime): string =>
  typeof item === 'string' ? item : item.toString();

export const checkIfSwipingForward = (
  oldIndex: number,
  newIndex: number
): boolean =>
  (oldIndex === 0 && newIndex === 1) ||
  (oldIndex === 1 && newIndex === 2) ||
  (oldIndex === 2 && newIndex === 0);

export const chooseSelectedDateIndex = (
  calendarView: CALENDAR_VIEW
): number => {
  switch (calendarView) {
    case CALENDAR_VIEW.MONTH:
      return 15;
    case CALENDAR_VIEW.AGENDA:
      return 15;
    case CALENDAR_VIEW.WEEK:
      return 2;
    case CALENDAR_VIEW.THREE_DAYS:
      return 0;
    case CALENDAR_VIEW.DAY:
      return 0;
    default:
      return 2;
  }
};

export const getCalendarDays = (
  calendarView: any,
  date: any,
  weekDayStart:any,
  setSelectedDate?: any,
  isChangingView?: any,
): DateTime[] => {
  switch (calendarView) {
    case CALENDAR_VIEW.WEEK:
      return getWeekDays(date, calendarView, weekDayStart, setSelectedDate);
    case CALENDAR_VIEW.THREE_DAYS:
      return getThreeDays(date, setSelectedDate, undefined, isChangingView);
    case CALENDAR_VIEW.DAY:
      return getOneDay(date, setSelectedDate);
    case CALENDAR_VIEW.MONTH:
      return getMonthDays(date, setSelectedDate, weekDayStart, isChangingView);
    case CALENDAR_VIEW.AGENDA:
      return getAgendaDays(date, setSelectedDate);
    default:
      return getWeekDays(date, calendarView, setSelectedDate);
  }
};

const getReferenceDate = (
  direction: CALENDAR_NAVIGATION_DIRECTION,
  calendarView: CALENDAR_VIEW,
  calendarDays: DateTime[]
): DateTime => {
  if (direction === CALENDAR_NAVIGATION_DIRECTION.TODAY) {
    return DateTime.now();
  }

  if (calendarView === CALENDAR_VIEW.THREE_DAYS) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return getArrayEnd(calendarDays).plus({ days: 1 });
    } else {
      return getArrayStart(calendarDays).minus({ days: 3 });
    }
  }

  if (
    calendarView === CALENDAR_VIEW.WEEK ||
    calendarView === CALENDAR_VIEW.DAY
  ) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return getArrayEnd(calendarDays).plus({ days: 1 });
    } else {
      return getArrayStart(calendarDays).minus({ days: 1 });
    }
  }

  if (
    calendarView === CALENDAR_VIEW.MONTH ||
    calendarView === CALENDAR_VIEW.AGENDA
  ) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return calendarDays[15].plus({ months: 1 });
    } else {
      return calendarDays[15].minus({ months: 1 });
    }
  }

  return DateTime.now();
};

export const calculateCalendarDays = (
  direction: CALENDAR_NAVIGATION_DIRECTION,
  calendarDays: DateTime[],
  calendarView: CALENDAR_VIEW,
  setSelectedDate: any,
  weekDayStart: WEEKDAY_START
): DateTime[] => {
  return getCalendarDays(
    calendarView,
    getReferenceDate(direction, calendarView, calendarDays),
    weekDayStart,
    setSelectedDate
  );
};

export const getRange = (calendarDays: DateTime[]) => {
  return {
    rangeFrom: calendarDays?.[0]
      ?.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toUTC()
      .toString(),
    rangeTo: calendarDays?.[calendarDays?.length - 1]
      ?.set({ hour: 23, minute: 59, second: 59, millisecond: 59 })
      ?.toUTC()
      .toString(),
  };
};
