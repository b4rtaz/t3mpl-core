import * as Handlebars from 'handlebars';
import { HTMLElement } from 'node-html-parser';

import { TemplateHelper } from '../template-helper';

export class InlinePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public execute(pageVirtualFilePath: string, title: string, className?: string): string {
		const a = new HTMLElement('a', {});
		a.setAttribute('href', '#/' + pageVirtualFilePath);
		a.setAttribute('onclick', 'window.parent.postMessage(\'openPage:' + pageVirtualFilePath + '\', \'*\'); event.preventDefault();');
		if (className && typeof(className) === 'string') {
			a.setAttribute('class', className);
		}
		a.set_content(Handlebars.Utils.escapeExpression(title));
		return a.outerHTML;
	}
}
