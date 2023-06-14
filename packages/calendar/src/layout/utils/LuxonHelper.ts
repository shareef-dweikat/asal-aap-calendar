import { DateTime, DurationObjectUnits } from 'luxon';
import { FLOATING_DATETIME, UTC_TIMEZONE } from '../constants';
import Datez from 'datez';

export const LuxonHelper: any = {
  isSameDay: (dateA: DateTime, dateB: DateTime): boolean => {
    return (
      dateA.year === dateB.year &&
      dateA.month === dateB.month &&
      dateA.day === dateB.day
    );
  },

  differenceInDays: (start: DateTime, end: DateTime): number => {
    const diffInDaysObj: DurationObjectUnits = end
      .diff(start, 'hours')
      .toObject();

    const diffInHours = diffInDaysObj.hours;

    if (diffInHours) {
      if (diffInHours < 24) {
        return 0;
      } else if (diffInHours === 24) {
        return 1;
      } else {
        return Number((diffInHours / 24).toFixed(0));
      }
    }

    return 0;
  },
};

export const parseToDateTime = (
  date: DateTime | string,
  zone: string,
  isFloating?: boolean
): DateTime => {
  const dateString = typeof date === 'string' ? date : date.toString();

  const isFloatingDatetime = zone === FLOATING_DATETIME;

  // Adjust date with timezone so when converted to UTC it represents correct value with fixed time
  if (isFloatingDatetime || isFloating) {
    const dateFloating = DateTime.fromISO(dateString, {
      zone: UTC_TIMEZONE,
    });

    return dateFloating.toUTC();
  }

  const thisDate = DateTime.fromISO(dateString);

  return Datez.setZone(thisDate, zone);
};
