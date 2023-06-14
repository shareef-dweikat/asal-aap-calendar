import { useContext, useEffect, useReducer, useRef } from 'react';

import { CalendarEvent, Config, EventStyle } from '../../common/interface';
import { Context, Store } from '../../context/store';
import { DateTime } from 'luxon';
import {
  EVENT_TABLE_DELIMITER_SPACE,
  MONTH_EVENT_HEIGHT,
} from '../../common/constants';
import { EVENT_TYPE } from '../../common/enums';
import { EventButtonProps } from './EventButton.props';
import { calculateHeaderAfterDrag, onMoveHeader } from './utils/draggingHeader';
import {
  calculateMonthEventAfterDrag,
  onMoveMonthEvent,
} from './utils/draggingMonth';
import {
  calculateMonthEventMoreAfterDrag,
  onMoveMonthEventMore,
} from './utils/draggingMonthMore';
import {
  calculateNewTimeWeekDay,
  onMoveNormalEvent,
  onResizeNormalEvent,
} from './utils/draggingWeek';
import {
  checkIfDraggable,
  checkIfResizable,
  parseCssDark,
} from '../../utils/common';
import {
  disableTouchDragging,
  eventButtonInitialState,
} from './EventButton.utils';
import { onFinishDraggingInternal } from './utils/draggingGeneral';
import { parseEventColor } from '../../utils/calendarDays';
import ButtonBase from '../buttonBase/ButtonBase';
import Color from 'color';
import EventAgenda from './eventAgenda/EventAgenda';
import EventMonth from './eventMonth/EventMonth';
import EventNormal from './eventNormal/EventNormal';
import stateReducer from '../../utils/stateReducer';

// ref to cancel timout
let timeoutRef: any;

const parseAdditionalEventStyle = (event: any) => {
  if (event.style) {
    return event.style;
  }

  return {};
};

export const checkIfColorDark = (colorString: string): boolean => {
  try {
    const color = Color(colorString);

    return color.isDark();
  } catch (e) {
    return false;
  }
};

