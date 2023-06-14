import { CalendarEvent } from '../../../common/interface';
import { Context, Store } from '../../../context/store';
import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../../../common/enums';
import { MonthViewButtonMoreProps } from './MonthViewButtonMore.props';
import { formatDateTimeToString, parseCssDark } from '../../../utils/common';
import { useContext } from 'react';
import Dropdown from '../../dropdown/Dropdown';
import EventButton from '../../eventButton/EventButton';

const MonthViewButtonMore = (props: MonthViewButtonMoreProps) => {
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { width, monthOverflowEvents } = store;

  const { calendarDays } = props;

  const colWidth: number = width / 7;

  const handleClick = (day: DateTime, events: CalendarEvent[]) => {
    setContext('showMoreEvents', { day, events });
  };

  const renderShowMoreButtons = () => {
    if (!monthOverflowEvents || !calendarDays || calendarDays.length === 0) {
      return [];
    }

    return calendarDays.map((calendarDay: DateTime) => {
      const dateKey: string = formatDateTimeToString(calendarDay);
      const events: CalendarEvent[] | undefined = monthOverflowEvents[dateKey];

      if (events) {
        return (
          <Dropdown
            onClick={() => handleClick(calendarDay, events)}
            width={colWidth}
            key={calendarDay.toString()}
            day={calendarDay}
          >
            <>
              <h6
                className={parseCssDark(
                  'Kalend__MonthView_more_title',
                  store.isDark
                )}
              >
                {calendarDay.toFormat('dd. MMM')}
              </h6>
              {/*// @ts-ignore*/}
              {events?.map((event: any) => {
                return (
                  <EventButton
                    key={`${event.id}${
                      event.internalID ? event.internalID : ''
                    }`}
                    item={{ event }}
                    type={EVENT_TYPE.SHOW_MORE_MONTH}
                  />
                );
              })}
            </>
          </Dropdown>
        );
      } else {
        return (
          <div
            key={calendarDay.toString()}
            style={{ width: colWidth, visibility: 'hidden' }}
          />
        );
      }
    });
  };

  const showMoreButtons: any = renderShowMoreButtons();

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 1,
        left: 0,
      }}
    >
      {showMoreButtons}
      {/*{showMoreEvents ? <ShowMoreModal /> : null}*/}
    </div>
  );
};

export default MonthViewButtonMore;
