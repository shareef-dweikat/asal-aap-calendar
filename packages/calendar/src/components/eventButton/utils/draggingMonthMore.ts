import { CalendarEvent } from '../../../common/interface';
import { DateTime } from 'luxon';

export const calculateMonthEventMoreAfterDrag = (
  calendarDays: DateTime[],
  yShiftIndexRef: any,
  xShiftIndexRef: any,
  event: CalendarEvent
): CalendarEvent => {
  // get new date from x, y coordinates

  // split calendarDays by rows
  const rowCalendarDays: DateTime[][] = [];

  let tempArray: DateTime[] = [];

  calendarDays.forEach((calendarDay: DateTime) => {
    if (
      tempArray.length === 7 ||
      (rowCalendarDays.length === 5 && tempArray.length === 6)
    ) {
      tempArray.push(calendarDay);
      rowCalendarDays.push(tempArray);
      tempArray = [];
    }

    tempArray.push(calendarDay);
  });

  // get correct row by y coordinate
  const matchingRow: DateTime[] = rowCalendarDays[yShiftIndexRef.current];

  // get day by x coordinate
  const matchingDay: DateTime = matchingRow[xShiftIndexRef.current];

  const originalStartAtDateTime = DateTime.fromISO(event.startAt);
  const originalEndAtDateTime = DateTime.fromISO(event.endAt);

  const diffInMinutes: number | undefined = originalEndAtDateTime
    .diff(originalStartAtDateTime, 'minutes')
    .toObject().minutes;

  const newStartAt: DateTime = originalStartAtDateTime.set({
    year: matchingDay.year,
    day: matchingDay.day,
    month: matchingDay.month,
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

export const onMoveMonthEventMore = (
  e: any,
  height: number,
  draggingRef: any,
  day: DateTime,
  width: number,
  xShiftIndexRef: any,
  yShiftIndexRef: any,
  eventWasChangedRef: any,
  offsetLeftRef: any,
  offsetTopRef: any,
  setState: any
) => {
  const columnHeight: number = height / 6;
  if (!draggingRef.current) {
    return;
  }

  if (!day) {
    return;
  }

  const tableElement: any = document.querySelector('.Kalend__Calendar__table');
  const tableElementRect = tableElement.getBoundingClientRect();
  const columnWidth = tableElementRect.width / 7;

  const xTable = e.clientX - tableElementRect.x;
  const yTable = e.clientY - tableElementRect.y;
  // Get column element for day, where event is placed

  const touches: any = e.nativeEvent?.touches?.[0];

  // set basic coordinates from movement
  let x: number;
  let y: number;

  // handle touch movement
  if (touches) {
    x = touches.clientX - tableElementRect.x;
    y = touches.clientY - tableElementRect.y;
  } else {
    // calculate x coordinates while following mouse move
    x = e.clientX; // - tableElementRect.x +
    y = e.clientY; //- tableElementRect.y + tableElementRect.left;
  }

  const columnShiftXParsed = parseInt((xTable / columnWidth).toString());
  const columnShiftYParsed = parseInt((yTable / columnHeight).toString());

  setState('width', tableElementRect.width / 7);

  // restrict dragging outside main table
  if (
    y <= tableElementRect.top ||
    y > tableElementRect.top + tableElementRect.height ||
    x <= tableElementRect.left ||
    x > tableElementRect.width + tableElementRect.left
  ) {
    return;
  }

  xShiftIndexRef.current = columnShiftXParsed;
  yShiftIndexRef.current = columnShiftYParsed;

  setState('offsetLeft', x);
  setState('offsetTop', y);

  eventWasChangedRef.current = true;
  offsetLeftRef.current = x;
  offsetTopRef.current = y;
};
