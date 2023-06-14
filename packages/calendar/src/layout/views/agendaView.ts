import { CalendarEvent, Config } from '../index';
import { KeyedEvents } from '../types';
import { LuxonHelper } from '../utils/LuxonHelper';
import { formatToDateKey } from '../utils/Helper';
import { getEventDateTime } from '../utils/KalendHelper';
import { parseSingleDay } from './monthView';

const processAgendaEvents = (events: CalendarEvent[], config: Config) => {
  let preparedEvents: KeyedEvents = {};

  events.forEach((event) => {
    const { dateTimeStart, dateTimeEnd } = getEventDateTime(event, config);

    // check if is multi-day
    const isSameDay = LuxonHelper.isSameDay(dateTimeStart, dateTimeEnd);

    // origin date to determine when event starts in each row
    let originDate = formatToDateKey(dateTimeStart);

    // handle multi-day
    if (!isSameDay) {
      const diffInDays = LuxonHelper.differenceInDays(
        dateTimeStart,
        dateTimeEnd
      );

      // need to store each occurrence
      let daySpawns: string[] = [];

      // flag if events continue in next row
      // split daySpawns and adjust originDate
      for (let i = 0; i <= diffInDays; i++) {
        const refDate = dateTimeStart.plus({ days: i });

        const dateKey = formatToDateKey(refDate, config.timezone);

        // store each day in multi-day event range
        daySpawns.push(dateKey);

        const eventClone = {
          ...event,
          startAt: refDate.toString(),
          summary: `${event.summary} ${i + 1}/${diffInDays + 1}`,
          originDate,
          daysAfter: diffInDays - i,
        };

        eventClone.daySpawns = daySpawns;

        if (!preparedEvents[originDate]) {
          preparedEvents[originDate] = [eventClone];
        } else {
          preparedEvents[originDate] = [
            ...preparedEvents[originDate],
            ...[eventClone],
          ];
        }

        daySpawns = [];

        originDate = formatToDateKey(refDate.plus({ days: 1 }));
      }
    } else {
      // single day event
      preparedEvents = parseSingleDay(
        event,
        config,
        preparedEvents,
        originDate
      );
    }
  });

  return preparedEvents;
};

export const getAgendaView = (events: CalendarEvent[], config: Config) => {
  return processAgendaEvents(events, config);
};
