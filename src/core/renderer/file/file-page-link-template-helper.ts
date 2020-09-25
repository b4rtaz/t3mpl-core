import * as Handlebars from 'handlebars';

import { relativize } from '../../utils/path-utils';
import { TemplateHelper } from '../template-helper';

export class FilePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public constructor(
		private readonly currentPagePath: string) {
	}

	public execute(pageFilePath: string, title: string, className?: string): string {
		const relativeFilePath = relativize(this.currentPagePath, pageFilePath);

		let html = '<a href="';
		html += Handlebars.Utils.escapeExpression(relativeFilePath);
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
