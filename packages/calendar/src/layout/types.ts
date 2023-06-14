import { CalendarEvent, EventLayoutData } from './index';

export interface CalendarEventRowExtended extends CalendarEvent {
  daySpawns?: string[];
  originDate: string;
}

export interface KeyedEvents {
  [key: string]: CalendarEvent[];
}

export interface KeyedEventsExtended {
  [key: string]: CalendarEventRowExtended[];
}

export interface LayoutEvent {
  event: CalendarEvent;
  offsetTop: number;
  eventHeight: number;
  itemLastCoordinate: number;
}

export type GroupedLayouts = LayoutEvent[][];

export interface DayViewResult {
  dateKey: string;
  event: CalendarEvent;
  height: number;
  width: number;
  offsetLeft: number;
  offsetTop: number;
  zIndex: number;
  meta: {
    isFullWidth: boolean;
    showTime: boolean;
    centerText: boolean;
  };
}

export interface KeyedDayViewResult {
  [key: string]: DayViewResult[];
}

export interface ItemRowLayoutResult {
  positions: EventLayoutData[];
  overflowingEvents: CalendarEvent[];
  headerOffsetTop: number;
}

export interface RowLayoutResult {
  positions: EventLayoutData[][];
  overflowingEvents: CalendarEvent[];
  headerOffsetTop: number;
}
