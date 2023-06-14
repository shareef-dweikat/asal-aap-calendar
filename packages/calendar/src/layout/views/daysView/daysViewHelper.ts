import { CalendarEvent, Config } from '../../index';
import { DayViewResult, GroupedLayouts, LayoutEvent } from '../../types';
import { EVENT_MIN_HEIGHT, SHOW_TIME_THRESHOLD } from '../../constants';
import { calculateEventHeight, calculateOffsetTop } from '../../utils/Helper';

/**
 * Check if event is overlapping with other events in one group of layouts
 * @param item
 * @param refFirstCoordinate
 * @param refLastCoordinate
 */
export const checkOverlappingYCoordinates = (
  item: LayoutEvent,
  refFirstCoordinate: number,
  refLastCoordinate: number
) => {
  return (
    (item.offsetTop > refFirstCoordinate &&
      item.offsetTop < refLastCoordinate) ||
    (refLastCoordinate > item.offsetTop &&
      refLastCoordinate < item.offsetTop) ||
    (refFirstCoordinate > item.offsetTop &&
      refFirstCoordinate < item.itemLastCoordinate) ||
    (item.offsetTop < refFirstCoordinate &&
      item.itemLastCoordinate > refLastCoordinate) ||
    // starting at same time
    item.offsetTop === refFirstCoordinate
  );
};

/**
 * Get basic layout with offset top and event height
 * @param events
 * @param config
 */
export const getEventsLayouts = (
  events: CalendarEvent[],
  config: Config
): LayoutEvent[] => {
  return events.map((event: CalendarEvent) => {
    const offsetTop = calculateOffsetTop(event, config);

    // adjust based on hour column height
    const eventHeight = calculateEventHeight(event, config);

    return {
      event,
      offsetTop,
      eventHeight,
      itemLastCoordinate: offsetTop + eventHeight,
    };
  });
};

const handleFirstItemInLayoutGroup = (
  layoutGroupsPrev: GroupedLayouts,
  currentGroupPrev: LayoutEvent[],
  events: LayoutEvent[],
  item: LayoutEvent
) => {
  const layoutGroups = Array.from(layoutGroupsPrev);
  let currentGroup = Array.from(currentGroupPrev);

  // add event
  currentGroup.push(item);

  // add directly to layout group if not more than 1 event
  if (events.length === 1) {
    layoutGroups.push(currentGroup);
    currentGroup = [];
  }

  return {
    currentGroup,
    layoutGroups,
    groupFirstCoordinate: item.offsetTop,
    groupLastCoordinate: item.itemLastCoordinate,
  };
};

const handleOverlappingEvent = (
  currentGroupPrev: LayoutEvent[],
  item: LayoutEvent,
  groupFirstCoordinatePrev: number,
  groupLastCoordinatePrev: number
) => {
  const currentGroup = Array.from(currentGroupPrev);
  let groupFirstCoordinate = groupFirstCoordinatePrev;
  let groupLastCoordinate = groupLastCoordinatePrev;

  currentGroup.push(item);

  // Note this should never occur because of sorting
  // override first coordinate
  if (item.offsetTop > groupFirstCoordinate) {
    groupFirstCoordinate = item.offsetTop;
  }
  // set last coordinate for group
  if (item.itemLastCoordinate > groupLastCoordinate) {
    groupLastCoordinate = item.itemLastCoordinate;
  }

  return {
    currentGroup,
    groupFirstCoordinate,
    groupLastCoordinate,
  };
};

const handleFreeEvent = (
  layoutGroupsPrev: GroupedLayouts,
  currentGroupPrev: LayoutEvent[],
  item: LayoutEvent,
  groupFirstCoordinatePrev: number,
  groupLastCoordinatePrev: number,
  usedGroupIDsPrev: string[],
  currentGroupIDPrev: number
) => {
  const layoutGroups = Array.from(layoutGroupsPrev);
  let currentGroup = Array.from(currentGroupPrev);
  const usedGroupIDs = Array.from(usedGroupIDsPrev);
  let currentGroupID = currentGroupIDPrev;

  let groupFirstCoordinate = groupFirstCoordinatePrev;
  let groupLastCoordinate = groupLastCoordinatePrev;

  // event is not overlapping, so we have new group of events

  // store previous group
  layoutGroups.push(currentGroup);
  usedGroupIDs.push(String(currentGroupID));

  currentGroupID += 1;

  currentGroup = [];
  currentGroup.push(item);
  groupFirstCoordinate = item.offsetTop;
  groupLastCoordinate = item.itemLastCoordinate;

  return {
    currentGroup,
    groupFirstCoordinate,
    groupLastCoordinate,
    currentGroupID,
    usedGroupIDs,
    layoutGroups,
  };
};

