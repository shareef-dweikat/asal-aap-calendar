import { CALENDAR_VIEW } from '../../../common/enums';
import { CalendarHeaderDaysProps } from './CalendarHeaderDays.props';
import { Context, Store } from '../../../context/store';
import { useContext } from 'react';
import CalendarHeaderColText from '../components/calendarHeaderColText/CalendarHeaderColText';
import CalendarHeaderDates from '../components/calendarHeaderDates/CalendarHeaderDates';
import CalendarHeaderWeekDays from '../components/calendarHeaderWeekDays/CalendarHeaderWeekDays';
import CalendarHeaderWrapper from '../components/calendarHeaderWrapper/CalendarHeaderWrapper';

const CalendarHeaderDays = (props: CalendarHeaderDaysProps) => {
  const { isMonthView } = props;

  const [store]: [Store] = useContext(Context);
  const {
    calendarDays,
    selectedDate,
    selectedView,
    showWeekNumbers,
    translations,
  } = store;

  const daysNum: number = isMonthView ? 7 : calendarDays.length;

  return (
    <CalendarHeaderWrapper isMonthView={isMonthView}>
      {!isMonthView &&
      selectedView !== CALENDAR_VIEW.AGENDA &&
      showWeekNumbers ? (
        <div style={{ position: 'absolute', left: 8 }}>
          <p className={'Kalend__WeekNumbersCol__text-weekdays'}>
            {translations['weekShort']}
            {selectedDate.weekNumber}
          </p>
        </div>
      ) : null}
      <CalendarHeaderColText>
        <CalendarHeaderWeekDays daysNum={daysNum} days={calendarDays} />
      </CalendarHeaderColText>
      {!isMonthView ? (
        <CalendarHeaderColText>
          <CalendarHeaderDates
            calendarDays={calendarDays}
            daysNum={daysNum}
            setViewChanged={props.setViewChanged}
          />
        </CalendarHeaderColText>
      ) : null}
    </CalendarHeaderWrapper>
  );
};

export default CalendarHeaderDays;
