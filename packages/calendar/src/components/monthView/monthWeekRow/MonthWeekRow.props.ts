import { DateTime } from 'luxon';

export interface MonthWeekRowProps {
  days: DateTime[];
  index: number;
  itemRows: any;
  sequence: number;
  setViewChanged: any;
}
