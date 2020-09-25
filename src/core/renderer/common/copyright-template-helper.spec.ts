import { CopyrightTemplateHelper } from './copyright-template-helper';

describe('CopyrightTemplateHelper', () => {

	it('execute() returns not null', () => {
		const h = new CopyrightTemplateHelper();

		const r = h.execute();

		expect(r).not.toBeNull();
	});
});
