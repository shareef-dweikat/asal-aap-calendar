import { CALENDAR_OFFSET_LEFT } from '../../../common/constants';
import { CALENDAR_VIEW } from '../../../common/enums';
import { Context, Store } from '../../../context/store';
import { DateTime } from 'luxon';
import { getCorrectWidth, parseCssDark } from '../../../utils/common';
import { useContext } from 'react';

const renderVerticalLines = (
  calendarDays: DateTime[],
  width: number,
  height: number,
  hourHeight: number,
  isDark: boolean,
  isMobile: boolean,
  selectedView: CALENDAR_VIEW
) => {
  const columnWidth: number =
    getCorrectWidth(width, isMobile, selectedView) / calendarDays.length;

  return calendarDays.map((calendarDay, index: number) => {
    const style: { left: number; height: number } = {
      left:
        columnWidth * index +
        (selectedView === CALENDAR_VIEW.MONTH ? 0 : CALENDAR_OFFSET_LEFT),
      height: hourHeight * 24,
    };

    if (index > 0) {
      return (
        <div
          key={index}
          style={style}
          className={parseCssDark('Kalend__DaysViewVerticalLine__line', isDark)}
        />
      );
    }
  });
};

const DaysViewVerticalLines = () => {
  const [store]: [Store] = useContext(Context);
  const {
    calendarDays,
    width,
    isDark,
    height,
    config,
    isMobile,
    selectedView,
  } = store;

  const verticalLines: any = renderVerticalLines(
    selectedView === CALENDAR_VIEW.MONTH
      ? calendarDays.slice(0, 7)
      : calendarDays,
    width,
    height,
    config.hourHeight,
    isDark,
    isMobile,
    selectedView
  );

  return (
    <>
      {/*// <div className={'Kalend__DaysViewVerticalLine__container'}>*/}
      {verticalLines}
      {/*// </div>*/}
    </>
  );
};

export default DaysViewVerticalLines;
