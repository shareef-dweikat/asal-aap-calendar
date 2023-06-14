import {
  CALENDAR_OFFSET_LEFT,
  EVENT_MIN_HEIGHT,
} from '../../../common/constants';
import { CalendarEvent, Config } from '../../../common/interface';
import { DateTime } from 'luxon';
import { UTC_TIMEZONE } from '../../../layout/constants';
import {
  getDateFromPosition,
  getHourHeightPartialUnit,
} from '../../daysViewTable/daysViewOneDay/DaysViewOneDay';
import { isEventFloating } from '../../../layout/utils/Helper';
import Datez from 'datez';

export const calculateNewTimeWeekDay = (
  offsetTopValue: number,
  offsetLeftValue: number,
  xShiftIndexRef: any,
  event: CalendarEvent,
  hourHeight: number,
  config: Config
): CalendarEvent => {
  const originalStartAtDateTime = Datez.setZone(
    DateTime.fromISO(event.startAt),
    isEventFloating(event) ? UTC_TIMEZONE : config.timezone
  );
  const originalEndAtDateTime = Datez.setZone(
    DateTime.fromISO(event.endAt),
    isEventFloating(event) ? UTC_TIMEZONE : config.timezone
  );

  let goingForward = false;
  if (offsetLeftValue >= 0) {
    goingForward = true;
  } else {
    goingForward = false;
  }

  let newDay: DateTime;

  if (goingForward) {
    newDay = originalStartAtDateTime.plus({ days: xShiftIndexRef.current });
  } else {
    newDay = originalStartAtDateTime.minus({
      days: Math.abs(xShiftIndexRef.current),
    });
  }

  const diffInMinutes: number | undefined = originalEndAtDateTime
    .diff(originalStartAtDateTime, 'minutes')
    .toObject().minutes;
  const minutesOffset: number = (offsetTopValue / hourHeight) * 60;

  // add minutes calculated from new offset top
  let newStartAt: DateTime = originalStartAtDateTime
    .set({
      year: newDay.year,
      day: newDay.day,
      month: newDay.month,
      hour: 0,
      minute: 0,
    })
    .plus({ minutes: minutesOffset });

  const topPosition = newStartAt.set({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const offsetTopPosition = topPosition.offset;

  // make offset correction when top position is in different DST zone than
  // startDate
  if (newStartAt.offset !== offsetTopPosition) {
    if (offsetTopPosition > newStartAt.offset) {
      newStartAt = newStartAt.plus({
        minutes: offsetTopPosition - newStartAt.offset,
      });
    } else {
      newStartAt = newStartAt.minus({
        minutes: newStartAt.offset - offsetTopPosition,
      });
    }
  }

  // set correct endAt
  const newEndAt: DateTime = newStartAt.plus({ minutes: diffInMinutes });

  return {
    ...event,
    startAt: newStartAt.toUTC().toString(),
    endAt: newEndAt.toUTC().toString(),
  };
};

export const onMoveNormalEvent = (
  e: any,
  draggingRef: any,
  day: DateTime,
  columnWidth: number,
  width: number,
  eventWasChangedRef: any,
  xShiftIndexRef: any,
  offsetLeftRef: any,
  offsetTopRef: any,
  setState: any
) => {
  if (!draggingRef.current) {
    return;
  }

  if (!day) {
    return;
  }

  const tableElement: any = document.querySelector('.Kalend__Calendar__table');
  const tableElementRect = tableElement.getBoundingClientRect();

  // Get column element for day, where event is placed
  const dayElement: any = document.getElementById(
    `Kalend__day__${day.toString()}`
  );
  if (!dayElement) {
    return;
  }
  const dayElementRect = dayElement.getBoundingClientRect();

  const touches: any = e.nativeEvent?.touches?.[0];

  // set basic coordinates from movement
  let x: number;
  let y: number;

  // handle touch movement
  if (touches) {
    x = touches.clientX - dayElementRect.x;
    y = touches.clientY - dayElementRect.top;
  } else {
    // handle mouse movement
    // calculate x and y coordinates while following mouse move
    x = e.clientX - dayElementRect.x;
    y = e.clientY - dayElementRect.top;
  }

  // prevent free dragging across columns with simple recalculation for
  const columnShift = Math.floor(x / columnWidth);

  const xTable = e.clientX - tableElementRect.x;

  const columnShiftTable = Math.round(xTable / columnWidth);

  // restrict draggable space for timetable
  if (y < 0) {
    return;
  }

  eventWasChangedRef.current = true;
  setState('offsetTop', y - EVENT_MIN_HEIGHT);
  offsetTopRef.current = y - EVENT_MIN_HEIGHT;

  // prevent overflowing on x-axis
  if (
    columnShiftTable * columnWidth >= width ||
    xTable - CALENDAR_OFFSET_LEFT < 0
  ) {
    return;
  }

  xShiftIndexRef.current = columnShift;
  setState('offsetLeft', columnShift * columnWidth);
  offsetLeftRef.current = x;
};

export const onResizeNormalEvent = (
  e: any,
  endAtRef: any,
  day: DateTime,
  config: Config,
  offsetTop: number,
  height: number,
  setState: any
) => {
  if (!day) {
    return;
  }

  // Get column element for day, where event is placed
  const dayElement: any = document.getElementById(
    `Kalend__day__${day.toString()}`
  );
  if (!dayElement) {
    return;
  }
  const dayElementRect = dayElement.getBoundingClientRect();

  const touches: any = e.nativeEvent?.touches?.[0];

  // set basic coordinates from movement
  let y: number;

  // handle touch movement
  if (touches) {
    y = touches.clientY - dayElementRect.top;
  } else {
    // handle mouse movement
    y = e.clientY - dayElementRect.top;
  }

  // restrict draggable space for timetable
  if (y < 0) {
    return;
  }

  const yString = (y / getHourHeightPartialUnit(config)).toFixed(0).split('.');
  const yValue = Number(yString[0]) * getHourHeightPartialUnit(config);
  const endAtValue = getDateFromPosition(
    yValue / config.hourHeight,
    day,
    config
  );

  setState('height', Number(((y - offsetTop) / 15).toFixed(0)) * 15);
  setState('endAt', endAtValue);
  endAtRef.current = endAtValue.toUTC().toString();
};
