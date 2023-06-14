import { TEST_TIMEZONE } from '../../../common';
import { calculateHeaderAfterDrag } from '../../../../components/eventButton/utils/draggingHeader';
import { getWeekDaysMock } from '../../../utils/calendarDays.test';
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

export const createRefMock = (value: any): { current: any } => {
  return { current: value };
};

describe(`draggingHeader funcs`, function () {
  const refDate = '2021-11-05T18:00:00.000Z';
  const days = getWeekDaysMock(refDate);

  it('calculateHeaderAfterDrag func: Should sub two days with ref 0', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(0));

    assert.equal(result.startAt, '2021-11-05T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-05T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should sub one day with ref 1', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(1));

    assert.equal(result.startAt, '2021-11-06T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-06T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should not change with ref 2', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(2));

    assert.equal(result.startAt, event.startAt);
    assert.equal(result.endAt, event.endAt);
  });
  it('calculateHeaderAfterDrag func: Should add one day with ref 3', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(3));

    assert.equal(result.startAt, '2021-11-08T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-08T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should add two days with ref 4', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(4));

    assert.equal(result.startAt, '2021-11-09T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-09T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should add three days with ref 5', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(5));

    assert.equal(result.startAt, '2021-11-10T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-10T19:00:00.000Z');
  });
  it('calculateHeaderAfterDrag func: Should add four days with ref 6', function () {
    const result = calculateHeaderAfterDrag(days, event, createRefMock(6));

    assert.equal(result.startAt, '2021-11-11T18:00:00.000Z');
    assert.equal(result.endAt, '2021-11-11T19:00:00.000Z');
  });
});
