import { CALENDAR_VIEW, TIME_FORMAT } from '../common/enums';
import { KalendProps } from '../index';

const getCalendarView = (value: string): CALENDAR_VIEW | null => {
  if (value.toLowerCase() === CALENDAR_VIEW.DAY.toLowerCase()) {
    return CALENDAR_VIEW.DAY;
  }
  if (value.toLowerCase() === CALENDAR_VIEW.THREE_DAYS.toLowerCase()) {
    return CALENDAR_VIEW.THREE_DAYS;
  }
  if (value.toLowerCase() === CALENDAR_VIEW.WEEK.toLowerCase()) {
    return CALENDAR_VIEW.WEEK;
  }
  if (value.toLowerCase() === CALENDAR_VIEW.MONTH.toLowerCase()) {
    return CALENDAR_VIEW.MONTH;
  }
  if (value.toLowerCase() === CALENDAR_VIEW.AGENDA.toLowerCase()) {
    return CALENDAR_VIEW.AGENDA;
  }

  return null;
};

export const validateProps = (props: KalendProps): void => {
  // Validate views
  if (props.disabledViews) {
    // throw error if all views are disabled
    if (props.disabledViews.length === Object.values(CALENDAR_VIEW).length) {
      throw Error('[Kalend]: At least one calendar view has to be enabled');
    }
  }

  // validate initial view
  if (props.initialView) {
    const initialView: CALENDAR_VIEW | null = getCalendarView(
      props.initialView.toString()
    );
    if (!initialView) {
      throw Error(`[Kalend]: Initial view "${props.initialView}" is not valid`);
    }
  }

  // validate weekDayStart
  if (
    props.weekDayStart &&
    props.weekDayStart !== 'Monday' &&
    props.weekDayStart !== 'Sunday'
  ) {
    throw Error(
      `[Kalend]: invalid weekDayStart prop "${props.weekDayStart}". Set either Monday or Sunday`
    );
  }

  // validate timeFormat
  if (props.timeFormat) {
    if (
      props.timeFormat !== TIME_FORMAT.H_24.toString() &&
      props.timeFormat !== TIME_FORMAT.H_12.toString()
    ) {
      `[Kalend]: invalid timeFormat prop "${
        props.timeFormat
      }". Valid values are '${TIME_FORMAT.H_24.toString()}' or '${TIME_FORMAT.H_12.toString()}'`;
    }
  }
};

export const validateStyle = (testMode?: boolean): void => {
  if (testMode) {
    return;
  }

  const el: Element | null = document.querySelector('.Kalend__Calendar__root');

  if (el) {
    if (window.getComputedStyle(el).display !== 'flex') {
      throw Error(
        `[Kalend]: CSS file not imported.
         Reason: You probably forgot to import css file in your app as
         import 'kalend/dist/styles/index.css';

         Valid usage:
         import Kalend from 'kalend';
         import 'kalend/dist/styles/index.css';`
      );
    }
  }
};