/**
 * Group events according to their position on y-axis
 * @param events
 */
export const groupEvents = (events: LayoutEvent[]): GroupedLayouts => {
  let layoutGroups: GroupedLayouts = [];

  let currentGroup: LayoutEvent[] = [];

  let isFirst = true;
  let groupFirstCoordinate = 0;
  let groupLastCoordinate = 0;

  let currentGroupID = 0;
  let usedGroupIDs: string[] = [];

  // calculate layout for each overlapping group
  events.forEach((item) => {
    if (isFirst) {
      const result = handleFirstItemInLayoutGroup(
        layoutGroups,
        currentGroup,
        events,
        item
      );

      layoutGroups = result.layoutGroups;
      currentGroup = result.currentGroup;
      groupFirstCoordinate = result.groupFirstCoordinate;
      groupLastCoordinate = result.groupLastCoordinate;

      isFirst = false;
    } else {
      // check if next event is inside current group coordinates
      const isOverlapping = checkOverlappingYCoordinates(
        item,
        groupFirstCoordinate,
        groupLastCoordinate
      );

      // add to group
      if (isOverlapping) {
        const result = handleOverlappingEvent(
          currentGroup,
          item,
          groupFirstCoordinate,
          groupLastCoordinate
        );

        currentGroup = result.currentGroup;
        groupFirstCoordinate = result.groupFirstCoordinate;
        groupLastCoordinate = result.groupLastCoordinate;
      } else {
        // we have new group of events
        const result = handleFreeEvent(
          layoutGroups,
          currentGroup,
          item,
          groupFirstCoordinate,
          groupLastCoordinate,
          usedGroupIDs,
          currentGroupID
        );

        layoutGroups = result.layoutGroups;
        currentGroup = result.currentGroup;
        groupFirstCoordinate = result.groupFirstCoordinate;
        groupLastCoordinate = result.groupLastCoordinate;
        usedGroupIDs = result.usedGroupIDs;
        currentGroupID = result.currentGroupID;
      }
    }
  });

  if (!usedGroupIDs.includes(String(currentGroupID))) {
    if (currentGroup.length > 0) {
      layoutGroups.push(currentGroup);
    }
  }

  return layoutGroups;
};

export const parseToDayViewResult = (
  dateKey: string,
  eventWidth: number,
  tableWidth: number,
  tableSpace: number,
  index: number,
  groupItem: LayoutEvent
): DayViewResult => {
  const isFullWidth = eventWidth === tableWidth;
  const offsetLeft = eventWidth * index;

  // bring back original dates after calculations
  const eventResult: any = { ...groupItem.event };
  if (eventResult.original) {
    eventResult.startAt = eventResult.original.startAt;
    eventResult.endAt = eventResult.original.endAt;

    delete eventResult.original;
  }

  return {
    dateKey,
    event: eventResult,
    height:
      groupItem.eventHeight < EVENT_MIN_HEIGHT
        ? EVENT_MIN_HEIGHT
        : groupItem.eventHeight,
    // add some padding
    width: isFullWidth ? eventWidth - tableSpace : eventWidth,
    offsetLeft: offsetLeft > 0 ? offsetLeft - tableSpace : offsetLeft,
    offsetTop: groupItem.offsetTop,
    zIndex: 2 + index,
    meta: {
      isFullWidth: eventWidth === 1,
      showTime:
        eventWidth >= SHOW_TIME_THRESHOLD &&
        groupItem.eventHeight >= SHOW_TIME_THRESHOLD,
      centerText: groupItem.eventHeight <= SHOW_TIME_THRESHOLD,
    },
  };
};
