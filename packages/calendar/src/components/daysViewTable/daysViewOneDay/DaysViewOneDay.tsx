import { CalendarEvent, Config } from '../../../common/interface';
import { Context, Store } from '../../../context/store';
import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../../../common/enums';
import { disableTouchDragging } from '../../eventButton/EventButton.utils';
import { formatDateTimeToString, parseCssDark } from '../../../utils/common';
import { getDaysNum } from '../../../utils/calendarDays';
import { useContext, useEffect, useRef, useState } from 'react';
import CurrentHourLine from '../../currentHourLine/CurrentHourLine';
import EventButton from '../../eventButton/EventButton';
import LuxonHelper from '../../../utils/luxonHelper';

const renderEvents = (dataset: any[], day: DateTime) => {
  return dataset.map((eventRaw: any) => {
    const item: CalendarEvent = eventRaw.event;
    return (
      <EventButton
        key={`${item.id}${item.internalID ? item.internalID : ''}`}
        item={eventRaw}
        type={EVENT_TYPE.NORMAL}
        meta={item.meta}
        day={day}
      />
    );
  });
};

export const HOUR_DIVIDER = 4;

export const getDateFromPosition = (
  value: number,
  day: DateTime,
  config: Config
): DateTime => {
  let stringValue = String(value);

  stringValue = stringValue.includes('.') ? stringValue : `${stringValue}.0`;

  const [hourStart, minuteStart] = stringValue.split('.');

  return day.setZone(config.timezone).set({
    hour: Number(hourStart),
    minute: Number(`0.${minuteStart}`) * 60,
    second: 0,
    millisecond: 0,
  });
};

export const getNewEventDateFromPosition = (
  value: number,
  day: DateTime
): DateTime => {
  let stringValue = String(value);

  stringValue = stringValue.includes('.') ? stringValue : `${stringValue}.0`;

  const [hourStart, minuteStart] = stringValue.split('.');

  return day.set({
    hour: Number(hourStart),
    minute: Number(`0.${minuteStart}`) * 60,
    second: 0,
    millisecond: 0,
  });
};

export const getHourHeightPartialUnit = (config: Config) =>
  Number((config.hourHeight / HOUR_DIVIDER).toFixed(0));