const EventButton = (props: EventButtonProps) => {
  const { item, type, day = DateTime.now(), index } = props;
  const { event } = item;
  const { startAt, endAt } = event;

  const [state, dispatchState]: any = useReducer(
    stateReducer,
    eventButtonInitialState
  );
  const setState = (stateName: string, data: any): void => {
    const payload: any = { stateName, data };
    dispatchState({ state, payload });
  };

  // store values as refs to access them in event listener
  const offsetTopRef = useRef(state.offsetTop);
  const offsetLeftRef = useRef(state.offsetLeft);
  const xShiftIndexRef = useRef(0);
  const yShiftIndexRef = useRef(0);
  const draggingRef = useRef(false);
  const isResizing = useRef(false);
  const eventWasChangedRef = useRef(false);
  const endAtRef = useRef(null);

  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const {
    width,
    calendarDays,
    config,
    callbacks,
    height,
    draggingDisabledConditions,
    resizeDisabledConditions,
  } = store as Store;

  const { hourHeight, isDark } = config as Config;
  const { onEventClick, onEventDragFinish } = callbacks;

  const columnWidth: number =
    width / (type === EVENT_TYPE.MONTH ? 7 : calendarDays.length);
  const eventColor: string = event.color
    ? parseEventColor(event.color as string, isDark)
    : 'indigo';

  const getPosition = () => {
    if (type === EVENT_TYPE.AGENDA) {
      return 'relative';
    } else if (type === EVENT_TYPE.SHOW_MORE_MONTH && !draggingRef.current) {
      return 'relative';
    } else if (type === EVENT_TYPE.SHOW_MORE_MONTH) {
      return 'fixed';
    } else {
      return 'absolute';
    }
  };

  const isDarkColor = checkIfColorDark(eventColor);

  const style: EventStyle = {
    position: getPosition(),
    height:
      state.height !== null ? state.height : item.height || MONTH_EVENT_HEIGHT,
    width: state.width !== null ? state.width : item.width || '100%',
    top: state.offsetTop !== null ? state.offsetTop : item.offsetTop,
    left: state.offsetLeft !== null ? state.offsetLeft : item.offsetLeft,
    zIndex: state.zIndex || item.zIndex,
    border: isDark ? 'solid 1px #1d1f26' : 'solid 1px white',
    // border: state.zIndex > 2 ? `solid 1px white` : `solid 1px ${eventColor}`,
    backgroundColor: eventColor,
    visibility: 'visible',
    color: isDarkColor ? 'white' : 'black',
    ...parseAdditionalEventStyle(item.event),
    // alignItems: meta?.centerText ? 'center' : 'inherit',
  };

  const handleEventClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (draggingRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      draggingRef.current = false;
      return;
    }

    if (onEventClick) {
      onEventClick(event, e);
    }
  };

  const setLayout = (layout: any) => {
    setState('initialTop', layout.offsetTop);
    setState('initialLeft', layout.offsetLeft);
    setState('offsetTop', layout.offsetTop);
    setState('offsetLeft', layout.offsetLeft);
    setState('drawingY', layout.offsetTop);
    setState('startAt', startAt);
    setState('width', layout.width);
    setState('height', layout.height);
    setState('zIndex', layout.zIndex);
    setState('border', layout.border);
    setState('meta', layout.meta);
  };

  useEffect(() => {
    setLayout(item);
    setState('endAt', endAt);
  }, []);

  const initMove = () => {
    if (type === EVENT_TYPE.AGENDA) {
      return;
    }

    if (!draggingRef.current) {
      draggingRef.current = true;
    }

    if (type === EVENT_TYPE.NORMAL) {
      setState('width', columnWidth - EVENT_TABLE_DELIMITER_SPACE);
      setState('offsetLeft', 0);
    }
  };

  const onResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (disableTouchDragging(e) || config.disabledDragging) {
      return;
    }

    isResizing.current = true;

    onResizeNormalEvent(
      e,
      endAtRef,
      day,
      config,
      state.offsetTop,
      state.height,
      setState
    );
  };

  const onMove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (disableTouchDragging(e)) {
      return;
    }
    switch (type) {
      case EVENT_TYPE.NORMAL:
        onMoveNormalEvent(
          e,
          draggingRef,
          day,
          columnWidth,
          width,
          eventWasChangedRef,
          xShiftIndexRef,
          offsetLeftRef,
          offsetTopRef,
          setState
        );
        break;
      case EVENT_TYPE.HEADER:
        onMoveHeader(
          e,
          columnWidth,
          width,
          xShiftIndexRef,
          offsetLeftRef,
          eventWasChangedRef,
          setState
        );
        break;
      case EVENT_TYPE.MONTH:
        onMoveMonthEvent(
          e,
          height,
          draggingRef,
          day,
          columnWidth,
          width,
          xShiftIndexRef,
          yShiftIndexRef,
          eventWasChangedRef,
          offsetLeftRef,
          offsetTopRef,
          setState,
          index || 0
        );
        break;
      case EVENT_TYPE.SHOW_MORE_MONTH:
        onMoveMonthEventMore(
          e,
          height,
          draggingRef,
          day,
          width,
          xShiftIndexRef,
          yShiftIndexRef,
          eventWasChangedRef,
          offsetLeftRef,
          offsetTopRef,
          setState
        );
        break;
      default:
        return;
    }
  };

  const onMouseUpResize = (e: any) => {
    // clean listeners
    document.removeEventListener('mouseup', onMouseUpResize, true);
    document.removeEventListener('mousemove', onResize, true);

    // add data to callback
    if (onEventDragFinish) {
      if (type === EVENT_TYPE.NORMAL) {
        const updatedEvent = {
          ...event,
          endAt: endAtRef.current || state.endAt,
        };
        const result: any = store.events?.map((item: any) => {
          if (item.id === updatedEvent.id) {
            return updatedEvent;
          } else {
            return item;
          }
        });

        onEventDragFinish(event, updatedEvent, result);
      }
    }

    endAtRef.current = null;
    isResizing.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Cancel dragging event
   * remove listeners clean long click timeout and reset state
   * @param e
   */
  const onMouseUp = (e: any) => {
    // clean listeners
    document.removeEventListener('mouseup', onMouseUp, true);
    document.removeEventListener('mousemove', onMove, true);

    // clear timeout
    clearTimeout(timeoutRef);

    if (!eventWasChangedRef.current) {
      setState('offsetLeft', state.offsetLeft);
      setState('width', state.width);
      setState('isDragging', false);
      draggingRef.current = false;

      return;
    }

    eventWasChangedRef.current = false;

    if (!draggingRef.current) {
      return;
    }

    setTimeout(() => {
      draggingRef.current = false;
      setState('isDragging', false);
    }, 100);

    // add data to callback
    if (onEventDragFinish || config.hasExternalLayout) {
      let newEvent: CalendarEvent | null = null;
      if (type === EVENT_TYPE.NORMAL) {
        newEvent = calculateNewTimeWeekDay(
          offsetTopRef.current,
          offsetLeftRef.current,
          xShiftIndexRef,
          event,
          hourHeight,
          config
        );
      } else if (type === EVENT_TYPE.HEADER) {
        newEvent = calculateHeaderAfterDrag(
          calendarDays,
          event,
          xShiftIndexRef
        );
      } else if (type === EVENT_TYPE.MONTH) {
        newEvent = calculateMonthEventAfterDrag(
          calendarDays,
          yShiftIndexRef,
          xShiftIndexRef,
          event
        );
      } else if (type === EVENT_TYPE.SHOW_MORE_MONTH) {
        newEvent = calculateMonthEventMoreAfterDrag(
          calendarDays,
          yShiftIndexRef,
          xShiftIndexRef,
          event
        );
      }

      if (newEvent) {
        onFinishDraggingInternal(
          event,
          newEvent,
          store,
          setContext,
          type,
          onEventDragFinish,
          () => {
            setLayout(item);
          }
        );
      }
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const onMouseDownResize = (e: any) => {
    if (disableTouchDragging(e) || !onEventDragFinish) {
      return;
    }

    const isDraggable = checkIfDraggable(draggingDisabledConditions, event);
    if (!isDraggable) {
      return;
    }
    const isResizable = checkIfResizable(resizeDisabledConditions, event);
    if (!isResizable) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    isResizing.current = true;

    if (e.button !== 0) return;
    document.addEventListener('mousemove', onResize, true);
    document.addEventListener('mouseup', onMouseUpResize, true);
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

    const isDraggable = checkIfDraggable(draggingDisabledConditions, event);
    if (!isDraggable || config.disabledDragging) {
      return;
    }

    setState('isDragging', true);
    draggingRef.current = true;

    e.preventDefault();
    e.stopPropagation();

    if (e.button !== 0) return;
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('mouseup', onMouseUp, true);

    // set temp state while dragging
    initMove();
  };

  /**
   * Initial long press click/touch on event
   * @param e
   */
  const onMouseDown = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (isResizing.current) {
      return;
    }

    // add timeout to differentiate from normal clicks
    timeoutRef = setTimeout(() => {
      onMouseDownLong(e);
    }, 120);
  };
  const isResizable = checkIfResizable(resizeDisabledConditions, event);

  return type !== EVENT_TYPE.AGENDA ? (
    <ButtonBase
      id={event.id}
      isDark={isDark}
      style={style}
      className={`${parseCssDark(`Kalend__Event-${type}`, store.isDark)} ${
        state.isDragging ? 'Kalend__EventButton__elevation' : ''
      }`}
      onClick={handleEventClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      // onTouchStart={onMouseDown}
      // onTouchMove={onMove}
      // onTouchEnd={onMouseUp}
    >
      {type === EVENT_TYPE.MONTH ||
      type === EVENT_TYPE.HEADER ||
      type === EVENT_TYPE.SHOW_MORE_MONTH ? (
        event.children?.monthView ? (
          event.children.monthView
        ) : (
          <EventMonth
            event={event}
            isDark={isDark}
            type={type}
            isDarkColor={isDarkColor}
          />
        )
      ) : null}
      {type === EVENT_TYPE.NORMAL ? (
        event.children?.daysView ? (
          event.children.daysView
        ) : (
          <EventNormal
            event={event}
            isDark={isDark}
            type={type}
            meta={item.meta}
            endAt={state.endAt}
            isDarkColor={isDarkColor}
            height={item.height}
          />
        )
      ) : null}
      {isResizing.current ? (
        <div
          className={'Kalend__EventButton__resizing_wrapper'}
          onClick={() => {
            isResizing.current = false;
          }}
        />
      ) : null}
      {type === EVENT_TYPE.NORMAL ? (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: 5,
            width: '100%',
            background: 'transparent',
            zIndex: isResizing.current ? 999 : 9,
            cursor: isResizable ? 'n-resize' : 'inherit',
          }}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isResizable) {
              return;
            }
            isResizing.current = true;
          }}
          onMouseDown={isResizable ? onMouseDownResize : undefined}
          onMouseUp={isResizable ? onMouseUpResize : undefined}
        />
      ) : null}
    </ButtonBase>
  ) : (
    <ButtonBase
      id={event.id}
      isDark={false}
      className={parseCssDark(`Kalend__Event-${type}`, isDark)}
      onClick={handleEventClick}
    >
      {event.children?.agendaView ? (
        event.children.agendaView
      ) : (
        <EventAgenda event={event} isDark={isDark} type={type} />
      )}
    </ButtonBase>
  );
};

export default EventButton;
