import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';
import * as Handlebars from 'handlebars';

export class FileScriptTemplateHelper implements TemplateHelper {
	public readonly name = '$script';

	public constructor(
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!this.templateStorage.has('text', filePath)) {
			throw new Error(`Cannot find script file ${filePath}.`);
		}

		return `<script type="text/javascript" src="${Handlebars.Utils.escapeExpression(filePath)}" /></script>`;
	}
}
