import * as marked from 'marked';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

export class MarkdownTemplateHelper implements TemplateHelper {
	public readonly name = '$markdown';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!filePath) {
			return '[NULL]';
		}
		const mdContent = this.contentStorage.getContent('text', filePath);
		return marked(mdContent);
	}
}
