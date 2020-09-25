import { ReadableStorage } from '../../storage';
import { relativize } from '../../utils/path-utils';
import { TemplateHelper } from '../template-helper';

export class FileImageTemplateHelper implements TemplateHelper {
	public readonly name = '$image';

	public constructor(
		private readonly currentPagePath: string,
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.contentStorage.has(['dataUrl', 'binary'], filePath)) {
			throw new Error(`Cannot find an image file ${filePath}.`);
		}

		return relativize(this.currentPagePath, filePath);
	}
}
