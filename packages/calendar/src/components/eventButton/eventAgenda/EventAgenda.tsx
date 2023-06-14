import { CalendarEvent } from '../../../common/interface';
import { Context, Store } from '../../../context/store';
import { EVENT_TYPE } from '../../../common/enums';
import { useContext } from 'react';
import EventSummary from '../components/eventSummary/EventSummary';
import EventTime from '../components/eventTime/EventTime';

interface EventAgendaProps {
  event: CalendarEvent;
  isDark: boolean;
  type: EVENT_TYPE;
}

const EventAgenda = (props: EventAgendaProps) => {
  const { isDark, event, type } = props;
  const [store]: [Store] = useContext(Context);
  const { isMobile } = store;

  return !isMobile ? (
    <div className={'Kalend__EventAgenda__container'}>
      <EventTime
        isDark={isDark}
        event={event}
        type={type}
        isDarkColor={isDark}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: event.color,
            marginLeft: 8,
            marginRight: 8,
            filter: isDark ? 'saturate(60%) brightness(120%)' : 'none',
          }}
        />
      </div>
      <EventSummary
        summary={event.summary}
        isDark={isDark}
        viewType={type}
        type={event.type}
        isDarkColor={isDark}
        event={event}
      />
    </div>
  ) : (
    <div className={'Kalend__EventAgenda__container'}>
      <div
        style={{
          width: 8,
          height: 55,
          borderRadius: 4,
          background: event.color,
          filter: isDark ? 'saturate(60%) brightness(120%)' : 'none',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <EventSummary
          summary={event.summary}
          isDark={isDark}
          viewType={type}
          type={event.type}
          isDarkColor={isDark}
          event={event}
        />
        <EventTime
          isDark={isDark}
          event={event}
          type={type}
          isDarkColor={isDark}
        />
      </div>
    </div>
  );
};

export default EventAgenda;
