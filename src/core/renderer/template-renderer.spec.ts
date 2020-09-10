import { MemoryStorage } from '../memory-storage';
import { getHelpers, getPartials, TemplateRenderer } from './template-renderer';
import { PagesDataGenerator } from '../data/pages-data-generator';
import { Page } from '../model';

describe('TemplateRenderer', () => {

	it('getHelpers() returns the same amount of helpers for two modes', () => {
		const templateStorage = new MemoryStorage();
		const contentStorage = new MemoryStorage();

		const inline = getHelpers(true, templateStorage, contentStorage);
		const notInline = getHelpers(false, templateStorage, contentStorage);

		expect(inline.length).toEqual(notInline.length);
	});

	it('getPartials() returns proper values', () => {
		const templateStorage = new MemoryStorage();
		templateStorage.setContent('text', 'q.partial', '<html>');
		templateStorage.setContent('text', 'www/c.partial', '<body>');
		templateStorage.setContent('text', 'x.partial', '<body>');
		templateStorage.setContent('text', 'z.pdf', '#pdf');

		const partials = getPartials('x.partial', templateStorage);

		const partialKeys = Object.keys(partials);
		expect(partialKeys.length).toEqual(2);
		expect(partialKeys).toContain('q');
		expect(partialKeys).toContain('www/c');
	});

	it('render() returns proper value', () => {
		const templateStorage = new MemoryStorage();
		templateStorage.setContent('text', 'page.html', 'a_{{A.B.C}}_z');
		const contentStorage = new MemoryStorage();
		const pagesDataGenerator = new PagesDataGenerator();
		const renderer = new TemplateRenderer(false, templateStorage, contentStorage, pagesDataGenerator);

		const data = {
			A: {
				B: {
					C: 'Q'
				}
			}
		};
		const pages: Page[] = [
			{ name: 'PAGE', filePath: 'page.html', templateFilePath: 'page.html' }
		];

		const html = renderer.render(pages, pages[0], data);

		expect(html).toEqual('a_Q_z');
		expect((<any>data).$PAGES).toBeUndefined();
		expect((<any>data).$PAGE).toBeUndefined();
	});
});
