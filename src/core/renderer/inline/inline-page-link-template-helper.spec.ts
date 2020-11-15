import { InlinePageLinkTemplateHelper } from './inline-page-link-template-helper';

describe('InlinePageLinkTemplateHelper', () => {

	function execute(className?: string): HTMLAnchorElement {
		const helper = new InlinePageLinkTemplateHelper();
		const html = helper.execute('index.html', 'home page', className);

		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		const a = doc.querySelector('a');

		expect(a).not.toBeNull();
		expect(a.getAttribute('href').startsWith('#')).toBeTrue();
		expect(a.hasAttribute('onclick')).toBeTrue();
		return a;
	}

	it('execute() returns <a> element with .btn class', () => {
		const a = execute('btn');

		expect(a.className).toEqual('btn');
	});

	it('execute() returns <a> element with no class', () => {
		const a = execute();

		expect(a.className).toBeFalsy();
	});
});
