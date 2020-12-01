import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FilePageLinkUrlTemplateHelper implements TemplateHelper {
	public name = '$page_link_url';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder) {
	}

	public execute(pageVirtualFilePath: string): string {
		return this.fileUrlBuilder.build(pageVirtualFilePath);
	}
}
