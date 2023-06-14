import { CALENDAR_OFFSET_LEFT } from '../../common/constants';
import { CALENDAR_VIEW } from '../../common/enums';
import { Context, Store } from '../../context/store';
import { DateTime } from 'luxon';
import { DaysViewTableProps } from './DaysViewTable.props';
import {
  formatDateTimeToString,
  getCurrentTime,
  getSelectedViewType,
} from '../../utils/common';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDeepCompareLayoutEffect } from '../../utils/useDeepCompareEffect';
import CalendarBodyHours from './daysViewOneDay/calendarBodyHours/CalendarBodyHours';
import DaysViewOneDay from './daysViewOneDay/DaysViewOneDay';
import DaysViewVerticalLines from './daysViewVerticalLines/DaysViewVerticalLines';
import KalendLayout from '../../layout';

const renderOneDay = (
  calendarDays: DateTime[],
  events: any,
  sequence?: number
) => {
  return calendarDays.map((calendarDay: DateTime, index: number) => {
    const formattedDayString: string = formatDateTimeToString(calendarDay);

    return (
      <DaysViewOneDay
        key={formattedDayString + sequence}
        day={calendarDay}
        index={index}
        data={events ? events[formattedDayString] : []}
      />
    );
  });
};

const DaysViewTable = (props: DaysViewTableProps) => {
  const { events } = props;

  const [wasInit, setWasInit] = useState(false);
  const [calendarContent, setCalendarContent] = useState(null);

  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { isMobile, calendarDays, width, selectedView, height, config } = store;

  const style: any = {
    paddingLeft: CALENDAR_OFFSET_LEFT,
    // width: '100%',
    height: '100%',
  };

  const adjustScrollPosition = () => {
    const currentElement: any = document.getElementById(`Kalend__timetable`);

    const shift = config.focusHour
      ? config.focusHour
      : getCurrentTime(config.timezone).hour;

    currentElement.scrollTop = shift * config.hourHeight - config.hourHeight;
  };

  useEffect(() => {
    if (!store.config.autoScroll) {
      return;
    }

    adjustScrollPosition();
  }, []);

  const hasExternalLayout = props.eventLayouts !== undefined;

  // recalculate event positions on calendarDays change
  useLayoutEffect(() => {
    if (wasInit) {
      if (!hasExternalLayout) {
        KalendLayout({
          events,
          width,
          height,
          calendarDays,
          config: store.config,
          isMobile,
          selectedView,
        }).then((res: any) => {
          setContext('headerLayout', res.headerPositions);
          setContext('headerEventRowsCount', res.headerOffsetTop);
          setContext('daysViewLayout', res.normalPositions);
          setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

          const days: any = renderOneDay(
            store.calendarDays,
            res.normalPositions,
            store.layoutUpdateSequence + 1
          );
          setCalendarContent(days);
        });
      }
    }
  }, [calendarDays[0], selectedView]);

  useLayoutEffect(() => {
    if (wasInit) {
      if (!hasExternalLayout) {
        KalendLayout({
          events,
          width,
          height,
          calendarDays,
          config: store.config,
          isMobile,
          selectedView,
        }).then((res: any) => {
          setContext('headerLayout', res.headerPositions);
          setContext('headerEventRowsCount', res.headerOffsetTop);
          setContext('daysViewLayout', res.normalPositions);
          setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

          const days: any = renderOneDay(
            store.calendarDays,
            res.normalPositions,
            store.layoutUpdateSequence + 1
          );
          setCalendarContent(days);
        });
      }
    }
  }, [width]);

  useDeepCompareLayoutEffect(() => {
    if (!hasExternalLayout) {
      KalendLayout({
        events,
        width,
        height,
        calendarDays,
        config: store.config,
        isMobile,
        selectedView,
      }).then((res: any) => {
        setContext('headerLayout', res.headerPositions);
        setContext('headerEventRowsCount', res.headerOffsetTop);
        setContext('daysViewLayout', res.normalPositions);
        setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

        const days: any = renderOneDay(
          store.calendarDays,
          res.normalPositions,
          store.layoutUpdateSequence + 1
        );

        setCalendarContent(days);
      });
    }
  }, [events]);

  useLayoutEffect(() => {
    if (!hasExternalLayout) {
      KalendLayout({
        events,
        width,
        height,
        calendarDays,
        config: store.config,
        isMobile,
        selectedView,
      }).then((res: any) => {
        setContext('headerLayout', res.headerPositions);
        setContext('headerEventRowsCount', res.headerOffsetTop);
        setContext('daysViewLayout', res.normalPositions);
        setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

        const days: any = renderOneDay(
          store.calendarDays,
          res.normalPositions,
          store.layoutUpdateSequence + 1
        );

        setCalendarContent(days);
      });
    }
  }, [config.hourHeight, config.timezone]);

  useLayoutEffect(() => {
    if (!hasExternalLayout) {
      KalendLayout({
        events,
        width,
        height,
        calendarDays,
        config: store.config,
        isMobile,
        selectedView,
      }).then((res: any) => {
        setContext('headerLayout', res.headerPositions);
        setContext('headerEventRowsCount', res.headerOffsetTop);
        setContext('daysViewLayout', res.normalPositions);
        setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

        const days: any = renderOneDay(
          store.calendarDays,
          res.normalPositions,
          store.layoutUpdateSequence + 1
        );
        setCalendarContent(days);
      });
    }
    setWasInit(true);
  }, []);

  useDeepCompareLayoutEffect(() => {
    if (
      hasExternalLayout &&
      getSelectedViewType(props.eventLayouts.selectedView) ===
        CALENDAR_VIEW.WEEK
    ) {
      setContext('headerLayout', props.eventLayouts.headerPositions);
      setContext('headerEventRowsCount', props.eventLayouts.headerOffsetTop);
      setContext('daysViewLayout', props.eventLayouts.normalPositions);
      setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

      const days: any = renderOneDay(
        store.calendarDays,
        props.eventLayouts.normalPositions,
        store.layoutUpdateSequence + 1
      );
      setCalendarContent(days);
    }
  }, [props.eventLayouts]);

  return (
    <div
      style={style}
      className={'Kalend__CalendarBody'}
      id={`Kalend__timetable`}
      // onScroll={handleScroll}
    >
      <CalendarBodyHours />
      <DaysViewVerticalLines />
      {calendarContent}
    </div>
  );
};

export default DaysViewTable;
