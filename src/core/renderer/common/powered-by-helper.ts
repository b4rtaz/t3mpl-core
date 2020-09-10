import * as Handlebars from 'handlebars';

import { PROJECT_WEBSITE_URL } from '../../constants';

export function poweredByHelper(linkClassName: string = null): string {
	let html = `Powered by <a href="${Handlebars.Utils.escapeExpression(PROJECT_WEBSITE_URL)}" target="_blank" title="T3MPL Editor"`;
	if (linkClassName && typeof(linkClassName) === 'string') {
		html += ` class="${Handlebars.Utils.escapeExpression(linkClassName)}"`;
	}
	html += '>T3MPL</a>';
	return html;
}
