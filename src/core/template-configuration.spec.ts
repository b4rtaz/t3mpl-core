import { PagePathStrategy } from './model';
import { getDefaultConfiguration } from './template-configuration';

describe('TemplateConfiguration', () => {

	it('getDefaultConfiguration() returns proper value', () => {
		const config = getDefaultConfiguration();
		expect(config).toBeDefined();
		expect(config.pagePathStrategy).toEqual(PagePathStrategy.absolute);
	});
});
