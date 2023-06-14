import { CALENDAR_OFFSET_LEFT } from '../../../../common/constants';
import { Context, Store } from '../../../../context/store';
import { TIME_FORMAT } from '../../../../common/enums';
import { createVerticalHours, parseCssDark } from '../../../../utils/common';
import { useContext } from 'react';

const getOffsetTop = (
  hour: string,
  format: TIME_FORMAT,
  hourHeight: number,
  isAfter12: boolean
) => {
  if (format === TIME_FORMAT.H_24) {
    return parseInt(hour) * hourHeight - 4;
  }

  if (format === TIME_FORMAT.H_12 && !isAfter12) {
    return parseInt(hour) * hourHeight - 4;
  } else {
    return (parseInt(hour) + 12) * hourHeight - 4;
  }
};

const renderHours = (
  width: number,
  hourHeight: number,
  isDark: boolean,
  timeFormat: TIME_FORMAT
) => {
  let isAfter12 = false;
  return createVerticalHours(timeFormat).map((hour: any) => {
    if (hour === '1 PM') {
      isAfter12 = true;
    }

    return hour === '00' ||
      hour === '24' ||
      hour === '0 AM' ||
      hour === '24 PM' ? (
      <div
        key={hour}
        className={'Kalend__CalendarBodyHours__container'}
        style={{ minHeight: hourHeight }}
      />
    ) : (
      <div
        key={hour}
        className={'Kalend__CalendarBodyHours__container'}
        style={{ minHeight: hourHeight }}
      >
        <p
          className={parseCssDark(
            'Kalend__text Kalend__CalendarBodyHours__text',
            isDark
          )}
          style={{
            top: getOffsetTop(hour, timeFormat, hourHeight, isAfter12),
            left: 10,
          }}
        >
          {hour}
        </p>
        <div
          className={parseCssDark(
            'Kalend__text Kalend__CalendarBodyHours__line',
            isDark
          )}
          style={{ width: width - CALENDAR_OFFSET_LEFT }}
        />
      </div>
    );
  });
};

const CalendarBodyHours = () => {
  const [store]: [Store] = useContext(Context);
  const { width, config, isDark, height } = store;
  const { hourHeight, timeFormat } = config;

  const hours: any = renderHours(width, hourHeight, isDark, timeFormat);

  return (
    <div className={'Kalend__CalendarBodyHours__wrapper'} style={{ height }}>
      {hours}
    </div>
  );
};

export default CalendarBodyHours;
