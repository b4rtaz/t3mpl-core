import parse from 'node-html-parser';

import { isRelativeUrl } from '../../utils/url-utils';
import { HtmlInjector } from '../html-injector';
import { FileUrlBuilder } from './file-url-builder';

export class FileHtmlInjector implements HtmlInjector {

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder) {
	}

	public inject(html: string): string {
		const doc = parse(html);

		const imgs = doc.querySelectorAll('img');
		for (const img of imgs) {
			const srcAttrName = Object.keys(img.attributes).find(a => a.toLowerCase() === 'src');
			if (srcAttrName) {
				const src = img.getAttribute(srcAttrName);
				if (src && isRelativeUrl(src)) {
					const url = this.fileUrlBuilder.build(src);
					img.setAttribute(srcAttrName, url);
				}
			}
		}

		return doc.outerHTML;
	}
}
