import { CalendarHeaderDatesProps } from './CalendarHeaderDates.props';
import { Context, Store } from '../../../../context/store';
import { DateTime } from 'luxon';
import { getCorrectWidth } from '../../../../utils/common';
import { useContext } from 'react';
import CalendarHeaderCol from '../calendarHeaderCol/CalendarHeaderCol';
import CalendarHeaderColText from '../calendarHeaderColText/CalendarHeaderColText';
import DateWeekDay from '../../../dateWeekDay/DateWeekDay';

/**
 * Get numeric representation of days
 *
 * @param props
 * @constructor
 */
const CalendarHeaderDates = (props: CalendarHeaderDatesProps) => {
  const [store]: [Store] = useContext(Context);
  const { width, isMobile, selectedView } = store;

  const { daysNum, calendarDays } = props;

  const colWidth: number =
    getCorrectWidth(width, isMobile, selectedView) / daysNum;

  const renderNumericDays = () =>
    calendarDays.map((calendarDay: DateTime) => {
      return (
        <DateWeekDay
          key={calendarDay.toString()}
          width={colWidth}
          day={calendarDay}
          setViewChanged={props.setViewChanged}
        />
      );
    });

  const numericDays: any = renderNumericDays();

  return (
    <CalendarHeaderCol>
      <CalendarHeaderColText>{numericDays}</CalendarHeaderColText>
    </CalendarHeaderCol>
  );
};

export default CalendarHeaderDates;
