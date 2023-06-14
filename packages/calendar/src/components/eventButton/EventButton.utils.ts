import { CalendarEvent, EventLayout } from '../../common/interface';
import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../../common/enums';
import { MONTH_EVENT_HEIGHT } from '../../common/constants';
import { formatDateTimeToString } from '../../utils/common';

export const createTempMonthEventsLayout = (): EventLayout => {
  return {
    offsetLeft: 0,
    offsetTop: 0,
    width: '90%',
    height: MONTH_EVENT_HEIGHT,
    zIndex: 1,
    border: 'none',
    meta: {
      showTime: false,
      isFullWidth: true,
      centerText: true,
    },
  };
};

export interface EventButtonInitialState {
  dragging: boolean;
  initialTop: number;
  initialLeft: number;
  offsetTop: number | null;
  offsetLeft: number | null;
  xPosition: number;
  eventHasChanged: boolean;
  width: number | null;
  height: number | null;
  zIndex: number;
  border: string;
  meta: any;
  isDragging: boolean;
  endAt: string | undefined;
}

export const eventButtonInitialState: EventButtonInitialState = {
  dragging: false,
  initialTop: 0,
  initialLeft: 0,
  offsetTop: null,
  offsetLeft: null,
  xPosition: 0,
  eventHasChanged: false,
  width: null,
  height: null,
  zIndex: 2,
  border: '',
  meta: {},
  isDragging: false,
  endAt: undefined,
};

export const initEventButtonPosition = (
  type: EVENT_TYPE,
  day: DateTime | undefined,
  event: CalendarEvent,
  store: any,
  setLayout: any,
  index?: number
) => {
  const { daysViewLayout, headerLayout, monthLayout } = store;

  if (type === EVENT_TYPE.NORMAL && day) {
    const formattedDayString: string = formatDateTimeToString(day);
    const eventLayoutValue: any =
      daysViewLayout[formattedDayString]?.[event.id];
    if (eventLayoutValue) {
      setLayout(eventLayoutValue);
    }
  } else if (type === EVENT_TYPE.HEADER) {
    if (store.headerLayout) {
      const headerLayoutValue: any = headerLayout[event.id];
      if (headerLayoutValue) {
        setLayout(headerLayoutValue);
      }
    }
  } else if (type === EVENT_TYPE.MONTH) {
    if (store.monthLayout && index !== undefined) {
      const monthLayoutValue: any = monthLayout?.[index]?.[event.id];

      if (monthLayoutValue) {
        setLayout(monthLayoutValue);
      }
    }
  } else {
    setLayout(createTempMonthEventsLayout());
  }
};

export const disableTouchDragging = (e: any): boolean => {
  const touches: any = e.nativeEvent?.touches?.[0];

  return !!touches;
};
