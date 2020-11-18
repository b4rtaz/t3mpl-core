import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FileImageTemplateHelper implements TemplateHelper {
	public readonly name = '$image';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder,
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.contentStorage.has(['dataUrl', 'binary'], filePath)) {
			throw new Error(`Cannot find an image file ${filePath}.`);
		}

		return this.fileUrlBuilder.build(filePath);
	}
}
