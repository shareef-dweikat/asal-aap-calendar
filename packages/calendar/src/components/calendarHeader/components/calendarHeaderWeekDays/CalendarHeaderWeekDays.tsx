import { CALENDAR_VIEW, WEEKDAY_START } from '../../../../common/enums';
import { CalendarHeaderWeekDaysProps } from './CalendarHeaderWeekDays.props';
import { Context, Store } from '../../../../context/store';
import { DateTime } from 'luxon';
import { daysText, daysTextSundayStart } from '../../../../utils/calendarDays';
import { getCorrectWidth, parseCssDark } from '../../../../utils/common';
import { useContext } from 'react';
import DayOfWeekText from '../../../dayOfWeekText/DayOfWeekText';

/**
 * Render text representation of days
 *
 * @param props
 * @constructor
 */
const CalendarHeaderWeekDays = (props: CalendarHeaderWeekDaysProps) => {
  const { daysNum, days } = props;

  const [store]: [Store] = useContext(Context);
  const { width, selectedView, isMobile, config, translations } = store;
  const { weekDayStart } = config;

  const isMonthView: boolean = selectedView === CALENDAR_VIEW.MONTH;

  const colWidth: number = isMonthView
    ? width / daysNum
    : getCorrectWidth(width, isMobile, selectedView) / daysNum;

  const weekDays =
    weekDayStart === WEEKDAY_START.SUNDAY ? daysTextSundayStart : daysText;

  const renderDaysText = () => {
    const dayTextColumnWidth: any = {
      width: colWidth,
    };

    if (isMonthView) {
      return weekDays.map((day: string) => (
        <div
          key={day}
          className={'Kalend__CalendarHeaderWeekDays__col'}
          style={dayTextColumnWidth}
        >
          <p
            className={parseCssDark(
              'Kalend__text Kalend__CalendarHeaderWeekDays__text',
              store.isDark
            )}
          >
            {translations['weekDays'][`${day}`]}
          </p>
        </div>
      ));
    }

    return days.map((calendarDay: DateTime) => (
      <DayOfWeekText
        key={calendarDay.toString()}
        day={calendarDay}
        width={colWidth}
      />
    ));
  };
  const namesForDays: any = renderDaysText();

  return (
    <div className={'Kalend__CalendarHeaderWeekDays__wrapper'}>
      <div className={'Kalend__CalendarHeaderWeekDays__container'}>
        {namesForDays}
      </div>
    </div>
  );
};

export default CalendarHeaderWeekDays;
