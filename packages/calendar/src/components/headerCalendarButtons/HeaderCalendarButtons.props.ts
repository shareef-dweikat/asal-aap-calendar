import { CALENDAR_VIEW } from '../../common/enums';

export interface HeaderCalendarButtonProps {
  buttonData: { label: string; value: CALENDAR_VIEW };
  setViewChanged: any;
  handleClose?: any;
  isForcedMobile?: boolean;
}
