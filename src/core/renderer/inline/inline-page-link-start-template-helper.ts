import { TemplateHelper } from '../template-helper';
import { InlinePageLinkBuilder } from './inline-page-link-builder';

export class InlinePageLinkStartTemplateHelper implements TemplateHelper {
	public name = '$page_link_start';

	public execute(pageVirtualFilePath: string, className?: string): string {
		const hasClassName = className && typeof(className) === 'string';

		return InlinePageLinkBuilder.buildStartTag(pageVirtualFilePath, hasClassName ? className : null);
	}
}
