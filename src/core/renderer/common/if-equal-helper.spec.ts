import * as Handlebars from 'handlebars';

import { ifEqualHelper } from './if-equal-helper';

describe('IfEqualHelper', () => {

	it('ifEqualHelper() calls fn() method when arguments are same', () => {
		let called = false;
		const options: Handlebars.HelperOptions =  {
			fn: () => {
				called = true;
				return 'H1DD3N';
			},
			inverse: () => {
				throw new Error('inverse() method called.');
			},
			hash: null
		};

		const res = ifEqualHelper('alfa', 'alfa', options);

		expect(res).toEqual('H1DD3N');
		expect(called).toBeTruthy();
	});

	it('ifEqualHelper() calls inverse() method when arguments are not same', () => {
		let called = false;
		const options: Handlebars.HelperOptions =  {
			fn: () => {
				throw new Error('fn() method called.');
			},
			inverse: () => {
				called = true;
				return 'HI00EN';
			},
			hash: null
		};

		const res = ifEqualHelper('alfa', 'beta', options);

		expect(res).toEqual('HI00EN');
		expect(called).toBeTruthy();
	});
});
