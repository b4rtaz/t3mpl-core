import { HtmlImagesScanner } from './html-images-scanner';

describe('HtmlImagesScanner', () => {

	it('scanUrls() returns proper urls', () => {
		const urls = HtmlImagesScanner.scanUrls(
`<img src="x.jpg" />
<div><img SRC='http://u.com/y.jpg'></div>
<img />
<img src="" />`);

		expect(urls.length).toEqual(2);
		expect(urls).toContain('x.jpg');
		expect(urls).toContain('http://u.com/y.jpg');
	});
});
