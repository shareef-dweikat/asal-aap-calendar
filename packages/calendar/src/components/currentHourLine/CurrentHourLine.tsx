import { Context, Store } from '../../context/store';
import { getCurrentTime, parseCssDark } from '../../utils/common';
import { useContext, useEffect, useState } from 'react';

const CurrentHourLine = () => {
  const [store]: [Store] = useContext(Context);
  const { config, colors } = store;

  const [currentTime, setCurrentTime] = useState(
    getCurrentTime(config.timezone)
  );

  const wrapperStyle: any = {
    top:
      currentTime.hour * config.hourHeight +
      (currentTime.minute / 60) * config.hourHeight,
  };

  useEffect(() => {
    // 2 minutes interval
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime(config.timezone));
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={wrapperStyle} className={'Kalend__CurrentHourLine'}>
      <div
        className={parseCssDark(
          'Kalend__CurrentHourLine__circle',
          store.isDark
        )}
        style={{
          background: store.isDark
            ? colors.dark.primaryColor
            : colors.light.primaryColor,
        }}
      />
      <div
        style={{
          background: store.isDark
            ? colors.dark.primaryColor
            : colors.light.primaryColor,
        }}
        className={parseCssDark('Kalend__CurrentHourLine__line', store.isDark)}
      />
    </div>
  );
};

export default CurrentHourLine;
