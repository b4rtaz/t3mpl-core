import { DataSerializer } from './data/data-serializer';
import { PagesDataGenerator } from './data/pages-data-generator';
import { UsedFilesScanner } from './data/used-files-scanner';
import { Exporter } from './exporter';
import { MemoryStorage } from './memory-storage';
import { CollectionPropertyContract, PagePathStrategy, PropertyContractType, TemplateConfiguration, TemplateManifest } from './model';
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
		Exporter.exportTemplate(storage, (filePath, contentType, content) => {
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
		storage.setContent('text', 'content/markdown/used.md', 'used');
		storage.setContent('text', 'content/markdown/not-used.md', 'not used');
		storage.setContent('dataUrl', 'content/image/used.gif', 'used');
		storage.setContent('dataUrl', 'content/image/not-used.gif', 'not used');

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
				zones: {
					ALFA: {
						sections: {
							BETA: {
								properties: {
									MARKDOWN: {
										type: PropertyContractType.markdown,
										required: true
									},
									IMAGE: {
										type: PropertyContractType.image,
										required: true
									}
								}
							}
						}
					}
				}
			},
			pages: {}
		};
		const configuration: TemplateConfiguration = {
			pagePathStrategy: PagePathStrategy.absolute
		};
		const data = {
			ALFA: {
				BETA: {
					MARKDOWN: 'content/markdown/used.md',
					IMAGE: 'content/image/used.gif'
				}
			}
		};
		const dataSerializer = new DataSerializer();
		const usedFilesScanner = new UsedFilesScanner(storage);

		const files: { [filePath: string]: ContentType } = {};
		Exporter.exportData(manifest, configuration, data, storage, dataSerializer, usedFilesScanner, (filePath, contentType, content) => {
			expect(content).toBeDefined();
			files[filePath] = contentType;
		});

		expect(files['content/markdown/used.md']).toEqual('text');
		expect(files['content/markdown/not-used.md']).toBeUndefined();
		expect(files['content/image/used.gif']).toEqual('dataUrl');
		expect(files['content/image/not-used.gif']).toBeUndefined();
		expect(files['data.json']).toEqual('text');
	});

	it('exportRelease', () => {
		const contentStorage = new MemoryStorage();
		contentStorage.setContent('binary', 'content/image/used-image.jpg', '...');
		contentStorage.setContent('binary', 'content/image/not-used-image.jpg', '...');
		contentStorage.setContent('text', 'content/markdown/art.md', '...');
		contentStorage.setContent('text', 'data.json', '{}');

		const templateStorage = new MemoryStorage();
		templateStorage.setContent('binary', 'background.jpg', '...');
		templateStorage.setContent('text', 'style.css', '...');
		templateStorage.setContent('text', 'page.html', '<html>');
		templateStorage.setContent('text', 'header.partial', '...');
		templateStorage.setContent('text', 'content/markdown/default.md', '...');
		templateStorage.setContent('text', 'template.yaml', '...');

		const pagesResolver = new PagesResolver(PagePathStrategy.absolute);
		const pageDataGenerator = new PagesDataGenerator();
		const templateRenderer = new TemplateRenderer(false, templateStorage, contentStorage, pageDataGenerator);
		const usedFilesScanner = new UsedFilesScanner(contentStorage);

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
				zones: {
					PAGES: {
						sections: {
							PAGES: {
								properties: {
									PAGES: {
										type: PropertyContractType.collection,
										required: true,
										properties: {
											IMAGE: {
												type: PropertyContractType.image,
												required: true
											}
										}
									} as CollectionPropertyContract
								}
							}
						}
					}
				}
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
						{ IMAGE: 'content/image/used-image.jpg' },
						{ IMAGE: 'content/image/used-image.jpg' }
					]
				}
			}
		};

		const files: { [filePath: string]: ContentType } = {};
		Exporter.exportRelease(manifest, data, contentStorage, templateStorage, pagesResolver, templateRenderer, usedFilesScanner,
			(filePath, contentType, content) => {
				expect(content).toBeDefined();
				files[filePath] = contentType;
			});

		expect(files['content/image/used-image.jpg']).toEqual('binary');
		expect(files['content/image/not-used-image.jpg']).toBeUndefined();
		expect(files['content/markdown/art.md']).toBeUndefined();
		expect(files['data.json']).toBeUndefined();

		expect(files['style.css']).toEqual('text');
		expect(files['background.jpg']).toEqual('binary');
		expect(files['header.partial']).toBeUndefined();
		expect(files['content/markdown/default.md']).toBeUndefined();
		expect(files['template.yaml']).toBeUndefined();

		expect(files['page-1.html']).toEqual('text');
		expect(files['page-2.html']).toEqual('text');
	});
});
