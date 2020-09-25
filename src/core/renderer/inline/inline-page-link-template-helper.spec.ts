import { InlinePageLinkTemplateHelper } from './inline-page-link-template-helper';

describe('InlinePageLinkTemplateHelper', () => {

	const helper = new InlinePageLinkTemplateHelper();

	it('execute() returns proper value', () => {
		const html = helper.execute('index.html', 'home page', 'bold');

		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		const a = doc.querySelector('a');

		expect(a).not.toBeNull();
		expect(a.className).toEqual('bold');
		expect(a.getAttribute('href').startsWith('#')).toBeTrue();
		expect(a.hasAttribute('onclick')).toBeTrue();
	});
});
