import parse from 'node-html-parser';

import { relativize } from '../../utils/path-utils';
import { isRelativeUrl } from '../../utils/url-utils';
import { HtmlInjector } from '../html-injector';

export class FileHtmlInjector implements HtmlInjector {

	public constructor(
		private readonly currentPagePath: string) {
	}

	public inject(html: string): string {
		const doc = parse(html);

		const imgs = doc.querySelectorAll('img');
		for (const img of imgs) {
			const srcAttrName = Object.keys(img.attributes).find(a => a.toLowerCase() === 'src');
			if (srcAttrName) {
				const src = img.getAttribute(srcAttrName);
				if (src && isRelativeUrl(src)) {
					const relativeFilePath = relativize(this.currentPagePath, src);
					img.setAttribute(srcAttrName, relativeFilePath);
				}
			}
		}

		return doc.outerHTML;
	}
}
