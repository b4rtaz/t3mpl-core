import { poweredByHelper } from './powered-by-helper';

describe('PoweredByHelper', () => {

	it('poweredByHelper() returns not null', () => {
		const p1 = poweredByHelper();
		const p2 = poweredByHelper('foo');
		expect(p1).not.toBeNull();
		expect(p2).not.toBeNull();
	});
});
