import { CALENDAR_VIEW } from '../../common/enums';
import { Context, Store } from '../../context/store';
import { useContext } from 'react';
import CalendarHeaderDays from './calendarHeaderDays/CalendarHeaderDays';
import CalendarHeaderEvents from './calendarHeaderEvents/CalendarHeaderEvents';

const CalendarHeader = (props: any) => {
  const [store]: [Store] = useContext(Context);

  const { isDark, width, selectedView } = store;

  const isDayView: boolean = selectedView === CALENDAR_VIEW.DAY;
  const isMonthView: boolean = selectedView === CALENDAR_VIEW.MONTH;

  return (
    <div
      className={`Kalend__CalendarHeader${!isMonthView ? '-tall' : ''}${
        isDayView ? '-day' : ''
      }${isMonthView ? '-small' : ''}${isDark ? '-dark' : ''}`}
    >
      <CalendarHeaderDays
        width={width}
        isMonthView={isMonthView}
        setViewChanged={props.setViewChanged}
      />
      {!isMonthView && store.headerLayout && store.headerLayout.length ? (
        <CalendarHeaderEvents />
      ) : null}
    </div>
  );
};

export default CalendarHeader;
