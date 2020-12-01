import * as Handlebars from 'handlebars';

import { TemplateHelper } from '../template-helper';
import { FilePageLinkBuilder } from './file-page-link-builder';
import { FileUrlBuilder } from './file-url-builder';

export class FilePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder) {
	}

	public execute(pageVirtualFilePath: string, title: string, className?: string): string {
		const url = this.fileUrlBuilder.build(pageVirtualFilePath);
		const hasClassName = className && typeof(className) === 'string';

		return FilePageLinkBuilder.buildStartTag(url, hasClassName ? className : null) +
			Handlebars.Utils.escapeExpression(title) +
			FilePageLinkBuilder.buildEndTag();
	}
}