interface DaysViewOneDayProps {
  key: string;
  day: DateTime;
  index: number;
  data: any;
}
const DaysViewOneDay = (props: DaysViewOneDayProps) => {
  const { day, index, data } = props;
  const [store]: [Store] = useContext(Context);
  const {
    width,
    selectedView,
    config,
    callbacks,
    isNewEventOpen,
    translations,
  } = store;
  const { onNewEventClick } = callbacks;
  const { isDark, hourHeight } = config;

  const [offsetTop, setOffsetTop] = useState<any>(null);
  const [offsetTopEnd, setOffsetTopEnd] = useState<any>(null);
  const startAt: any = useRef(null);
  const endAt: any = useRef(null);
  const [startAtState, setStartAt] = useState<DateTime | null>(null);
  const [endAtState, setEndAt] = useState<DateTime | null>(null);

  // const [isDraggingNewEvent, setIsDraggingNewEvent] = useState(false);
  const newEventStartOffset: any = useRef(null);
  const newEventEndOffset: any = useRef(null);
  const startAtRef: any = useRef(null);
  const isDraggingRef: any = useRef(null);
  const isUpdating: any = useRef(false);

  const style: any = {
    position: 'absolute',
    top: offsetTop,
    height: offsetTopEnd - offsetTop,
    background: store.style.primaryColor,
    width: '100%',
    zIndex: 9,
    borderRadius: 8,
    opacity: 0.8,
  };

  const handleEventClickInternal = (event: any) => {
    if (isDraggingRef.current || isUpdating.current) {
      return;
    }

    // prevent propagating when clicking on event due to listeners
    if (
      event.target?.offsetParent?.className?.indexOf('Kalend__button') !== -1
    ) {
      return;
    }

    if (onNewEventClick) {
      const element = document.querySelector('.Kalend__DayViewOneDay');
      const rect: { top: number } =
        element?.getBoundingClientRect() ||
        event.target.getBoundingClientRect();
      const y: number = event.clientY - rect.top;

      const startAtOnClick = getDateFromPosition(
        Number((y / hourHeight).toFixed(0)),
        day,
        config
      );

      if (!startAtOnClick?.toUTC()?.toString()) {
        return;
      }

      const endAtOnClick = startAtOnClick.plus({ hour: 1 });
      // Get hour from click event
      const hour: number = y / hourHeight;
      onNewEventClick(
        {
          day: day.toJSDate(),
          hour,
          startAt: startAtOnClick?.toUTC().toString(),
          endAt: endAtOnClick?.toUTC().toString(),
          event,
          view: selectedView,
        },
        event
      );
    }
  };

  const onMove = (e: any) => {
    isDraggingRef.current = true;
    // setIsDraggingNewEvent(true);

    e.preventDefault();
    e.stopPropagation();

    if (disableTouchDragging(e)) {
      return;
    }

    // Get column element for day, where event is placed
    const dayElement: any = document.getElementById(
      `Kalend__day__${day.toString()}`
    );
    const touches: any = e.nativeEvent?.touches?.[0];
    const dayElementRect = dayElement.getBoundingClientRect();

    let y: number;
    // handle touch movement
    if (touches) {
      y = touches.clientY - dayElementRect.top;
    } else {
      // handle mouse movement
      y = e.clientY - dayElementRect.top;
    }

    // initial dragging
    if (newEventStartOffset.current === null) {
      const yString = (y / getHourHeightPartialUnit(config))
        .toFixed(0)
        .split('.');
      const yValue = Number(yString[0]) * getHourHeightPartialUnit(config);
      setOffsetTop(yValue);
      const startAtValue = getDateFromPosition(
        yValue / hourHeight,
        day,
        config
      );
      startAtRef.current = startAtValue;
      startAt.current = startAtValue;
      setStartAt(startAtValue);

      setOffsetTop(yValue);
      setOffsetTopEnd(yValue);
      newEventStartOffset.current = yValue;
      newEventEndOffset.current = yValue;

      startAtRef.current = startAtValue;
      endAt.current = startAtValue;
      setEndAt(startAtValue);

      return;
    }

    // handle dragging up
    if (newEventStartOffset.current && y < newEventStartOffset.current) {
      const yString = (y / getHourHeightPartialUnit(config))
        .toFixed(0)
        .split('.');

      const yValue = Number(yString[0]) * getHourHeightPartialUnit(config);
      setOffsetTop(yValue);
      const startAtValue = getDateFromPosition(
        yValue / hourHeight,
        day,
        config
      );

      startAtRef.current = startAtValue;
      startAt.current = startAtValue;
      setStartAt(startAtValue);
      return;
    }

    // handle dragging down
    const yString = (y / getHourHeightPartialUnit(config))
      .toFixed(0)
      .split('.');
    const yValue = Number(yString[0]) * getHourHeightPartialUnit(config);
    setOffsetTopEnd(yValue);

    const endAtValue = getDateFromPosition(yValue / hourHeight, day, config);
    endAt.current = endAtValue;
    setEndAt(endAtValue);
  };

  /**
   * Cancel dragging event
   * remove listeners clean long click timeout and reset state
   * @param event
   */
  const onMouseUp = (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    // clean listeners
    document.removeEventListener('mouseup', onMouseUp, true);
    document.removeEventListener('mousemove', onMove, true);

    const targetClass = event.target.className;

    // prevent propagating when clicking on event due to listeners
    if (
      event.target?.offsetParent?.className?.indexOf('Kalend__button') !== -1
    ) {
      return;
    }

    // prevent propagating when clicking on event due to listeners
    if (targetClass.indexOf('Kalend__Event') !== -1) {
      return;
    }

    if (!isDraggingRef.current) {
      handleEventClickInternal(event);
      return;
    }

    // correct layout with actual value from endAt date
    if (endAt) {
      const correctedValue = (endAt.hour + endAt.minute / 60) * hourHeight;
      if (!isNaN(correctedValue)) {
        newEventEndOffset.current = correctedValue;
        setOffsetTopEnd(correctedValue);
      }
    }

    if (isUpdating.current) {
      return;
    }

    if (onNewEventClick && isDraggingRef.current) {
      const startValue: number = offsetTop / hourHeight;
      isUpdating.current = true;

      if (!startAt?.current?.toUTC()?.toString()) {
        isDraggingRef.current = false;
        isUpdating.current = false;
        return;
      }

      onNewEventClick(
        {
          day: day.toJSDate(),
          hour: startValue,
          event,
          startAt: startAt.current?.toUTC().toString(),
          endAt: endAt.current?.toUTC().toString(),
          view: selectedView,
        },
        event
      );
    }

    isDraggingRef.current = false;
    isUpdating.current = false;
  };

  /**
   * Start event dragging on long press/touch
   * Set listeners
   * @param e
   */
  const onMouseDownLong = (e: any) => {
    if (disableTouchDragging(e)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (e.button !== 0) return;
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onMouseUp, true);
  };

  /**
   * Initial long press click/touch on event
   * @param e
   */
  const onMouseDown = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // if (isDraggingRef.current) {
    //   onMouseUp(e);
    //   return;
    // }

    onMouseDownLong(e);
  };

  const oneDayStyle: any = {
    width: width / getDaysNum(selectedView),
    height: hourHeight * 24,
  };

  const isToday: boolean = LuxonHelper.isToday(day, config.timezone);
  const isFirstDay: boolean = index === 0;
  const dataForDay: any = data;

  const dateNow: any = DateTime.local();

  const nowPosition: number =
    dateNow
      .diff(DateTime.local().set({ hour: 0, minute: 0, second: 0 }), 'minutes')
      .toObject().minutes /
    (60 / hourHeight);

  useEffect(() => {
    if (!store.config.autoScroll) {
      return;
    }

    if (isToday) {
      const elements: any = document.querySelectorAll(
        '.calendar-body__wrapper'
      );

      for (const element of elements) {
        element.scrollTo({ top: nowPosition - 40, behavior: 'smooth' });
      }
    }
  }, []);

  const handleCloseNewEventDrag = (e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setOffsetTopEnd(null);
    setOffsetTop(null);
    // setIsDraggingNewEvent(false);
    isDraggingRef.current = false;
    newEventStartOffset.current = null;
    newEventEndOffset.current = null;
    startAt.current = null;
    endAt.current = null;
    setStartAt(null);
    setEndAt(null);

    isUpdating.current = false;
  };

  useEffect(() => {
    if (!isNewEventOpen) {
      handleCloseNewEventDrag();
    }
  }, [isNewEventOpen]);

  return (
    <div
      id={`Kalend__day__${day.toString()}`}
      key={day.toString()}
      style={oneDayStyle}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      // onTouchStart={onMouseDown}
      // onTouchMove={onMove}
      // onTouchEnd={onMouseUp}
      className={
        !isFirstDay
          ? parseCssDark('Kalend__DayViewOneDay', isDark)
          : 'Kalend__DayViewOneDay'
      }
      // onClick={handleEventClickInternal}
    >
      {isToday && config.showTimeLine ? <CurrentHourLine /> : null}
      {store.daysViewLayout?.[formatDateTimeToString(day)] &&
      dataForDay &&
      dataForDay.length > 0
        ? renderEvents(dataForDay, day)
        : null}

      {isDraggingRef.current ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 8,
          }}
          onClick={handleCloseNewEventDrag}
        />
      ) : null}
      {isDraggingRef.current ? (
        <div style={style} className={'Kalend__NewEvent'}>
          <div
            style={{
              paddingTop: 4,
              paddingLeft: 4,
              fontSize: 12,
            }}
          >
            <p style={{ color: 'white' }}>
              {config.newEventText
                ? config.newEventText
                : translations['buttons']['newEvent']}
            </p>
            <p style={{ color: 'white' }}>
              {startAtState ? startAtState.toFormat('HH:mm') : ''} -{' '}
              {endAtState ? endAtState.toFormat('HH:mm') : ''}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DaysViewOneDay;
