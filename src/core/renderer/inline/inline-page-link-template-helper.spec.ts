import parse, { HTMLElement } from 'node-html-parser';

import { InlinePageLinkTemplateHelper } from './inline-page-link-template-helper';

describe('InlinePageLinkTemplateHelper', () => {

	function execute(className?: string): HTMLElement {
		const helper = new InlinePageLinkTemplateHelper();
		const html = helper.execute('index.html', 'home page', className);

		const doc = parse(html);

		const a = doc.querySelector('a');

		expect(a).not.toBeNull();
		expect(a.getAttribute('href').startsWith('#')).toBeTrue();
		expect(a.hasAttribute('onclick')).toBeTrue();
		return a;
	}

	it('execute() returns <a> element with .btn class', () => {
		const a = execute('btn');

		expect(a.classNames).toContain('btn');
	});

	it('execute() returns <a> element with no class', () => {
		const a = execute();

		expect(a.classNames.length).toEqual(0);
	});
});
