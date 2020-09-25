import {
	HTML_CONTENT_BASE_PATH,
	MARKDOWN_CONTENT_BASE_PATH,
	PARTIAL_EXT,
	TEMPLATE_DATA_FILE_NAME,
	TEMPLATE_MANIFEST_FILE_NAME
} from './constants';
import { DataSerializer } from './data/data-serializer';
import { TemplateData, TemplateManifest } from './model';
import { PagesResolver } from './pages-resolver';
import { TemplateRenderer } from './renderer/template-renderer';
import { ContentType, ReadableStorage } from './storage';
import { getFileExt } from './utils/path-utils';

export function exportRelease(
	templateManifest: TemplateManifest,
	data: any,
	contentStorage: ReadableStorage,
	templateStorage: ReadableStorage,
	pagesResolver: PagesResolver,
	tempateRenderer: TemplateRenderer,
	handler: ExportHandler
) {
	const pages = pagesResolver.resolve(templateManifest.pages, data);
	const usedFilePaths = [];

	for (const page of pages) {
		const content = tempateRenderer.render(pages, page, data);
		handler(page.filePath, 'text', content);
		usedFilePaths.push(page.filePath);
	}

	exportStorage(contentStorage, usedFilePaths, handler, filePath => {
		return !filePath.startsWith(HTML_CONTENT_BASE_PATH) &&
			!filePath.startsWith(MARKDOWN_CONTENT_BASE_PATH) &&
			filePath !== TEMPLATE_DATA_FILE_NAME;
	});
	exportStorage(templateStorage, usedFilePaths, handler, filePath => {
		const fileExt = getFileExt(filePath);
		return fileExt !== PARTIAL_EXT &&
			filePath !== TEMPLATE_MANIFEST_FILE_NAME &&
			!filePath.startsWith(HTML_CONTENT_BASE_PATH) &&
			!filePath.startsWith(MARKDOWN_CONTENT_BASE_PATH) &&
			!pages.find(p => p.templateFilePath === filePath);
	});
}

export function exportTemplate(templateStorage: ReadableStorage, handler: ExportHandler) {
	const usedFilePaths = [];
	exportStorage(templateStorage, usedFilePaths, handler, () => true);
}

export function exportData(
	templateManifest: TemplateManifest,
	data: any,
	contentStorage: ReadableStorage,
	dataSerializer: DataSerializer,
	handler: ExportHandler
) {
	const usedFilePaths = [TEMPLATE_DATA_FILE_NAME];
	exportStorage(contentStorage, usedFilePaths, handler, () => true);

	const td: TemplateData = {
		meta: {
			name: templateManifest.meta.name,
			version: templateManifest.meta.version,
			filePaths: usedFilePaths
		},
		data: data
	};

	const tdData = dataSerializer.serialize(td);
	handler(TEMPLATE_DATA_FILE_NAME, 'text', tdData);
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
