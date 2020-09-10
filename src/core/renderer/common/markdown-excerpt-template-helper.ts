import * as marked from 'marked';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

const SEPARATOR = '<!--more-->';

export class MarkdownExcerptTemplateHelper implements TemplateHelper {
	public readonly name = '$markdown_excerpt';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!filePath) {
			return '[NULL]';
		}
		const content = this.contentStorage.getContent('text', filePath);
		return marked(extractExcerpt(content));
	}
}

export function extractExcerpt(content: string): string {
	const parts = content.split(SEPARATOR, 2);
	if (parts.length > 1) {
		return parts[0];
	}
	return content;
}
