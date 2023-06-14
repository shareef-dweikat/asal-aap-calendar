import { CALENDAR_VIEW } from './common/enums';
import { CalendarEvent, Colors, NewEventClickData, OnEventClickFunc, OnEventDragFinishFunc, OnNewEventClickFunc, OnPageChangeFunc, OnSelectViewFunc, PageChangeData, ShowMoreMonthFunc, Style } from './common/interface';
export type { CALENDAR_VIEW };
export declare const CalendarView: typeof CALENDAR_VIEW;
export type { CalendarEvent };
export type OnEventClickData = CalendarEvent;
export type OnNewEventClickData = NewEventClickData;
export type OnPageChangeData = PageChangeData;
export type OnSelectViewData = CALENDAR_VIEW;
export type ShowMoreMonthData = CalendarEvent[];
export type OnEventDragFinish = OnEventDragFinishFunc;
export interface KalendProps {
    vacationDaysTextColor: string;
    isFullNavigationHidden: any;
    buttons: any;
    initialDate?: string;
    initialView?: CALENDAR_VIEW;
    selectedView?: CALENDAR_VIEW;
    disabledViews?: CALENDAR_VIEW[];
    events?: CalendarEvent[];
    isDark?: boolean;
    hourHeight?: number;
    onNewEventClick?: OnNewEventClickFunc;
    onEventClick?: OnEventClickFunc;
    onSelectView?: OnSelectViewFunc;
    showMoreMonth?: ShowMoreMonthFunc;
    onPageChange?: OnPageChangeFunc;
    onEventDragFinish?: OnEventDragFinishFunc;
    draggingDisabledConditions?: {
        [key: string]: boolean | string | number;
    };
    resizeDisabledConditions?: {
        [key: string]: boolean | string | number;
    };
    isNewEventOpen?: boolean;
    onStateChange?: any;
    disableMobileDropdown?: boolean;
    timezone?: string;
    weekDayStart?: string;
    timeFormat?: string;
    calendarIDsHidden?: string[];
    children?: any;
    language?: string;
    customLanguage?: any;
    eventLayouts?: any;
    kalendRef?: any;
    style?: Style;
    focusHour?: number;
    showTimeLine?: boolean;
    showWeekNumbers?: boolean;
    colors?: Colors;
    autoScroll?: boolean;
    disabledDragging?: boolean;
    testMode?: boolean;
    newEventText?: string;
}
declare module 'big-cal'
declare const bigCalendar: (props: KalendProps) => any;
export default bigCalendar;
