import * as Handlebars from 'handlebars';

import { TemplateHelper } from '../template-helper';
import { InlinePageLinkBuilder } from './inline-page-link-builder';

export class InlinePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public execute(pageVirtualFilePath: string, title: string, className?: string): string {
		const hasClassName = className && typeof(className) === 'string';

		return InlinePageLinkBuilder.buildStartTag(pageVirtualFilePath, hasClassName ? className : null) +
			Handlebars.Utils.escapeExpression(title) +
			InlinePageLinkBuilder.buildEndTag();
	}
}
