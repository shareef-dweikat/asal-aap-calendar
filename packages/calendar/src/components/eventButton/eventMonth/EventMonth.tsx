import { CalendarEvent } from '../../../common/interface';
import { EVENT_TYPE } from '../../../common/enums';
import EventSummary from '../components/eventSummary/EventSummary';

interface EventMonthProps {
  event: CalendarEvent;
  isDark: boolean;
  type: EVENT_TYPE;
  isDarkColor?: boolean;
}

const EventMonth = (props: EventMonthProps) => {
  const { isDark, event, type, isDarkColor } = props;

  return (
    <EventSummary
      summary={event.summary}
      isDark={isDark}
      viewType={type}
      type={event.type}
      isDarkColor={isDarkColor}
      event={event}
    />
  );
};

export default EventMonth;
