import * as Handlebars from 'handlebars';

import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FileCssTemplateHelper implements TemplateHelper {
	public readonly name = '$css';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder,
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find CSS file ${filePath}.`);
		}

		const url = this.fileUrlBuilder.build(filePath);
		return `<link rel="stylesheet" href="${Handlebars.Utils.escapeExpression(url)}" />`;
	}
}
