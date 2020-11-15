import { ReadableStorage } from '../../storage';
import { isRelativeUrl } from '../../utils/url-utils';

export class InlineHtmlInjector {

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public inject(html: string): string {
		const doc = new DOMParser().parseFromString(html, 'text/html');

		const imgs = doc.getElementsByTagName('img');
		for (let i = 0; i < imgs.length; i++) {
			const img = imgs[i];
			const src = img.getAttribute('src');
			if (src && isRelativeUrl(src)) {
				const content = this.contentStorage.getContent('dataUrl', src);
				img.setAttribute('src', content);
			}
		}

		return doc.documentElement.outerHTML;
	}
}
