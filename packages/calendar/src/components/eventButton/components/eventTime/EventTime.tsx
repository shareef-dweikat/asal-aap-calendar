import { useContext } from 'react';

import { CalendarEvent, Config } from '../../../../common/interface';
import { Context, Store } from '../../../../context/store';
import { DateTime } from 'luxon';
import { EVENT_TYPE, TIME_FORMAT } from '../../../../common/enums';
import { parseCssDark } from '../../../../utils/common';
import { parseToDateTime } from '../../../../utils/dateTimeParser';

const TIME_FORMAT_PATTERN = 'HH:mm';
const TIME_H_12_FORMAT_PATTERN = 'hh:mm a';

const parseTimeFormat = (day: DateTime, timeFormat: TIME_FORMAT): string => {
  if (timeFormat === TIME_FORMAT.H_24) {
    return day.toFormat(TIME_FORMAT_PATTERN);
  } else {
    return day.toFormat(TIME_H_12_FORMAT_PATTERN);
  }
};

const formatEventTimeV2 = (
  event: CalendarEvent,
  timeFormat: TIME_FORMAT,
  timezone: string,
  endAtState?: string
): { start: string; end: string } => {
  const { startAt, endAt } = event;

  const startAtDateTime: DateTime = parseToDateTime(
    startAt,
    timezone,
    timezone
  );
  const endAtDateTime: DateTime = parseToDateTime(
    endAtState || endAt,
    timezone,
    timezone
  );

  return {
    start: parseTimeFormat(startAtDateTime, timeFormat),
    end: parseTimeFormat(endAtDateTime, timeFormat),
  };
};

interface EventTimeProps {
  isDark: boolean;
  event: CalendarEvent;
  type: EVENT_TYPE;
  endAt?: string;
  isDarkColor?: boolean;
}

const normalTime = (
  timeFormat: TIME_FORMAT,
  event: CalendarEvent,
  timezone: string,
  type: EVENT_TYPE,
  isDark: boolean,
  endAt?: string,
  isDarkColor?: boolean
) => {
  const timeV2: any = formatEventTimeV2(event, timeFormat, timezone, endAt);

  const style = {
    color: event.style?.color ? event.style.color : 'inherit',
  };

  return timeFormat === TIME_FORMAT.H_12 ? (
    <p
      className={`Kalend__text ${parseCssDark(
        `Kalend__Event__time__type-${type}`,
        isDark
      )} Kalend__Event__time ${
        isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
      }`}
      style={style}
    >
      {timeV2.start}
      <br />
      {timeV2.end}
    </p>
  ) : (
    <p
      className={`Kalend__text ${parseCssDark(
        `Kalend__Event__time__type-${type}`,
        isDark
      )} Kalend__Event__time ${
        isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
      }`}
      style={style}
    >
      {timeV2.start} - {timeV2.end}
    </p>
  );
};

const EventTime = (props: EventTimeProps) => {
  const { isDark, event, type, endAt, isDarkColor } = props;

  const [store]: [Store] = useContext(Context);
  const { config, isMobile } = store as Store;
  const { timezone, timeFormat } = config as Config;

  const style = {
    color: event.style?.color ? event.style.color : 'inherit',
  };

  return type === EVENT_TYPE.AGENDA && event.allDay ? (
    <>
      <p
        className={`Kalend__text ${parseCssDark(
          `Kalend__Event__time__type-${type}`,
          isDark
        )} Kalend__Event__time ${
          isDarkColor ? 'Kalend__text-light' : 'Kalend__text-dark'
        }`}
        style={style}
      >
        All day
      </p>
      {!isMobile ? (
        <p
          style={{
            color: 'transparent',
            padding: 0,
            margin: 0,
            fontSize: '0.8em',
          }}
        >
          123 12
        </p>
      ) : null}
    </>
  ) : (
    normalTime(timeFormat, event, timezone, type, isDark, endAt, isDarkColor)
  );
};

export default EventTime;
