import { TEST_TIMEZONE } from '../../../common';
import { calculateMonthEventAfterDrag } from '../../../../components/eventButton/utils/draggingMonth';
import { createRefMock } from './draggingHeader.test';
import { getMonthDaysMock } from '../../../utils/calendarDays.test';
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

describe(`draggingMonth funcs`, function () {
  const refDate = '2021-11-28T10:00:00.000Z';
  const days = getMonthDaysMock(refDate);

  it('calculateHeaderAfterDrag func: Should be first date in table', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(0),
      createRefMock(0),
      event
    );

    assert.equal(result.startAt, '2021-11-28T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-28T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should be 12 date', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(2),
      createRefMock(0),
      event
    );

    assert.equal(result.startAt, '2021-12-12T18:00:00.000Z');
    assert.equal(result.endAt, '2021-12-12T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should be 15 date', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(2),
      createRefMock(3),
      event
    );

    assert.equal(result.startAt, '2021-12-15T18:00:00.000Z');
    assert.equal(result.endAt, '2021-12-15T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should be 11 date', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(1),
      createRefMock(6),
      event
    );

    assert.equal(result.startAt, '2021-12-11T18:00:00.000Z');
    assert.equal(result.endAt, '2021-12-11T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should be 22 date', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(3),
      createRefMock(3),
      event
    );

    assert.equal(result.startAt, '2021-12-22T18:00:00.000Z');
    assert.equal(result.endAt, '2021-12-22T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should be last date in table', function () {
    const result = calculateMonthEventAfterDrag(
      days,
      createRefMock(5),
      createRefMock(6),
      event
    );

    assert.equal(result.startAt, '2022-01-08T18:00:00.000Z');
    assert.equal(result.endAt, '2022-01-08T19:00:00.000Z');
  });
});
