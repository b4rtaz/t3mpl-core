import { DateTimeTemplateHelper } from './datetime-template-helper';

describe('DateTimeTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const helper = new DateTimeTemplateHelper(null);
		const date = '2020-07-18T14:12:16+02:00';

		const v = helper.execute(date, 'DD-MM-YYYY ~ HH:mm:ss');

		expect(v).toEqual('18-07-2020 ~ 14:12:16');
	});

	it('execute() returns [NULL] whern date is null', () => {
		const helper = new DateTimeTemplateHelper(null);
		const v = helper.execute(null);

		expect(v).toEqual('[NULL]');
	});

	it('execute() for force set timezone return proper value', () => {
		const helper = new DateTimeTemplateHelper(60 * 3 /* +3h */);
		const date = '2000-01-01T11:00:00+01:00'; // utc 10:00:00

		const v = helper.execute(date, 'HH:mm:ss');

		expect(v).toEqual('13:00:00');
	});
});
