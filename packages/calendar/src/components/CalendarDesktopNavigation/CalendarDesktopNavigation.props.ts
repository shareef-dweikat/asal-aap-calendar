import { CALENDAR_VIEW } from '../../common/enums';

export interface CalendarDesktopNavigationProps {
  disabledViews?: CALENDAR_VIEW[];
  setViewChanged: any;
  disableMobileDropdown?: boolean;
  kalendRef?: any;
  children: any;
  vacationDaysTextColor: string
}
