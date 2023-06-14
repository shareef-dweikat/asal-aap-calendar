import { Context, Store } from '../../context/store';
import { DateTime } from 'luxon';
import { useContext } from 'react';

const renderCols = (calendarDays: DateTime[], translations: any) => {
  return calendarDays.map((item, index) => {
    if (index % 7 === 0 && index < 7 * 5) {
      const weekNum = item.weekNumber;
      return (
        <div
          className={'Kalend__WeekNumbersCol__container'}
          key={item.toString()}
        >
          <p className={'Kalend__WeekNumbersCol__text'}>
            {translations['weekShort']}
            {weekNum}
          </p>
        </div>
      );
    } else if (index % 7 === 0 && index >= 7 * 5) {
      const weekNum = item.weekNumber;
      return (
        <div
          className={'Kalend__WeekNumbersCol__container--no-border'}
          key={item.toString()}
        >
          <p className={'Kalend__WeekNumbersCol__text'}>
            {translations['weekShort']}
            {weekNum}
          </p>
        </div>
      );
    }
  });
};

const WeekNumbersCol = () => {
  const [store]: [Store] = useContext(Context);

  const cols = renderCols(store.calendarDays, store.translations);
  return <div className={'Kalend__WeekNumbersCol__wrapper'}>{cols}</div>;
};

export default WeekNumbersCol;
