import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

export class InlineImageTemplateHelper implements TemplateHelper {
	public readonly name = '$image';

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!filePath) {
			throw new Error('$image got empty path.');
		}
		return this.contentStorage.getContent('dataUrl', filePath);
	}
}
