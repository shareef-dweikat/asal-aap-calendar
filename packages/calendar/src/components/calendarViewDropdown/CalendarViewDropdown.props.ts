import { CALENDAR_VIEW } from '../../common/enums';

export interface CalendarViewDropdownProps {
  disableMobileDropdown?: boolean;
  disabledViews?: CALENDAR_VIEW[];
  setViewChanged: any;
}
