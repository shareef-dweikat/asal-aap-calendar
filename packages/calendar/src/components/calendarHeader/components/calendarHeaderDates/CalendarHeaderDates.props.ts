import { DateTime } from 'luxon';

export interface CalendarHeaderDatesProps {
  daysNum: number;
  calendarDays: DateTime[];
  setViewChanged: any;
}
