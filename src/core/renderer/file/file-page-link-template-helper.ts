import * as Handlebars from 'handlebars';

import { TemplateHelper } from '../template-helper';

export class FilePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public execute(pageFilePath: string, title: string, className?: string): string {
		let html = '<a href="';
		html += Handlebars.Utils.escapeExpression(pageFilePath);
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
