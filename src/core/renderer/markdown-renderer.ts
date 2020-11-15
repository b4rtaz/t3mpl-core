import * as marked from 'marked';

import { ReadableStorage } from '../storage';
import { InlineHtmlInjector } from './inline/inline-html-injector';

export class MarkdownRenderer {

	public constructor(
		private readonly inline: boolean,
		private readonly contentStorage: ReadableStorage) {
	}

	public render(excerpt: boolean, filePath: string): string {
		if (!filePath) {
			return '[NULL]';
		}
		let content = this.contentStorage.getContent('text', filePath);
		if (excerpt) {
			content = extractExcerpt(content);
		}
		let html = marked(content);
		if (this.inline) {
			const injector = new InlineHtmlInjector(this.contentStorage);
			html = injector.inject(html);
		}
		return html;
	}
}

const SEPARATOR = '<!--more-->';

export function extractExcerpt(content: string): string {
	const parts = content.split(SEPARATOR, 2);
	if (parts.length > 1) {
		return parts[0];
	}
	return content;
}
