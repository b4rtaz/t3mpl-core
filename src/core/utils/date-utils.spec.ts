import { dateToIsoString, formatDate } from './date-utils';

describe('DateUtils', () => {

	it('dateToIsoString() returns proper value', () => {
		const d1 = new Date(Date.UTC(2020, 1, 1, 12, 11, 10, 500));
		const d2 = new Date(2020, 1, 1, 12, 11, 10, 500);

		expect(dateToIsoString(d1)).toEqual('2020-02-01T12:11:10.500Z');
		expect(dateToIsoString(d2)).toEqual(d2.toISOString());
	});

	it('formatDate() returns proper value', () => {
		const d = new Date(Date.UTC(2020, 1, 1, 9, 11, 10, 500));

		expect(formatDate(d, 'YYYY')).toEqual('2020');
		expect(formatDate(d, 'HH', 'America/New_York')).toEqual('04');
		expect(formatDate(d, 'HH', 'Europe/London')).toEqual('09');
		expect(formatDate(d, 'HH', 'Europe/Warsaw')).toEqual('10');
		expect(formatDate(d, 'H')).toEqual(d.getHours().toString());
	});
});
