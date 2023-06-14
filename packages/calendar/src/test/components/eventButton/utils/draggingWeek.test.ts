import { TEST_TIMEZONE } from '../../../common';
import { calculateNewTimeWeekDay } from '../../../../components/eventButton/utils/draggingWeek';
import { createRefMock } from './draggingHeader.test';
import assert from 'assert';

const event: any = {
  id: '1',
  summary: 'Test 1',
  allDay: false,
  calendarID: '1',
  startAt: '2021-11-07T18:00:00.000Z',
  endAt: '2021-11-07T19:00:00.000Z',
  timezoneStartAt: TEST_TIMEZONE,
};

describe(`draggingWeek funcs`, function () {
  it('calculateHeaderAfterDrag func: Should set 0 hour for same day', function () {
    const result = calculateNewTimeWeekDay(60, 0, createRefMock(0), event, 60, {
      timezone: TEST_TIMEZONE,
    });

    assert.equal(result.startAt, '2021-11-07T00:00:00.000Z');
    assert.equal(result.endAt, '2021-11-07T01:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should set 12 hour for same day', function () {
    const result = calculateNewTimeWeekDay(
      60 * 13,
      0,
      createRefMock(0),
      event,
      60,
      {
        timezone: TEST_TIMEZONE,
      }
    );

    assert.equal(result.startAt, '2021-11-07T12:00:00.000Z');
    assert.equal(result.endAt, '2021-11-07T13:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should set 0 hour for previous day', function () {
    const result = calculateNewTimeWeekDay(
      60,
      -50,
      createRefMock(-1),
      event,
      60,
      {
        timezone: TEST_TIMEZONE,
      }
    );

    assert.equal(result.startAt, '2021-11-06T00:00:00.000Z');
    assert.equal(result.endAt, '2021-11-06T01:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should set 22 hour for two days before', function () {
    const result = calculateNewTimeWeekDay(
      60 * 23,
      -50,
      createRefMock(-2),
      event,
      60,
      {
        timezone: TEST_TIMEZONE,
      }
    );

    assert.equal(result.startAt, '2021-11-05T22:00:00.000Z');
    assert.equal(result.endAt, '2021-11-05T23:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should set 11 hour for next day', function () {
    const result = calculateNewTimeWeekDay(
      60 * 12,
      150,
      createRefMock(1),
      event,
      60,
      {
        timezone: TEST_TIMEZONE,
      }
    );

    assert.equal(result.startAt, '2021-11-08T11:00:00.000Z');
    assert.equal(result.endAt, '2021-11-08T12:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should set 13 hour for two days in advance', function () {
    const result = calculateNewTimeWeekDay(
      60 * 14,
      150,
      createRefMock(2),
      event,
      60,
      {
        timezone: TEST_TIMEZONE,
      }
    );

    assert.equal(result.startAt, '2021-11-09T13:00:00.000Z');
    assert.equal(result.endAt, '2021-11-09T14:00:00.000Z');
  });
});
