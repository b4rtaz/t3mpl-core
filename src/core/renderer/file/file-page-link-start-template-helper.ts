import { TemplateHelper } from '../template-helper';
import { FilePageLinkBuilder } from './file-page-link-builder';
import { FileUrlBuilder } from './file-url-builder';

export class FilePageLinkStartTemplateHelper implements TemplateHelper {
	public name = '$page_link_start';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder) {
	}

	public execute(pageVirtualFilePath: string, className?: string): string {
		const url = this.fileUrlBuilder.build(pageVirtualFilePath);
		const hasClassName = className && typeof(className) === 'string';

		return FilePageLinkBuilder.buildStartTag(url, hasClassName ? className : null);
	}
}
