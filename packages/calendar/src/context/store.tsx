import { CALENDAR_NAVIGATION_DIRECTION, CALENDAR_VIEW } from '../common/enums';
import {
  Callbacks,
  Colors,
  Config,
  DraggingDisabledConditions,
  EventLayout,
  ShowMoreEvents,
  Style,
} from '../common/interface';
import { DateTime } from 'luxon';
import { KeyedDayViewResult } from '../layout/types';
import { createCallbacks, createConfig } from '../layers/ConfigLayer';
import { createContext, useReducer } from 'react';
import Reducer from './reducer';
import en from '../locales/en.json';

export interface Store {
  isLoading: boolean;
  headerEventRowsCount: number;
  initialView: CALENDAR_VIEW | null;
  selectedView: CALENDAR_VIEW;
  selectedDate: DateTime;
  calendarDays: DateTime[];
  width: number;
  rawWidth: number;
  height: number;
  isMobile: boolean;
  events: any;
  // layouts
  daysViewLayout: KeyedDayViewResult | null;
  headerLayout: EventLayout[] | null;
  monthLayout: EventLayout[] | null;
  monthOverflowEvents: any;
  layoutUpdateSequence: number;
  config: Config;
  callbacks: Callbacks;
  showMoreEvents: ShowMoreEvents | null;
  direction: CALENDAR_NAVIGATION_DIRECTION;
  draggingDisabledConditions: DraggingDisabledConditions | null;
  resizeDisabledConditions: DraggingDisabledConditions | null;
  translations: any;
  isNewEventOpen: boolean;
  style: Style;
  showWeekNumbers: boolean;
  isDark: boolean;
  colors: Colors;
}

export const Context: any = createContext({});

const StoreProvider = ({ children, ...props }: any) => {
  const initialContext: Store = {
    isLoading: false,
    headerEventRowsCount: 0,
    initialView: null,
    selectedView: CALENDAR_VIEW.WEEK,
    selectedDate: DateTime.now(),
    calendarDays: [],
    width: 0,
    rawWidth: 0,
    height: 0,
    isMobile: false,
    events: {},
    daysViewLayout: null,
    headerLayout: null,
    monthLayout: null,
    monthOverflowEvents: null,
    showMoreEvents: null,
    showWeekNumbers: false,
    layoutUpdateSequence: 1,
    config: createConfig(props),
    callbacks: createCallbacks({}),
    direction: CALENDAR_NAVIGATION_DIRECTION.TODAY,
    translations: en,
    isNewEventOpen: false,
    draggingDisabledConditions: null,
    resizeDisabledConditions: null,
    isDark: false,
    style: {
      primaryColor: '#ec407a',
      baseColor: '#424242FF',
      inverseBaseColor: '#E5E5E5FF',
    },
    colors: {
      light: {
        primaryColor: '#ec407a',
      },
      dark: {
        primaryColor: '#f48fb1',
      },
    },
  };

  const [store, dispatch] = useReducer(Reducer, initialContext);

  return (
    <Context.Provider value={[store, dispatch]}>{children}</Context.Provider>
  );
};

export default StoreProvider;
