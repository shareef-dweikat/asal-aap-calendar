import { CALENDAR_OFFSET_LEFT } from '../../../common/constants';
import { CalendarEvent } from '../../../common/interface';
import { DateTime } from 'luxon';

export const calculateHeaderAfterDrag = (
  calendarDays: DateTime[],
  event: CalendarEvent,
  xShiftIndexRef: any
): CalendarEvent => {
  const originalStartAtDateTime = DateTime.fromISO(event.startAt);
  const originalEndAtDateTime = DateTime.fromISO(event.endAt);

  const newDay: DateTime = calendarDays.map(
    (calendarDay: DateTime) => calendarDay
  )[xShiftIndexRef.current];

  const diffInMinutes: number | undefined = originalEndAtDateTime
    .diff(originalStartAtDateTime, 'minutes')
    .toObject().minutes;

  const newStartAt: DateTime = originalStartAtDateTime.set({
    year: newDay.year,
    day: newDay.day,
    month: newDay.month,
    hour: originalStartAtDateTime.hour,
    minute: originalStartAtDateTime.minute,
  });

  // set correct endAt
  const newEndAt: DateTime = newStartAt.plus({ minutes: diffInMinutes });

  return {
    ...event,
    startAt: newStartAt.toUTC().toString(),
    endAt: newEndAt.toUTC().toString(),
  };
};

export const onMoveHeader = (
  e: any,
  columnWidth: number,
  width: number,
  xShiftIndexRef: any,
  offsetLeftRef: any,
  eventWasChangedRef: any,
  setState: any
) => {
  const tableElement: any = document.querySelector('.Kalend__Calendar__table');
  const tableElementRect = tableElement.getBoundingClientRect();

  const touches: any = e.nativeEvent?.touches?.[0];

  // set basic coordinates from movement
  let x: number;

  // handle touch movement
  if (touches) {
    x = touches.clientX - tableElementRect.x;
  } else {
    // calculate x coordinates while following mouse move
    x = e.clientX - tableElementRect.x - CALENDAR_OFFSET_LEFT;
  }

  // prevent free dragging across columns with simple recalculation for
  const columnShift = Math.floor(x / columnWidth);

  const xTable = e.clientX - tableElementRect.x; //- CALENDAR_OFFSET_LEFT;

  const columnShiftTable = Math.round(xTable / columnWidth);

  if (
    columnShiftTable * columnWidth >= width ||
    xTable < 0 ||
    xTable < columnWidth / 2
  ) {
    return;
  }

  // prevent event overflowing on last day
  // TODO reset back after moving left again

  xShiftIndexRef.current = columnShift;
  setState('offsetLeft', columnShift * columnWidth + 1); // add 1 because 0
  // was not working
  eventWasChangedRef.current = true;
  offsetLeftRef.current = x;
};
