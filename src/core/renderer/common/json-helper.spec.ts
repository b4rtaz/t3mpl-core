import { jsonHelper } from './json-helper';

describe('JsonHelper', () => {

	it('jsonHelper() returns proper value', () => {
		const t = jsonHelper(true);
		expect(t).toEqual('true');

		const j = jsonHelper({});
		expect(j).toEqual('{}');
	});
});
