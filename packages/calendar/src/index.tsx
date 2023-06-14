import { CALENDAR_VIEW } from './common/enums';
import {
  CalendarEvent,
  Colors,
  NewEventClickData,
  OnEventClickFunc,
  OnEventDragFinishFunc,
  OnNewEventClickFunc,
  OnPageChangeFunc,
  OnSelectViewFunc,
  PageChangeData,
  ShowMoreMonthFunc,
  Style,
} from './common/interface';
import { useEffect } from 'react';
import { validateProps, validateStyle } from './utils/validator';
import Calendar from './Calendar';
import ConfigLayer from './layers/ConfigLayer';
import DimensionsLayoutLayer from './layers/DimensionsLayoutLayer';
import LanguageLayer from './layers/LanguageLayer';
import RootLayoutLayer from './layers/RootLayoutLayer';
import StoreProvider from './context/store';

export type { CALENDAR_VIEW };
export const CalendarView = CALENDAR_VIEW;
export type { CalendarEvent };
export type OnEventClickData = CalendarEvent;
export type OnNewEventClickData = NewEventClickData;
export type OnPageChangeData = PageChangeData;
export type OnSelectViewData = CALENDAR_VIEW;
export type ShowMoreMonthData = CalendarEvent[];
export type OnEventDragFinish = OnEventDragFinishFunc;

export interface KalendProps {
  initialDate?: string;
  isFullNavigationHidden: any;
  buttons: any;
  vacationDaysTextColor: string;
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
  draggingDisabledConditions?: { [key: string]: boolean | string | number };
  resizeDisabledConditions?: { [key: string]: boolean | string | number };
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

// use any as JSX was causing errors for some cases
const Kalend = (props: KalendProps): any => {
  // basic validation
  useEffect(() => {
    validateProps(props);
    validateStyle(props.testMode);
  }, []);

  return (
    <div className={'Kalend__Calendar__root Kalend__main'}>
      <StoreProvider {...props}>
        <LanguageLayer
          language={props.language || 'en'}
          customLanguage={props.customLanguage}
        >
          <RootLayoutLayer>
            <ConfigLayer {...props}>
              <DimensionsLayoutLayer>
                <Calendar
                  kalendRef={props.kalendRef}
                  events={props.events}
                  eventLayouts={props.eventLayouts}
                  selectedView={props.selectedView}
                  initialDate={props.initialDate}
                  buttons={props.buttons}
                  vacationDaysTextColor={props.vacationDaysTextColor}
                />
              </DimensionsLayoutLayer>
            </ConfigLayer>
          </RootLayoutLayer>
        </LanguageLayer>
      </StoreProvider>
    </div>
  );
};

export default Kalend;
