import { CalendarEvent, OnEventDragFinish } from '../../../index';
import { EVENT_TYPE } from '../../../common/enums';

export const onFinishDraggingInternal = (
  prevEvent: CalendarEvent,
  eventToUpdate: any,
  store: any,
  setContext: any,
  type: EVENT_TYPE,
  onEventDragFinish?: OnEventDragFinish,
  resetPosition?: any
) => {
  const events = store.events;
  const result: any = events?.map((item: any) => {
    if (item.id === eventToUpdate.id) {
      return eventToUpdate;
    } else {
      return item;
    }
  });

  // return updated data with callback
  if (onEventDragFinish) {
    onEventDragFinish(prevEvent, eventToUpdate, result, resetPosition);
  }
};
