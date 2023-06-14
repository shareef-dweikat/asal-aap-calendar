import { CALENDAR_EVENT_TYPE } from '../common/interface';
import { EvaIcons } from '../components/eva-icons';
import { parseCssDark } from './common';
import React from 'react';

export const parseEventString = (
  value: string,
  className: string,
  style: any,
  type: CALENDAR_EVENT_TYPE,
  isDark: boolean,
  isTaskChecked?: boolean
) => {
  let newValueString = value;

  if (newValueString.indexOf('\\n') !== -1) {
    newValueString = newValueString.replace(/\\n/g, ' ');
  }

  if (newValueString.indexOf('\\;') !== -1) {
    newValueString = newValueString.replace(/\\;/g, ';');
  }
  if (newValueString.indexOf('\\,') !== -1) {
    newValueString = newValueString.replace(/\\,/g, ',');
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      {type === CALENDAR_EVENT_TYPE.TASK ? (
        !isTaskChecked ? (
          <EvaIcons.RadioOff
            className={parseCssDark('Kalend__icon-task', isDark)}
          />
        ) : (
          <EvaIcons.RadioOn
            className={parseCssDark('Kalend__icon-task', isDark)}
          />
        )
      ) : null}
      <p className={className} style={style}>
        {newValueString}
      </p>
    </div>
  );
};
