import { parse } from 'node-html-parser';

import { ReadableStorage } from '../../storage';
import { isRelativeUrl } from '../../utils/url-utils';
import { HtmlInjector } from '../html-injector';

export class InlineHtmlInjector implements HtmlInjector {

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public inject(html: string): string {
		const doc = parse(html);

		const imgs = doc.querySelectorAll('img');
		for (const img of imgs) {
			const srcAttrName = Object.keys(img.attributes).find(a => a.toLowerCase() === 'src');
			if (srcAttrName) {
				const src = img.getAttribute(srcAttrName);
				if (src && isRelativeUrl(src)) {
					const content = this.contentStorage.getContent('dataUrl', src);
					img.setAttribute(srcAttrName, content);
				}
			}
		}

		return doc.outerHTML;
	}
}
