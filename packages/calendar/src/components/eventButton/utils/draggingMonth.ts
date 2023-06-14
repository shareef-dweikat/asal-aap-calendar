import { CalendarEvent } from '../../../common/interface';
import { DateTime } from 'luxon';

export const calculateMonthEventAfterDrag = (
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

export const onMoveMonthEvent = (
  e: any,
  height: number,
  draggingRef: any,
  day: DateTime,
  columnWidth: number,
  width: number,
  xShiftIndexRef: any,
  yShiftIndexRef: any,
  eventWasChangedRef: any,
  offsetLeftRef: any,
  offsetTopRef: any,
  setState: any,
  index: number
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
    x = e.clientX - tableElementRect.x;
    y = e.clientY - tableElementRect.y;
  }

  const yReal = yTable - index * columnHeight;

  // prevent free dragging across columns with simple recalculation for
  const columnShiftX = Math.floor(x / columnWidth);
  const columnShiftY = Math.floor(yReal / columnHeight);

  const columnShiftXParsed = parseInt((xTable / columnWidth).toString());
  const columnShiftYParsed = parseInt((yTable / columnHeight).toString());

  const columnShiftTableX = Math.round(xTable / columnWidth);

  if (
    columnShiftTableX * columnWidth >= width ||
    xTable < 0 ||
    columnShiftY * columnHeight >= height ||
    yTable < 0 ||
    y >= height
  ) {
    return;
  }

  xShiftIndexRef.current = columnShiftXParsed;
  yShiftIndexRef.current = columnShiftYParsed;

  setState('offsetLeft', columnShiftX * columnWidth + 1);
  setState('offsetTop', columnShiftY * columnHeight);
  eventWasChangedRef.current = true;
  offsetLeftRef.current = x;
  offsetTopRef.current = y;
};
