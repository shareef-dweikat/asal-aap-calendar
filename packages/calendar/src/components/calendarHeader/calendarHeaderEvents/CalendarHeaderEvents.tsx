import { Context, Store } from '../../../context/store';
import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../../../common/enums';
import { getDaysNum } from '../../../utils/calendarDays';
import { useContext, useState } from 'react';
import { useDeepCompareEffect } from '../../../utils/useDeepCompareEffect';
import EventButton from '../../eventButton/EventButton';

const CalendarHeaderEvents = () => {
  const [store]: [Store] = useContext(Context);
  const { selectedView, width, calendarDays } = store;

  const renderEvents = (data: any, sequence: number) => {
    return data?.map((item: any) => {
      // const item: any = keyValue[1];

      return (
        <EventButton
          key={
            `${item.event.id}${
              item.event.internalID ? item.event.internalID : ''
            }` + sequence
          }
          item={item}
          type={EVENT_TYPE.HEADER}
        />
      );
    });
  };

  const column = width / getDaysNum(selectedView);

  const colWidthStyle: any = {
    width: column,
  };

  const daysNumbers = calendarDays.map((calendarDay: DateTime) => {
    return (
      <div
        key={calendarDay.toString()}
        className={'Kalend__CalendarHeaderEvents__col-wrapper'}
        style={colWidthStyle}
      ></div>
    );
  });

  const [headerEvents, setHeaderEvents] = useState<any>(null);

  const headerStyle: any = {
    // paddingLeft: CALENDAR_OFFSET_LEFT,
    height: store.headerEventRowsCount + 20,
    // transition: 'all 0.3s',
  };

  // useEffect(() => {
  //   // setTimeout(() => {
  //   setContext('height', getHeight());
  //   // }, 600);
  // }, [store.headerEventRowsCount]);

  // useEffect(() => {
  //   // set animation
  //   setAnimation('Kalend__CalendarHeaderEvents_animationExpand');
  //   // clean animation
  //   setTimeout(() => {
  //     setAnimation('');
  //   }, 600);
  // }, [store.headerEventRowsCount]);

  useDeepCompareEffect(() => {
    const headerEventsRaw = renderEvents(
      store.headerLayout,
      store.layoutUpdateSequence + 1
    );
    setHeaderEvents(headerEventsRaw);
  }, [store.headerLayout]);

  return (
    <div
      className={`Kalend__CalendarHeaderEvents__container`}
      style={headerStyle}
    >
      <div className={'Kalend__CalendarHeaderEvents__row'}>{daysNumbers}</div>
      {headerEvents}
    </div>
  );
};

export default CalendarHeaderEvents;
