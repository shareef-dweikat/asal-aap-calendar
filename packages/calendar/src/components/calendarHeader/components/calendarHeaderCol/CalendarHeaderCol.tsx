import { CALENDAR_VIEW } from '../../../../common/enums';
import { CalendarHeaderColProps } from './CalendarHeaderCol.props';
import { Context, Store } from '../../../../context/store';
import { parseCssDark } from '../../../../utils/common';
import { useContext } from 'react';

const CalendarHeaderCol = (props: CalendarHeaderColProps) => {
  const { children } = props;

  const [store]: [Store] = useContext(Context);
  const { isDark, selectedView } = store;

  return (
    <div
      className={`${parseCssDark('Kalend__CalendarHeaderCol', isDark)}${
        selectedView === CALENDAR_VIEW.MONTH ? '-month' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default CalendarHeaderCol;
