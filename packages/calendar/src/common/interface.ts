/* eslint-disable @typescript-eslint/no-unused-vars */
import { CALENDAR_VIEW, TIME_FORMAT, WEEKDAY_START } from './enums';
import { DateTime } from 'luxon';
import { OnPageChangeData } from '../index';
import { ReactNode } from 'react';

export interface Settings {
  selectedDate: string;
  selectedView: CALENDAR_VIEW;
  initialView: CALENDAR_VIEW;
  events: any;
  isDark?: boolean;
  hourHeight: number;
}

export enum CALENDAR_EVENT_TYPE {
  EVENT = 'EVENT',
  TASK = 'TASK',
}

export interface CalendarEvent {
  id: any;
  startAt: string;
  endAt: string;
  timezoneStartAt?: string;
  timezoneEndAt?: string;
  summary: string;
  color: string;
  type?: CALENDAR_EVENT_TYPE;
  internalID?: string; // for repeated event clones
  children?: {
    agendaView?: ReactNode;
    daysView?: ReactNode;
    monthView?: ReactNode;
  };
  [key: string]: any;
}

export interface EventLayoutMeta {
  showTime?: boolean;
  isFullWidth?: boolean;
  centerText?: boolean;
}

export interface NormalEventPosition {
  event: CalendarEvent;
  height: number;
  offsetTop: number;
  width: number;
  offsetLeft: number;
  zIndex: number;
  meta?: EventLayoutMeta;
  dateKey?: string;
}

export interface NewEventClickData {
  event: any;
  day: Date;
  hour: number;
  startAt?: string;
  endAt?: string;
  view: CALENDAR_VIEW;
}

export interface MonthViewWorkerResult {
  type: string;
  monthPositions: any;
  calendarDays: any;
  overflowingEvents: any;
}

export interface WorkerData {
  calendarDays: any;
  type: string;
  events: any;
  width: any;
  config: any;
  maxEventsVisible?: any;
  selectedView?: any;
  isMobile?: boolean;
  isDragging?: boolean;
}

export interface PageChangeData {
  rangeFrom: string;
  rangeTo: string;
  direction: string;
}

export interface EventStyle {
  position: string;
  height: number;
  width: string | number;
  top: number;
  left: number;
  backgroundColor: string;
  transition?: string;
  zIndex?: number;
  border: string;
  alignItems?: string;
  visibility: string;
  color: string;
}

export interface EventLayout {
  offsetTop: number;
  offsetLeft: number;
  width: number | string;
  height: number;
  zIndex: number;
  border: string;
  meta: EventLayoutMeta;
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
  hasExternalLayout: boolean;
  focusHour: number | null;
  showTimeLine: boolean;
  autoScroll: boolean;
  disabledDragging: boolean;
  newEventText?: string | null;
}

export interface KalendState {
  selectedView: CALENDAR_VIEW | null;
  calendarDays: DateTime[];
  range: OnPageChangeData;
  width: number;
  config: Config;
  isMobile: boolean;
  height: number;
  selectedDate: string;
}

export interface DraggingDisabledConditions {
  [key: string]: boolean | string | number;
}

// functions
export type OnPageChangeFunc = (data: PageChangeData) => void;
export type ShowMoreMonthFunc = (data: CalendarEvent[]) => void;
export type OnSelectViewFunc = (view: CALENDAR_VIEW) => void;
export type OnEventClickFunc = (data: CalendarEvent, e: any) => void;
export type OnEventDragFinishFunc = (
  prevEvent: CalendarEvent,
  updatedEvent: CalendarEvent,
  events: any,
  resetPosition?: any
) => void;
export type OnNewEventClickFunc = (data: NewEventClickData, e: any) => void;
export type OnStateChangeFunc = (data: KalendState) => void;

export interface Callbacks {
  onSelectView?: OnSelectViewFunc;
  showMoreMonth?: ShowMoreMonthFunc;
  onPageChange?: OnPageChangeFunc;
  onEventDragFinish?: OnEventDragFinishFunc;
  onNewEventClick: OnNewEventClickFunc;
  onEventClick: OnEventClickFunc;
  onStateChange?: OnStateChangeFunc;
}

export interface ShowMoreEvents {
  day: DateTime;
  events: CalendarEvent[];
}

export interface Style {
  primaryColor: string;
  baseColor: string;
  inverseBaseColor: string;
}

export interface ColorItems {
  primaryColor: string;
}

export interface Colors {
  dark: ColorItems;
  light: ColorItems;
}
