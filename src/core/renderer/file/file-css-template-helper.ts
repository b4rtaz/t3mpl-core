import * as Handlebars from 'handlebars';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

export class FileCssTemplateHelper implements TemplateHelper {
	public readonly name = '$css';

	public constructor(
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find CSS file ${filePath}.`);
		}

		return `<link rel="stylesheet" href="${Handlebars.Utils.escapeExpression(filePath)}" />`;
	}
}
