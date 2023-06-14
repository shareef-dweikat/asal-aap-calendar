import { DateTime } from 'luxon';
import { EVENT_TYPE } from '../../common/enums';
import { EventLayoutMeta } from '../../common/interface';

export interface EventButtonProps {
  item: any;
  type: EVENT_TYPE;
  meta?: EventLayoutMeta;
  day?: DateTime;
  index?: number; // for month layout
}
