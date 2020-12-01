import * as Handlebars from 'handlebars';

export class FilePageLinkBuilder {

	public static buildStartTag(url: string, className: string): string {
		let html = '<a href="';
		html += Handlebars.Utils.escapeExpression(url);
		html += '"';
		if (className) {
			html += ' class="';
			html += Handlebars.Utils.escapeExpression(className);
			html += '"';
		}
		html += '>';
		return html;
	}

	public static buildEndTag(): string {
		return '</a>';
	}
}
