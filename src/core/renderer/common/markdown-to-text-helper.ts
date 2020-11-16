import * as marked from 'marked';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

const ELLIPSES = '...';

export class MarkdownToTextHelper implements TemplateHelper {
	public readonly name = '$markdown2text';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string, limit?: number): string {
		const content = this.contentStorage.getContent('text', filePath);

		const tokens = marked.lexer(content);
		let text = this.trim(this.readText(tokens));

		if (limit && typeof(limit) === 'number' && text.length > limit - ELLIPSES.length) {
			text = text.substring(0, limit - ELLIPSES.length).trimRight() + ELLIPSES;
		}
		return text;
	}

	private trim(text: string): string {
		return text.replace(/\s+/g, ' ').trim();
	}

	private readText(tokens: marked.TokensList): string {
		let text = '';
		for (const token of tokens) {
			const tt = token as marked.Tokens.Text;
			if (tt.type === 'text') {
				text += tt.text + ' ';
			}
			const children = (token as any).tokens;
			if (children) {
				text += this.readText(children) + ' ';
			}
		}
		return text;
	}
}
