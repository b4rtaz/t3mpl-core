import * as Handlebars from 'handlebars';

import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FilePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder) {
	}

	public execute(pageVirtualFilePath: string, title: string, className?: string): string {
		const url = this.fileUrlBuilder.build(pageVirtualFilePath);

		let html = '<a href="';
		html += Handlebars.Utils.escapeExpression(url);
		html += '"';
		if (className && typeof(className) === 'string') {
			html += ' class="';
			html += Handlebars.Utils.escapeExpression(className);
			html += '"';
		}
		html += '>';
		html += Handlebars.Utils.escapeExpression(title);
		html += '</a>';
		return html;
	}
}
