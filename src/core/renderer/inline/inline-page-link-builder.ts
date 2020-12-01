import * as Handlebars from 'handlebars';

export class InlinePageLinkBuilder {

	public static buildStartTag(pageVirtualFilePath: string, className: string): string {
		let html = '<a href="';
		html += Handlebars.Utils.escapeExpression('#/' + pageVirtualFilePath);
		html += '" onclick="';
		html += Handlebars.Utils.escapeExpression(
			`window.parent.postMessage(\'openPage:${pageVirtualFilePath}\', \'*\'); event.preventDefault();`);
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
