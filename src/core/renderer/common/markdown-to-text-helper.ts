import * as marked from 'marked';

import { ReadableStorage } from '../../storage';
import { MarkdownScanner } from '../../scanners/markdown-scanner';
import { TemplateHelper } from '../template-helper';

const ELLIPSES = '...';

export class MarkdownToTextHelper implements TemplateHelper {
	public readonly name = '$markdown2text';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string, limit?: number): string {
		const content = this.contentStorage.getContent('text', filePath);

		let text = this.extractText(content);
		if (limit && typeof(limit) === 'number' && text.length > limit - ELLIPSES.length) {
			text = text.substring(0, limit - ELLIPSES.length).trimRight() + ELLIPSES;
		}
		return text;
	}

	private extractText(content: string) {
		let text = '';
		MarkdownScanner.scan(content, (type, token) => {
			if (type === 'text') {
				text += (token as marked.Tokens.Text).text + ' ';
			}
		});
		return text.replace(/\s+/g, ' ').trim();
	}
}
