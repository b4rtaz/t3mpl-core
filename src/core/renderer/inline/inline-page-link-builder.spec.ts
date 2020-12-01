import { InlinePageLinkBuilder } from './inline-page-link-builder';

describe('InlinePageLinkBuilder', () => {

	it('buildStartTag() returns proper value', () => {
		const withClass = InlinePageLinkBuilder.buildStartTag('start.html', 'test');
		expect(withClass).toContain('href="#/start.html"');
		expect(withClass).toContain('class="test"');

		const withoutClass = InlinePageLinkBuilder.buildStartTag('foo/', 'test');
		expect(withoutClass).toContain('href="#/foo/"');
		expect(withoutClass).toContain('class=');
	});

	it('buildEndTag() returns proper value', () => {
		expect(InlinePageLinkBuilder.buildEndTag()).toEqual('</a>');
	});
});
