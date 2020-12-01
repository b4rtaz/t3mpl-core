import { FilePageLinkBuilder } from './file-page-link-builder';

describe('FilePageLinkBuilder', () => {

	it('buildStartTag() returns proper value', () => {
		const withClass = FilePageLinkBuilder.buildStartTag('alfa.html', 'alfa');
		expect(withClass).toEqual('<a href="alfa.html" class="alfa">');

		const withoutClass = FilePageLinkBuilder.buildStartTag('http://foo.com/beta.html', null);
		expect(withoutClass).toEqual('<a href="http://foo.com/beta.html">');
	});

	it('buildEndTag() returns proper value', () => {
		expect(FilePageLinkBuilder.buildEndTag()).toEqual('</a>');
	});
});
