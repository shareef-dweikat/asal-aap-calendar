import { DateTime } from 'luxon';
import KalendLayout from './views/main';

export enum CALENDAR_VIEW {
  AGENDA = 'agenda',
  WEEK = 'week',
  DAY = 'day',
  THREE_DAYS = 'threeDays',
  MONTH = 'month',
}

export enum EVENT_TYPE {
  NORMAL = 'normal',
  MONTH = 'month',
  AGENDA = 'agenda',
  HEADER = 'header',
  SHOW_MORE_MONTH = 'showMoreMonth',
}

export enum CALENDAR_NAVIGATION_DIRECTION {
  FORWARD = 'forward',
  BACKWARDS = 'backwards',
  TODAY = 'today',
}

export enum WEEKDAY_START {
  MONDAY = 'MONDAY',
  SUNDAY = 'SUNDAY',
  UNKNOWN = 'UNKNOWN',
}

export enum TIME_FORMAT {
  H_24 = '24',
  H_12 = '12',
}

export interface CalendarEvent {
  id: any;
  startAt: string;
  endAt: string;
  timezoneStartAt?: string;
  timezoneEndAt?: string;
  summary: string;
  color: string;
  allDay?: boolean;
  internalID?: string;
  daySpawns?: string[];
  [key: string]: any;
}

export interface Config {
  timeFormat: TIME_FORMAT;
  weekDayStart: WEEKDAY_START;
  isDark: boolean;
  hourHeight: number;
  timezone: string;
  disableMobileDropdown: boolean;
  disabledViews?: CALENDAR_VIEW[];
  calendarIDsHidden?: string[] | null;
  hasWorker?: boolean;
}

export interface EventLayoutData {
  event: CalendarEvent;
  width: number;
  offsetLeft: number;
  offsetTop: number;
  height: number;
  zIndex: number;
}

export interface LayoutRequestData {
  events: CalendarEvent[];
  width: number;
  height: number;
  calendarDays: DateTime[] | string[];
  config: Config;
  selectedView: CALENDAR_VIEW;
  isMobile?: boolean;
}

export interface LayoutResult {
  selectedView: string;
  positions?: any[];
  overflowingEvents?: any;
  headerOffsetTop?: number;
  calendarDays?: DateTime[];
  headerPositions?: any;
  normalPositions?: any;
  events?: any;
}

export default KalendLayout;
