import { DataSerializer } from './data/data-serializer';
import { PagesDataGenerator } from './data/pages-data-generator';
import { exportData, exportRelease, exportTemplate } from './exporter';
import { MemoryStorage } from './memory-storage';
import { TemplateManifest } from './model';
import { PagesResolver } from './pages-resolver';
import { TemplateRenderer } from './renderer/template-renderer';
import { ContentType } from './storage';

describe('Exporter', () => {

	it('exportTemplate', () => {
		const storage = new MemoryStorage();
		storage.setContent('text', 'template.yaml', '...');
		storage.setContent('text', 'index.html', '<html>');
		storage.setContent('text', 'content/markdown/art.md', '...');
		storage.setContent('binary', 'image.jpg', '...');

		const files: { [filePath: string]: ContentType } = {};
		exportTemplate(storage, (filePath, contentType, content) => {
			expect(content).toBeDefined();
			files[filePath] = contentType;
		});

		expect(files['template.yaml']).toEqual('text');
		expect(files['index.html']).toEqual('text');
		expect(files['content/markdown/art.md']).toEqual('text');
		expect(files['image.jpg']).toEqual('binary');
	});

	it('exportData', () => {
		const storage = new MemoryStorage();
		storage.setContent('text', 'content/markdown/art.md', '...');
		storage.setContent('dataUrl', 'content/image/image.gif', '...');

		const manifest: TemplateManifest = {
			meta: {
				name: 'foo',
				author: 'foo',
				exportable: true,
				filePaths: [],
				license: 'MIT',
				version: 1
			},
			dataContract: {
				zones: {}
			},
			pages: {}
		};
		const data = { A: { B: { C: 1 } } };
		const dataSerializer = new DataSerializer();

		const files: { [filePath: string]: ContentType } = {};
		exportData(manifest, data, storage, dataSerializer, (filePath, contentType, content) => {
			expect(content).toBeDefined();
			files[filePath] = contentType;
		});

		expect(files['content/markdown/art.md']).toEqual('text');
		expect(files['content/image/image.gif']).toEqual('dataUrl');
		expect(files['data.json']).toEqual('text');
	});

	it('exportRelease', () => {
		const contentStorage = new MemoryStorage();
		contentStorage.setContent('binary', 'content/image/screenshot.jpg', '...');
		contentStorage.setContent('text', 'content/markdown/art.md', '...');
		contentStorage.setContent('text', 'data.json', '{}');

		const templateStorage = new MemoryStorage();
		templateStorage.setContent('binary', 'background.jpg', '...');
		templateStorage.setContent('text', 'style.css', '...');
		templateStorage.setContent('text', 'page.html', '<html>');
		templateStorage.setContent('text', 'header.partial', '...');
		templateStorage.setContent('text', 'content/markdown/default.md', '...');

		const pagesResolver = new PagesResolver();
		const pageDataGenerator = new PagesDataGenerator();
		const templateRenderer = new TemplateRenderer(false, templateStorage, contentStorage, pageDataGenerator);

		const manifest: TemplateManifest = {
			meta: {
				name: 'foo',
				author: 'foo',
				exportable: true,
				filePaths: [],
				license: 'MIT',
				version: 1
			},
			dataContract: {
				zones: {}
			},
			pages: {
				PAGE: {
					filePath: 'page.html',
					templateFilePath: 'page.html',
					multiplier: {
						dataPath: 'PAGES.PAGES.PAGES'
					}
				}
			}
		};
		const data = {
			PAGES: {
				PAGES: {
					PAGES: [
						{ A: 1 },
						{ A: 2 }
					]
				}
			}
		};

		const files: { [filePath: string]: ContentType } = {};
		exportRelease(manifest, data, contentStorage, templateStorage, pagesResolver, templateRenderer, (filePath, contentType, content) => {
			expect(content).toBeDefined();
			files[filePath] = contentType;
		});

		expect(files['content/image/screenshot.jpg']).toEqual('binary');
		expect(files['content/markdown/art.md']).toBeUndefined();
		expect(files['data.json']).toBeUndefined();

		expect(files['style.css']).toEqual('text');
		expect(files['background.jpg']).toEqual('binary');
		expect(files['header.partial']).toBeUndefined();
		expect(files['content/markdown/default.md']).toBeUndefined();

		expect(files['page-1.html']).toEqual('text');
		expect(files['page-2.html']).toEqual('text');
	});
});
