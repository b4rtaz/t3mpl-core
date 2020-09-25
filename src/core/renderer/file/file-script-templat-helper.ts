import * as Handlebars from 'handlebars';

import { ReadableStorage } from '../../storage';
import { relativize } from '../../utils/path-utils';
import { TemplateHelper } from '../template-helper';

export class FileScriptTemplateHelper implements TemplateHelper {
	public readonly name = '$script';

	public constructor(
		private readonly currentPagePath: string,
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find script file ${filePath}.`);
		}

		const relativeFilePath = relativize(this.currentPagePath, filePath);
		return `<script type="text/javascript" src="${Handlebars.Utils.escapeExpression(relativeFilePath)}" /></script>`;
	}
}
