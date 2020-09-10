import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

export class HtmlTemplateHelper implements TemplateHelper {
	public readonly name = '$html';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!filePath) {
			return '[NULL]';
		}
		return this.contentStorage.getContent('text', filePath);
	}
}
