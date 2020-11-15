import {
	HTML_CONTENT_BASE_PATH,
	MARKDOWN_CONTENT_BASE_PATH,
	PARTIAL_EXT,
	TEMPLATE_DATA_FILE_NAME,
	TEMPLATE_MANIFEST_FILE_NAME
} from './constants';
import { DataSerializer } from './data/data-serializer';
import { UsedFilesScanner } from './data/used-files-scanner';
import { TemplateData, TemplateConfiguration, TemplateManifest } from './model';
import { PagesResolver } from './pages-resolver';
import { TemplateRenderer } from './renderer/template-renderer';
import { ContentType, ReadableStorage } from './storage';
import { getFileExt } from './utils/path-utils';

export class Exporter {

	public static exportRelease(
		templateManifest: TemplateManifest,
		data: any,
		contentStorage: ReadableStorage,
		templateStorage: ReadableStorage,
		pagesResolver: PagesResolver,
		tempateRenderer: TemplateRenderer,
		usedFilesScanner: UsedFilesScanner,
		handler: ExportHandler
	) {
		const pages = pagesResolver.resolve(templateManifest.pages, data);
		const exportedFilePaths = [];

		for (const page of pages) {
			const content = tempateRenderer.render(pages, page, data);
			handler(page.filePath, 'text', content);
			exportedFilePaths.push(page.filePath);
		}

		const usedFilesPaths = usedFilesScanner.scan(templateManifest.dataContract, data);

		exportStorage(contentStorage, exportedFilePaths, handler, filePath => {
			return !filePath.startsWith(HTML_CONTENT_BASE_PATH) &&
				!filePath.startsWith(MARKDOWN_CONTENT_BASE_PATH) &&
				filePath !== TEMPLATE_DATA_FILE_NAME &&
				usedFilesPaths.includes(filePath);
		});
		exportStorage(templateStorage, exportedFilePaths, handler, filePath => {
			const fileExt = getFileExt(filePath);
			return fileExt !== PARTIAL_EXT &&
				filePath !== TEMPLATE_MANIFEST_FILE_NAME &&
				!filePath.startsWith(HTML_CONTENT_BASE_PATH) &&
				!filePath.startsWith(MARKDOWN_CONTENT_BASE_PATH) &&
				!pages.find(p => p.templateFilePath === filePath);
		});
	}

	public static exportTemplate(templateStorage: ReadableStorage, handler: ExportHandler) {
		const exportedFilePaths = [];
		exportStorage(templateStorage, exportedFilePaths, handler, () => true);
	}

	public static exportData(
		templateManifest: TemplateManifest,
		configuration: TemplateConfiguration,
		data: any,
		contentStorage: ReadableStorage,
		dataSerializer: DataSerializer,
		usedFilesScanner: UsedFilesScanner,
		handler: ExportHandler
	) {
		const usedFilesPaths = usedFilesScanner.scan(templateManifest.dataContract, data);

		const exportedFilePaths = [TEMPLATE_DATA_FILE_NAME];
		exportStorage(contentStorage, exportedFilePaths, handler,
			(filePath) => usedFilesPaths.includes(filePath));

		const td: TemplateData = {
			meta: {
				name: templateManifest.meta.name,
				version: templateManifest.meta.version,
				filePaths: exportedFilePaths
			},
			configuration,
			data: data
		};

		const tdData = dataSerializer.serialize(td);
		handler(TEMPLATE_DATA_FILE_NAME, 'text', tdData);
	}
}

function exportStorage(storage: ReadableStorage, usedFilePaths: string[], handler: ExportHandler, filter: (filePath: string) => boolean) {
	const textFilePaths = storage.getFilePaths('text');
	for (const filePath of textFilePaths) {
		if (!usedFilePaths.includes(filePath) && filter(filePath)) {
			const content = storage.getContent('text', filePath);
			handler(filePath, 'text', content);
			usedFilePaths.push(filePath);
		}
	}
	const binaryFilePaths = storage.getFilePaths(['dataUrl', 'binary']);
	for (const filePath of binaryFilePaths) {
		if (!usedFilePaths.includes(filePath) && filter(filePath)) {
			const type = storage.getEntry(['binary', 'dataUrl'], filePath).contentType;
			const content = storage.getContent(type, filePath);
			handler(filePath, type, content);
			usedFilePaths.push(filePath);
		}
	}
}

export type ExportHandler = (filePath: string, contentType: ContentType, content: string) => void;
