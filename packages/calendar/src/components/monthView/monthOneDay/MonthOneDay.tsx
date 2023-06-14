import { DateTime } from 'luxon';
import { useContext } from 'react';

import { Context, Store } from '../../../context/store';
import { EVENT_TYPE } from '../../../common/enums';
import {
  MONTH_DAY_HEADER_HEIGHT,
  MONTH_EVENT_HEIGHT,
} from '../../../common/constants';
import { MonthOneDayProps } from './MonthOneDay.props';
import { getBorderClassName } from './MonthOneDayUtils';
import { parseCssDark } from '../../../utils/common';
import ButtonBase from '../../buttonBase/ButtonBase';
import EventButton from '../../eventButton/EventButton';
import LuxonHelper from '../../../utils/luxonHelper';

const MonthOneDay = (props: MonthOneDayProps) => {
  const { index, data, day } = props;

  const [store]: [Store] = useContext(Context);
  const { isDark, selectedDate, callbacks, height, config } = store;
  const { showMoreMonth } = callbacks;

  const renderEvents = (dataset: any) => {
    const tableHeight: number = height / 6 - MONTH_DAY_HEADER_HEIGHT; // height of one day
    const maxEvents = Number((tableHeight / MONTH_EVENT_HEIGHT).toFixed(0)) - 1;

    const eventsCount: any = [];

    const handleShowMore = () => {
      if (showMoreMonth) {
        showMoreMonth(dataset);
      }
    };

    if (dataset) {
      return dataset.map((event: any, index: number) => {
        eventsCount.push('one');
        if (eventsCount.length < maxEvents) {
          return (
            <EventButton
              key={`${event.id}${event.internalID ? event.internalID : ''}`}
              item={{ event }}
              type={EVENT_TYPE.MONTH}
              day={day}
            />
          );
        } else if (
          eventsCount.length > maxEvents &&
          index + 1 === dataset.length
        ) {
          return (
            <ButtonBase
              key={day.toString()}
              isDark={isDark}
              className={'Kalend__Monthview_Event'}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top:
                  maxEvents * MONTH_EVENT_HEIGHT - MONTH_EVENT_HEIGHT / 2 - 2,
                height: MONTH_EVENT_HEIGHT,
              }}
              onClick={handleShowMore}
            >
              <p className={'Kalend__text'} style={{ fontSize: 11 }}>
                {eventsCount.length + 1 - maxEvents} more
              </p>
            </ButtonBase>
          );
        }
      });
    }
  };

  const renderDate = (date: DateTime) => {
    const { day } = date;

    if (LuxonHelper.isToday(date, config.timezone)) {
      return (
        <div
          className={parseCssDark(
            'Kalend__MonthOneDay__date-container Kalend__MonthOneDay__circle-color',
            isDark
          )}
        >
          <p
            className={parseCssDark(
              'Kalend__text Kalend__MonthOneDay__date-today',
              isDark
            )}
          >
            {day}
          </p>
        </div>
      );
    } else if (date.hasSame(selectedDate, 'month')) {
      return (
        <div className={'Kalend__MonthOneDay__date-container'}>
          <p
            className={parseCssDark(
              'Kalend__text Kalend__MonthOneDay__date',
              isDark
            )}
          >
            {' '}
            {day}
          </p>
        </div>
      );
    } else {
      return (
        <div className={'Kalend__MonthOneDay__date-container'}>
          <p
            className={parseCssDark(
              'Kalend__text Kalend__MonthOneDay__date-past',
              isDark
            )}
          >
            {day}
          </p>
        </div>
      );
    }
  };

  const dataForDay: any = data;
  const events: any = dataForDay ? renderEvents(dataForDay) : null;
  const borderClassName: string = getBorderClassName(index);

  return (
    <div className={borderClassName} id={`Kalend__day__${day.toString()}`}>
      <div className={'Kalend__MonthOneDay__header-container'}>
        {renderDate(day)}
      </div>
      <div className={'Kalend__MonthOneDay__events-container'}>{events}</div>
    </div>
  );
};

export default MonthOneDay;
