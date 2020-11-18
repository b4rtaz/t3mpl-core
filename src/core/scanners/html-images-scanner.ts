import parse from 'node-html-parser';

export class HtmlImagesScanner {

	public static scanUrls(html: string): string[] {
		const doc = parse(html);
		const urls = [];

		const imgs = doc.querySelectorAll('img');
		for (const img of imgs) {
			const srcAttrName = Object.keys(img.attributes).find(a => a.toLowerCase() === 'src');
			if (srcAttrName) {
				const src = img.getAttribute(srcAttrName);
				if (src) {
					urls.push(src);
				}
			}
		}
		return urls;
	}
}
