import * as Handlebars from 'handlebars';

import { ReadableStorage } from '../../storage';
import { relativize } from '../../utils/path-utils';
import { TemplateHelper } from '../template-helper';

export class FileCssTemplateHelper implements TemplateHelper {
	public readonly name = '$css';

	public constructor(
		private readonly currentPagePath: string,
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find CSS file ${filePath}.`);
		}

		const relativeFilePath = relativize(this.currentPagePath, filePath);
		return `<link rel="stylesheet" href="${Handlebars.Utils.escapeExpression(relativeFilePath)}" />`;
	}
}
