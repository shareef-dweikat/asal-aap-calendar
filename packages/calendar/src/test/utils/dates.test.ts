import { DateTime } from 'luxon';
import {
  checkOverlappingDatesForHeaderEvents,
  checkOverlappingEvents,
  isEventInRange,
} from '../../utils/eventLayout';

import { TEST_TIMEZONE } from '../common';
// @ts-ignore
import assert from 'assert';

const baseDate = '2021-11-07';

const event1Data: any = {
  id: '1',
  summary: 'Test 1',
  allDay: false,
  calendarID: '1',
  startAt: `${baseDate}T18:00:00.000Z`,
  endAt: `${baseDate}T19:00:00.000Z`,
  timezoneStartAt: TEST_TIMEZONE,
};
const event2Data: any = {
  id: '2',
  summary: 'Test 2',
  allDay: false,
  calendarID: '1',
  startAt: `${baseDate}T20:00:00.000Z`,
  endAt: `${baseDate}T21:00:00.000Z`,
  timezoneStartAt: TEST_TIMEZONE,
};
const event3Data: any = {
  id: '3',
  summary: 'Test 2',
  allDay: false,
  calendarID: '1',
  startAt: `${baseDate}T05:00:00.000Z`,
  endAt: `${baseDate}T22:00:00.000Z`,
  timezoneStartAt: TEST_TIMEZONE,
};

describe(`dates funcs`, function () {
  it('checkOverlappingEvents func: Should find no overlapping', function () {
    assert.equal(
      checkOverlappingEvents(event1Data, event2Data, TEST_TIMEZONE),
      false
    );
  });
  it('checkOverlappingEvents func: Should find overlapping', function () {
    assert.equal(
      checkOverlappingEvents(event1Data, event3Data, TEST_TIMEZONE),
      true
    );
  });
  it('checkOverlappingDatesForHeaderEvents func: Should find no overlapping', function () {
    assert.equal(
      checkOverlappingDatesForHeaderEvents(
        {
          ...event1Data,
          startAt: '2021-11-07T05:00:00.000Z',
          endAt: '2021-11-07T08:00:00.000Z',
        },
        DateTime.fromISO('2021-11-08T05:00:00.000Z'),
        TEST_TIMEZONE
      ),
      false
    );
  });
  it('checkOverlappingDatesForHeaderEvents func: Should find overlapping', function () {
    assert.equal(
      checkOverlappingDatesForHeaderEvents(
        {
          ...event1Data,
          startAt: '2021-11-07T05:00:00.000Z',
          endAt: '2021-11-07T08:00:00.000Z',
        },
        DateTime.fromISO('2021-11-07T05:00:00.000Z'),
        TEST_TIMEZONE
      ),
      true
    );
  });
  it(
    'checkOverlappingDatesForHeaderEvents func: Should find no overlapping' +
      ' with externalID',
    function () {
      assert.equal(
        checkOverlappingDatesForHeaderEvents(
          {
            ...event3Data,
            externalID: '5',
            startAt: '2021-11-06T00:00:00.000Z',
            endAt: '2021-11-07T00:00:00.000Z',
          },
          DateTime.fromISO('2021-11-07T03:00:00.000Z'),
          TEST_TIMEZONE
        ),
        false
      );
    }
  );
  it(
    'checkOverlappingDatesForHeaderEvents func: Should find overlapping' +
      ' with externalID',
    function () {
      assert.equal(
        checkOverlappingDatesForHeaderEvents(
          {
            ...event3Data,
            externalID: '5',
            startAt: '2021-11-06T00:00:00.000Z',
            endAt: '2021-11-07T00:00:00.000Z',
          },
          DateTime.fromISO('2021-11-06T03:00:00.000Z'),
          TEST_TIMEZONE
        ),
        true
      );
    }
  );
  it('isEventInRange func: Should return true for yes', function () {
    assert.equal(
      isEventInRange(
        {
          ...event3Data,
          externalID: '5',
          startAt: '2021-11-06T00:00:00.000Z',
          endAt: '2021-11-07T00:00:00.000Z',
        },
        [
          DateTime.fromISO('2021-11-06T03:00:00.000Z'),
          DateTime.fromISO('2021-11-05T03:00:00.000Z'),
        ],
        TEST_TIMEZONE
      ),
      true
    );
  });
  it('isEventInRange func: Should return false for no', function () {
    assert.equal(
      isEventInRange(
        {
          ...event3Data,
          externalID: '5',
          startAt: '2021-11-06T00:00:00.000Z',
          endAt: '2021-11-07T00:00:00.000Z',
        },
        [
          DateTime.fromISO('2021-11-02T03:00:00.000Z'),
          DateTime.fromISO('2021-11-03T03:00:00.000Z'),
        ],
        TEST_TIMEZONE
      ),
      false
    );
  });
});
