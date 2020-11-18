import { MarkdownImagesScanner } from '../../scanners/markdown-images-scanner';
import { ReadableStorage } from '../../storage';
import { isRelativeUrl } from '../../utils/url-utils';
import { TemplateHelper } from '../template-helper';
import { FileUrlBuilder } from './file-url-builder';

export class FileMarkdownThumbnailHelper implements TemplateHelper {
	public readonly name = '$markdown_thumbnail';

	public constructor(
		private readonly fileUrlBuilder: FileUrlBuilder,
		private readonly contentStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		if (!filePath) {
			return null;
		}

		const content = this.contentStorage.getContent('text', filePath);

		const urls = MarkdownImagesScanner.scanUrls(content)
			.filter(url => isRelativeUrl(url) && this.contentStorage.has(['binary', 'dataUrl'], url));

		return urls.length > 0 ? this.fileUrlBuilder.build(urls[0]) : null;
	}
}
