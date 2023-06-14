import { CALENDAR_VIEW, LayoutRequestData, LayoutResult } from '../index';
import { DateTime } from 'luxon';
import { getAgendaView } from './agendaView';
import { getDaysViewLayout } from './daysView/daysView';
import { getMaxEventsVisible } from '../utils/monthViewHelper';
import { getMonthViewLayout } from './monthView';
import { parseToCalendarDays } from '../utils/Helper';
import { validateInput } from '../utils/validator';

const getMonthViewResult = (
  data: LayoutRequestData,
  calendarDays: DateTime[]
) => {
  const { events, width, config, height } = data;

  const monthPositions = getMonthViewLayout(
    events,
    width,
    calendarDays,
    config,
    getMaxEventsVisible(height)
  );

  return {
    selectedView: CALENDAR_VIEW.MONTH,
    ...monthPositions,
    calendarDays,
    overflowingEvents: monthPositions.overflowingEvents,
  };
};

const getDaysViewResult = (
  data: LayoutRequestData,
  calendarDays: DateTime[]
) => {
  const { events, width, config, isMobile, selectedView } = data;

  const result = getDaysViewLayout(
    events,
    calendarDays,
    config,
    width,
    selectedView,
    isMobile
  );

  return {
    selectedView,
    headerPositions: result.headerPositions.positions,
    headerOffsetTop: result.headerPositions.headerOffsetTop,
    calendarDays,
    normalPositions: result.normalPositions,
  };
};

const getAgendaViewResult = (data: LayoutRequestData) => {
  const { events, config } = data;

  const agendaEvents = getAgendaView(events, config);

  return {
    events: agendaEvents,
    selectedView: CALENDAR_VIEW.AGENDA,
  };
};

const getViewLayout = (data: LayoutRequestData, calendarDays: DateTime[]) => {
  const { selectedView } = data;

  switch (selectedView) {
    case CALENDAR_VIEW.MONTH:
      return getMonthViewResult(data, calendarDays);
    case CALENDAR_VIEW.DAY || CALENDAR_VIEW.WEEK || CALENDAR_VIEW.THREE_DAYS:
      return getDaysViewResult(data, calendarDays);
    case CALENDAR_VIEW.AGENDA:
      return getAgendaViewResult(data);
    default:
      return getDaysViewResult(data, calendarDays);
  }
};

export default (data: LayoutRequestData): Promise<LayoutResult> => {
  return new Promise((resolve) => {
    if (data) {
      validateInput(data);

      // parse to calendar days if dates are ISO string
      const calendarDays = parseToCalendarDays(data.calendarDays);

      // calculate layout for different views
      const result = getViewLayout(data, calendarDays);

      resolve(result);
    }
  });
};
