import { Context, Store } from '../../context/store';
import { DayOfWeekTextProps } from './DayOfWeekText.props';
import { parseCssDark } from '../../utils/common';
import { useContext } from 'react';

const DayOfWeekText = (props: DayOfWeekTextProps) => {
  const { width, day } = props;

  const [store]: [Store] = useContext(Context);

  const { translations } = store;

  return (
    <div className={'Kalend__CalendarHeaderWeekDays__col'} style={{ width }}>
      <p
        className={parseCssDark(
          'Kalend__text Kalend__CalendarHeaderWeekDays__text',
          store.isDark
        )}
      >
        {translations['weekDays'][`${day.toFormat('EEE')}`]}
      </p>
    </div>
  );
};

export default DayOfWeekText;
