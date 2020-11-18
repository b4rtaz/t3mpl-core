import { MarkdownImagesScanner } from './markdown-images-scanner';

describe('MarkdownImagesScanner', () => {

	it('scanUrls() returns proper urls', () => {
		const urls = MarkdownImagesScanner.scanUrls(
`![q](assets/a.jpg)

![q](http://g.com/g.gif)

<div><img SRC='http://u.com/u.jpg'></div>`);

		expect(urls).toContain('assets/a.jpg');
		expect(urls).toContain('http://g.com/g.gif');
		expect(urls).toContain('http://u.com/u.jpg');
	});
});
