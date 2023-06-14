import {
  CALENDAR_NAVIGATION_DIRECTION,
  CALENDAR_VIEW,
  WEEKDAY_START,
} from '../../common/enums';
import { DateTime } from 'luxon';
import { calculateCalendarDays, getWeekDays } from '../../utils/calendarDays';

// @ts-ignore
import assert from 'assert';

const truncateDate = (date: DateTime): DateTime =>
  date.set({ minute: 0, second: 0, millisecond: 0 });

export const getWeekDaysMock = (date = '2021-11-15T10:52:09.797') => {
  const result: DateTime[] = [];

  for (let i = 0; i < 7; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getWeekDaysMockStartingSunday = (
  date = '2021-11-14T10:52:09.797'
) => {
  const result: DateTime[] = [];

  for (let i = 0; i < 7; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getMonthDaysMock = (date = '2021-10-27T10:52:09.797') => {
  const result: DateTime[] = [];

  for (let i = 0; i < 43; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
export const getMonthDaysMockStartingSunday = (
  date = '2021-10-26T10:52:09.797'
) => {
  const result: DateTime[] = [];

  for (let i = 0; i < 43; i += 1) {
    result.push(DateTime.fromISO(date).plus({ days: i }));
  }

  return result;
};
const getAgendaDaysMock = () => {
  const result: DateTime[] = [];

  for (let i = 0; i < 32; i += 1) {
    result.push(DateTime.fromISO('2021-10-01T10:52:09.797').plus({ days: i }));
  }

  return result;
};

const hasTodayDate = (result: DateTime[]) => {
  const todayDate: DateTime = DateTime.now();

  let hasTodayDate = false;

  result.forEach((day) => {
    if (
      day.day === todayDate.day &&
      day.year === todayDate.year &&
      day.month === todayDate.month
    ) {
      hasTodayDate = true;
    }
  });

  return hasTodayDate;
};

describe(`calculateCalendarDays`, function () {
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.DAY} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      [refDate],
      CALENDAR_VIEW.DAY,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate.plus({ days: 1 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.DAY} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      [refDate],
      CALENDAR_VIEW.DAY,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate.minus({ days: 1 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.DAY} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      [refDate.plus({ days: 1 })],
      CALENDAR_VIEW.DAY,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.THREE_DAYS} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      [refDate, refDate.plus({ days: 1 }), refDate.plus({ days: 2 })],
      CALENDAR_VIEW.THREE_DAYS,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate.plus({ days: 3 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.THREE_DAYS} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      [refDate, refDate.plus({ days: 1 }), refDate.plus({ days: 2 })],
      CALENDAR_VIEW.THREE_DAYS,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate.minus({ days: 3 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.THREE_DAYS} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY}`, function () {
    const refDate: DateTime = DateTime.now();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      [
        refDate.plus({ days: 1 }),
        refDate.plus({ days: 2 }),
        refDate.plus({ days: 3 }),
      ],
      CALENDAR_VIEW.THREE_DAYS,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refDate).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD}`, function () {
    const refWeek: DateTime[] = getWeekDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(result[0].weekday, 1); // monday
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refWeek[0].plus({ days: 7 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS}`, function () {
    const refWeek: DateTime[] = getWeekDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(result[0].weekday, 1); // monday
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refWeek[0].minus({ days: 7 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY}`, function () {
    const refWeek: DateTime[] = getWeekDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(result[0].weekday, 1); // monday
    const containsTodayDate: boolean = hasTodayDate(result);

    assert.equal(containsTodayDate, true);
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD} starting Sunday`, function () {
    const refWeek: DateTime[] = getWeekDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.SUNDAY
    );

    assert.equal(result[0].weekday, 7); // sunday
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refWeek[0].plus({ days: 7 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS} starting Sunday`, function () {
    const refWeek: DateTime[] = getWeekDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.SUNDAY
    );

    assert.equal(result[0].weekday, 7); // sunday
    assert.equal(
      truncateDate(result[0]).toString(),
      truncateDate(refWeek[0].minus({ days: 7 })).toString()
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.WEEK} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY} starting Sunday`, function () {
    const refWeek: DateTime[] = getWeekDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      refWeek,
      CALENDAR_VIEW.WEEK,
      null,
      WEEKDAY_START.SUNDAY
    );

    assert.equal(result[0].weekday, 7); // sunday
    const containsTodayDate: boolean = hasTodayDate(result);

    assert.equal(containsTodayDate, true);
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS}`, function () {
    const refMonth: DateTime[] = getMonthDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(result[0].weekday, 1); // monday
    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[16].minus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS} starting Sunday`, function () {
    const refMonth: DateTime[] = getMonthDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.SUNDAY
    );

    assert.equal(result[0].weekday, 7); // sunday
    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[16].minus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD}`, function () {
    const refMonth: DateTime[] = getMonthDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(result[0].weekday, 1); // monday
    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[15].plus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD} starting sunday`, function () {
    const refMonth: DateTime[] = getMonthDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.SUNDAY
    );

    assert.equal(result[0].weekday, 7); // sunday
    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[15].plus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY}`, function () {
    const refMonth: DateTime[] = getMonthDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.MONDAY
    );

    const containsTodayDate: boolean = hasTodayDate(result);

    assert.equal(result[0].weekday, 1); // monday
    assert.equal(containsTodayDate, true);
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.MONTH} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY} starting Sunday`, function () {
    const refMonth: DateTime[] = getMonthDaysMockStartingSunday();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      refMonth,
      CALENDAR_VIEW.MONTH,
      null,
      WEEKDAY_START.SUNDAY
    );

    const containsTodayDate: boolean = hasTodayDate(result);

    assert.equal(result[0].weekday, 7); // sunday
    assert.equal(containsTodayDate, true);
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.AGENDA} Direction: ${CALENDAR_NAVIGATION_DIRECTION.BACKWARDS}`, function () {
    const refMonth: DateTime[] = getAgendaDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      refMonth,
      CALENDAR_VIEW.AGENDA,
      null,
      WEEKDAY_START.MONDAY
    );
    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[16].minus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.AGENDA} Direction: ${CALENDAR_NAVIGATION_DIRECTION.FORWARD}`, function () {
    const refMonth: DateTime[] = getAgendaDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      refMonth,
      CALENDAR_VIEW.AGENDA,
      null,
      WEEKDAY_START.MONDAY
    );

    assert.equal(
      truncateDate(result[15]).month,
      truncateDate(refMonth[15].plus({ months: 1 })).month
    );
  });
  it(`calculateCalendarDays View: ${CALENDAR_VIEW.AGENDA} Direction: ${CALENDAR_NAVIGATION_DIRECTION.TODAY}`, function () {
    const refMonth: DateTime[] = getAgendaDaysMock();
    const result: DateTime[] = calculateCalendarDays(
      CALENDAR_NAVIGATION_DIRECTION.TODAY,
      refMonth,
      CALENDAR_VIEW.AGENDA,
      null,
      WEEKDAY_START.MONDAY
    );

    const containsTodayDate: boolean = hasTodayDate(result);

    assert.equal(containsTodayDate, true);
  });
  it('getWeekDays func: Monday', function () {
    const refDate: DateTime = DateTime.fromISO('2021-11-08T18:40:00.000Z');

    const result: DateTime[] = getWeekDays(
      refDate,
      CALENDAR_VIEW.WEEK,
      WEEKDAY_START.MONDAY,
      null
    );

    assert.equal(result[0].toISODate(), '2021-11-08');
    assert.equal(result[result.length - 1].toISODate(), '2021-11-14');
  });
  it('getWeekDays func: Thursday', function () {
    const refDate: DateTime = DateTime.fromISO('2021-11-11T18:40:00.000Z');

    const result: DateTime[] = getWeekDays(
      refDate,
      CALENDAR_VIEW.WEEK,
      WEEKDAY_START.MONDAY,
      null
    );

    assert.equal(result[0].toISODate(), '2021-11-08');
    assert.equal(result[result.length - 1].toISODate(), '2021-11-14');
  });
  it('getWeekDays func: Sunday', function () {
    const refDate: DateTime = DateTime.fromISO('2021-11-14T18:40:00.000Z');

    const result: DateTime[] = getWeekDays(
      refDate,
      CALENDAR_VIEW.WEEK,
      WEEKDAY_START.MONDAY,
      null
    );

    assert.equal(result[0].toISODate(), '2021-11-08');
    assert.equal(result[result.length - 1].toISODate(), '2021-11-14');
  });
});
