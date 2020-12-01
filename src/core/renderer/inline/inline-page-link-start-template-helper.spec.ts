import { InlinePageLinkStartTemplateHelper } from './inline-page-link-start-template-helper';

describe('InlinePageLinkStartTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const helper = new InlinePageLinkStartTemplateHelper();

		const withClass = helper.execute('w.html', 'alpha');
		const withoutClass = helper.execute('w.html');

		expect(withClass).toContain('class="alpha"');
		expect(withoutClass).not.toContain('class=');
	});
});
