import * as Handlebars from 'handlebars';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FileScriptTemplateHelper implements TemplateHelper {
	public readonly name = '$script';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder,
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find script file ${filePath}.`);
		}

		const url = this.fileUrlBuilder.build(filePath);
		return `<script type="text/javascript" src="${Handlebars.Utils.escapeExpression(url)}" /></script>`;
	}
}
