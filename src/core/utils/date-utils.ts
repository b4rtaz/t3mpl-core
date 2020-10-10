import * as dayjs from 'dayjs';
import * as tz from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(tz);

export function dateToIsoString(date: Date): string {
	return dayjs(date).toISOString();
}

export function formatDate(date: Date | string, format: string, timezone?: string): string {
	let djs = dayjs(date);
	if (timezone) {
		djs = djs.tz(timezone);
	}
	return djs.format(format);
}
