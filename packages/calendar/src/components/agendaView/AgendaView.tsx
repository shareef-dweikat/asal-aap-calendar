import { AgendaViewProps } from './AgendaView.props';
import { CALENDAR_VIEW } from '../../common/enums';
import { Context, Store } from '../../context/store';
import { DateTime } from 'luxon';
import { getSelectedViewType, parseCssDark } from '../../utils/common';
import { useContext, useEffect, useState } from 'react';
import { useDeepCompareEffect } from '../../utils/useDeepCompareEffect';
import AgendaDayRow from './agendaDayRow/AgendaDayRow';
import KalendLayout from '../../layout';
import LuxonHelper, { EVENTS_DAY_FORMAT } from '../../utils/luxonHelper';

const renderAgendaEvents = (
  events: any,
  calendarDays: DateTime[],
  isDark: boolean,
  selectedDate?: DateTime,
  monthInView?: null | DateTime,
  noEventsTranslations?: string
) => {
  let scrollToSet = false;
  let hasNoEvents = false;

  const result = calendarDays.map((calendarDay: DateTime) => {
    const hasEvents = !!events[calendarDay.toFormat(EVENTS_DAY_FORMAT)];
    let scrollToThis = false;
    if (hasEvents) {
      if (!hasNoEvents) {
        hasNoEvents = true;
      }

      if (
        selectedDate &&
        LuxonHelper.isNearDateOrInFuture(selectedDate, calendarDay) &&
        (!monthInView ||
          (monthInView && LuxonHelper.isSameMonth(selectedDate, monthInView)))
      ) {
        scrollToSet = true;
        scrollToThis = true;
      } else if (
        !scrollToSet &&
        !scrollToThis &&
        (!monthInView ||
          (monthInView &&
            selectedDate &&
            !LuxonHelper.isSameMonth(selectedDate, monthInView)))
      ) {
        const element = document.querySelector('.Kalend__Agenda__container');

        element?.scrollTo({ top: 0 });
      }

      return (
        <AgendaDayRow
          key={calendarDay.toString()}
          scrollToThis={scrollToThis}
          day={calendarDay}
          events={events[calendarDay.toFormat(EVENTS_DAY_FORMAT)]}
        />
      );
    }
  });

  if (!hasNoEvents) {
    return (
      <div className={'Kalend__Agenda__container-empty'}>
        <div className={'Kalend__Agenda__container-inner'}>
          <h4 className={parseCssDark('Kalend__Agenda__text-empty', isDark)}>
            {noEventsTranslations}
          </h4>
        </div>
      </div>
    );
  }

  return result;
};

const AgendaView = (props: AgendaViewProps) => {
  const { events, eventLayouts } = props;
  const [monthInView, setMonthInView] = useState<null | DateTime>(null);

  const [calendarContent, setCalendarContent] = useState(null);

  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { calendarDays, width, height, config, selectedDate, translations } =
    store;
  const { isDark } = config;

  const hasExternalLayout = eventLayouts !== undefined;

  useEffect(() => {
    if (!hasExternalLayout) {
      KalendLayout({
        events,
        selectedView: CALENDAR_VIEW.AGENDA,
        height,
        width,
        calendarDays: [],
        config: store.config,
      }).then((res: any) => {
        setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

        const content: any = renderAgendaEvents(
          res.events,
          calendarDays,
          isDark,
          selectedDate,
          monthInView,
          translations['common']['noEvents']
        );
        setCalendarContent(content);
      });
    }
  }, [calendarDays[0], config.timezone]);

  useEffect(() => {
    if (!monthInView) {
      setMonthInView(calendarDays[15]);
    }
  }, []);

  useDeepCompareEffect(() => {
    // don't need to call this immediately
    if (monthInView) {
      if (!hasExternalLayout) {
        KalendLayout({
          events,
          selectedView: CALENDAR_VIEW.AGENDA,
          height,
          width,
          calendarDays: [],
          config: store.config,
        }).then((res: any) => {
          setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

          const content: any = renderAgendaEvents(
            res.events,
            calendarDays,
            isDark,
            selectedDate,
            monthInView,
            translations['common']['noEvents']
          );
          setCalendarContent(content);
        });
      }
    }
  }, [events]);

  useDeepCompareEffect(() => {
    if (
      hasExternalLayout &&
      getSelectedViewType(props.eventLayouts.selectedView) ===
        CALENDAR_VIEW.AGENDA
    ) {
      setContext('layoutUpdateSequence', store.layoutUpdateSequence + 1);

      const content: any = renderAgendaEvents(
        props.eventLayouts?.events,
        calendarDays,
        isDark,
        selectedDate,
        monthInView,
        translations['common']['noEvents']
      );
      setCalendarContent(content);
    }
  }, [props.eventLayouts]);

  return (
    <div className={'Kalend__Agenda__container'} style={{ height: '100%' }}>
      {calendarContent}
    </div>
  );
};

export default AgendaView;
