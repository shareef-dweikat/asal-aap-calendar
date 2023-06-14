import { Context, Store } from '../../../context/store';
import { EVENT_TYPE } from '../../../common/enums';
import { MonthWeekRowProps } from './MonthWeekRow.props';
import { parseCssDark } from '../../../utils/common';
import { useContext } from 'react';
import CalendarHeaderDates from '../../calendarHeader/components/calendarHeaderDates/CalendarHeaderDates';
import EventButton from '../../eventButton/EventButton';
import MonthViewButtonMore from '../monthViewButtonMore/MonthViewButtonMore';

const MonthWeekRow = (props: MonthWeekRowProps) => {
  const { days, index, itemRows } = props;

  const [store]: [Store] = useContext(Context);
  const { monthLayout } = store;

  const renderEvents = (data: any, i: number) => {
    if (!data || !data?.[i]) {
      return [];
    }
    return itemRows.map((item: any) => {
      return (
        <EventButton
          key={`${item.event.id}${
            item.event.internalID ? item.event.internalID : ''
          }`}
          item={{ ...item }}
          meta={item.meta}
          type={EVENT_TYPE.MONTH}
          index={i}
        />
      );
    });
  };

  const events: any = renderEvents(monthLayout, index);

  // const style: { maxHeight: number } = { maxHeight: height / 6 - 30 };

  return (
    <div
      className={`${parseCssDark(
        'Kalend__MonthWeekRow__container',
        store.isDark
      )} ${index > 4 ? '--no-border' : ''}`}
    >
      <div className={'Kalend__MonthWeekRow__day'}>
        <CalendarHeaderDates
          calendarDays={days}
          daysNum={7}
          setViewChanged={props.setViewChanged}
        />
      </div>
      <div className={'Kalend__MonthWeekRow__container-events'}>{events}</div>
      <MonthViewButtonMore calendarDays={days} />
    </div>
  );
};

export default MonthWeekRow;
