import { CALENDAR_VIEW } from '../../common/enums';
import { Context, Store } from '../../context/store';
import { DateTime } from 'luxon';
import { DateWeekDayProps } from './DateWeekDay.props';
import { parseCssDark } from '../../utils/common';
import { useContext } from 'react';
import LuxonHelper from '../../utils/luxonHelper';

const DateWeekDay = (props: DateWeekDayProps) => {
  const { width, day } = props;

  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { selectedView, callbacks, config } = store;

  const isDayToday: boolean = LuxonHelper.isToday(day, config.timezone);

  const isMonthView: boolean = selectedView === CALENDAR_VIEW.MONTH;
  const isAgendaView: boolean = selectedView === CALENDAR_VIEW.AGENDA;

  const isInPast = isMonthView && !day.hasSame(DateTime.now(), 'month');

  const navigateToDay = (e: any) => {
    if (props.setViewChanged) {
      e.preventDefault();
      e.stopPropagation();

      props.setViewChanged(CALENDAR_VIEW.DAY);
      setContext('selectedDate', day);
      setContext('calendarDays', [day]);
    }
  };

  const handleNewEventClick = (event: any) => {
    if (callbacks.onNewEventClick) {
      callbacks.onNewEventClick(
        {
          day: day.toJSDate(),
          hour: day.toUTC().hour,
          startAt: day
            ?.setZone(store.config.timezone)
            .startOf('day')
            .toUTC()
            .toString(),
          endAt: day
            ?.setZone(store.config.timezone)
            .endOf('day')
            .toUTC()
            .toString(),
          event,
          view: selectedView,
        },
        event
      );
    }
  };

  const getBackgroundColor = () => {
    if (!store.isDark) {
      if (isDayToday) {
        return store.colors.light.primaryColor;
      }
    } else {
      if (isDayToday) {
        return store.colors.dark.primaryColor;
      }
    }
  };

  return (
    <div
      className={'Kalend__CalendarHeaderDates__col'}
      style={{ width }}
      onClick={handleNewEventClick}
    >
      <div
        className={`${parseCssDark(
          `Kalend__CalendarHeaderDates__circle${isMonthView ? '-small' : ''}`,
          store.isDark
        )} ${isDayToday ? 'Kalend__CalendarHeaderDates__primary' : ''} ${
          isAgendaView
            ? isDayToday
              ? 'Kalend__CalendarHeaderDates__agenda-primary'
              : 'Kalend__CalendarHeaderDates__agenda'
            : ''
        }`}
        onClick={navigateToDay}
        style={{
          backgroundColor: getBackgroundColor(),
          cursor: props.setViewChanged ? 'pointer' : 'normal',
        }}
      >
        <p
          className={`Kalend__text Kalend__CalendarHeaderDates__text ${
            selectedView === CALENDAR_VIEW.MONTH
              ? 'Kalend__CalendarHeaderDates__text-size-small'
              : ''
          } ${
            isDayToday
              ? parseCssDark('Kalend__color-text-base', !store.isDark)
              : parseCssDark(
                  `Kalend__color-text-base${isInPast ? '-grayed' : ''}`,
                  store.isDark
                )
          }`}
        >
          {day.day}
        </p>
      </div>
    </div>
  );
};

export default DateWeekDay;
