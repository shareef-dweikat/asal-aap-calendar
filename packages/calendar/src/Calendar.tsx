import { CALENDAR_VIEW } from './common/enums';
import { CalendarProps } from './Calendar.props';
import { Context, Store } from './context/store';
import { DateTime } from 'luxon';
import { getCalendarDays, getRange } from './utils/calendarDays';
import { isSameMonth, parseCssDark } from './utils/common';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDeepCompareLayoutEffect } from './utils/useDeepCompareEffect';
import AgendaView from './components/agendaView/AgendaView';
import CalendarDesktopNavigation from './components/CalendarDesktopNavigation/CalendarDesktopNavigation';
import CalendarHeader from './components/calendarHeader/CalendarHeader';
import CalendarTableLayoutLayer from './layers/CalendarTableLayoutLayer';
import DaysViewTable from './components/daysViewTable/DaysViewTable';
import MonthView from './components/monthView/MonthView';
import WeekNumbersCol from './components/weekNumbersCol/WeekNumbersCol';

const Calendar = (props: CalendarProps | any) => {
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { selectedDate, calendarDays, selectedView, callbacks, config, width } =
    store as Store;

  const [prevView, setPrevView] = useState('');
  const [viewChanged, setViewChanged] = useState<any>(null);

  useEffect(() => {
    const initialDate = props.initialDate
      ? DateTime.fromISO(props.initialDate)
      : DateTime.now();

    setContext('selectedDate', initialDate);

    if (selectedView) {
      const calendarDaysInitial: DateTime[] = getCalendarDays(
        selectedView,
        initialDate,
        config.weekDayStart
      );

      setContext('calendarDays', calendarDaysInitial);
    }
  }, []);

  useEffect(() => {
    const initialDate = props.initialDate
      ? DateTime.fromISO(props.initialDate)
      : DateTime.now();

    setContext('selectedDate', initialDate);

    if (selectedView) {
      const calendarDaysInitial: DateTime[] = getCalendarDays(
        selectedView,
        initialDate,
        config.weekDayStart
      );

      setContext('calendarDays', calendarDaysInitial);
    }
  }, [config.weekDayStart]);

  useEffect(() => {
    const viewChangedValue = props.selectedView || viewChanged;
    // if (props.selectedView && props.selectedView === selectedView) {
    //   return;
    // }
    if (prevView === viewChangedValue) {
      return;
    }

    if (!viewChangedValue) {
      return;
    }

    if (callbacks.onSelectView) {
      callbacks.onSelectView(viewChangedValue);
    }

    setContext('calendarDays', calendarDays[0]);
    setContext('selectedView', viewChangedValue);

    // use either passed value or internal state
    const setSelectedDate = (date: DateTime) => {
      setContext('selectedDate', date);
    };

    const calendarDaysNew: any = getCalendarDays(
      viewChangedValue,
      selectedDate && isSameMonth(selectedDate)
        ? selectedDate
        : selectedDate || props.initialDate || DateTime.now(),
      config.weekDayStart,
      setSelectedDate,
      true
    );

    setContext('calendarDays', calendarDaysNew);

    setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);
    setPrevView(viewChangedValue);
    setViewChanged(null);
  }, [viewChanged, props.selectedView]);

  useEffect(() => {
    const selectedViewValue = props.selectedView || selectedView;

    if (prevView === selectedViewValue) {
      return;
    }
    if (selectedViewValue && selectedViewValue !== prevView) {
      setContext('calendarDays', calendarDays[0]);
      setContext('selectedView', selectedViewValue);
      setPrevView(selectedViewValue);

      const setSelectedDate = (date: DateTime) =>
        setContext('selectedDate', date);

      const calendarDaysNew: DateTime[] = getCalendarDays(
        selectedViewValue,
        selectedDate || props.initialDate || DateTime.now(),
        config.weekDayStart,
        setSelectedDate,
        true
      );

      setContext('calendarDays', calendarDaysNew);
    }
  }, [selectedView]);

  useDeepCompareLayoutEffect(() => {
    setContext('events', props.events);
  }, [props.events]);

  useLayoutEffect(() => {
    if (
      callbacks.onPageChange &&
      calendarDays &&
      calendarDays[0] &&
      calendarDays.length > 0
    ) {
      callbacks.onPageChange({
        ...getRange(calendarDays),
        direction: store.direction,
      });
    }
  }, [
    selectedView,
    calendarDays?.[0],
    calendarDays?.[calendarDays?.length - 1],
  ]);
  console.log(props.buttons, "buttonnss")
  return selectedView && calendarDays?.length > 0 && selectedDate && width ? (
    <>
      <CalendarDesktopNavigation
        setViewChanged={setViewChanged}
        vacationDaysTextColor={props.vacationDaysTextColor}
        kalendRef={props.kalendRef}>
        {props.buttons}
      </ CalendarDesktopNavigation>
      <div style={{height: 64}}/>
      {selectedView !== CALENDAR_VIEW.AGENDA ? (
        <CalendarHeader setViewChanged={setViewChanged} />
      ) : null}
      {selectedView === CALENDAR_VIEW.MONTH ? (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
            }}
          >
            {store.showWeekNumbers ? <WeekNumbersCol /> : null}
            <div className={'Kalend__Calendar__table'}>
              <div
                className={parseCssDark(
                  'Kalend__Calendar__table-surface',
                  store.isDark
                )}
              >
                <CalendarTableLayoutLayer>
                  <MonthView
                    events={props.events ? props.events : []}
                    eventLayouts={props.eventLayouts}
                    setViewChanged={setViewChanged}
                  />
                </CalendarTableLayoutLayer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={'Kalend__Calendar__table'}>
          <div
            className={parseCssDark(
              'Kalend__Calendar__table-surface',
              store.isDark
            )}
          >
            <CalendarTableLayoutLayer>
              {selectedView === CALENDAR_VIEW.DAY ||
                selectedView === CALENDAR_VIEW.THREE_DAYS ||
                selectedView === CALENDAR_VIEW.WEEK ? (
                <DaysViewTable
                  events={props.events ? props.events : []}
                  eventLayouts={props.eventLayouts}
                />
              ) : null}

              {selectedView === CALENDAR_VIEW.AGENDA ? (
                <AgendaView
                  events={props.events ? props.events : []}
                  eventLayouts={props.eventLayouts}
                />
              ) : null}
            </CalendarTableLayoutLayer>
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default Calendar;
