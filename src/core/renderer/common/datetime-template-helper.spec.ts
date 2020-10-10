import * as dayjs from 'dayjs';

import { DateTimeTemplateHelper } from './datetime-template-helper';

describe('DateTimeTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const helper = new DateTimeTemplateHelper(null);
		const date = '2020-07-18T14:12:16+02:00';
		const format = 'DD-MM-YYYY ~ HH:mm:ss';

		const v = helper.execute(date, format);

		expect(v).toEqual(dayjs(date).format(format));
	});

	it('execute() returns [NULL] whern date is null', () => {
		const helper = new DateTimeTemplateHelper(null);
		const v = helper.execute(null);

		expect(v).toEqual('[NULL]');
	});

	it('execute() for force set timezone return proper value', () => {
		const helper = new DateTimeTemplateHelper('Europe/Warsaw');
		const date = '2000-01-01T11:00:00+00:00'; // utc 10:00:00

		const v = helper.execute(date, 'HH:mm:ss');

		expect(v).toEqual('12:00:00');
	});

	it('execute() returns not changed value when format is not set', () => {
		const helper = new DateTimeTemplateHelper(null);
		const date = '2000-01-01T11:00:00+00:00';

		const v = helper.execute(date);

		expect(v).toEqual(date);
	});
});
