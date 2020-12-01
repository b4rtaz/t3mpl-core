import { PagesDataGenerator } from '../data/pages-data-generator';
import { MemoryStorage } from '../memory-storage';
import { Page, PagePathStrategy, TemplateConfiguration, TemplateData, TemplateDataMeta } from '../model';
import { getHelpers, getPartials, TemplateRenderer } from './template-renderer';

describe('TemplateRenderer', () => {

	it('getHelpers() returns the same amount of helpers for two modes', () => {
		const templateStorage = new MemoryStorage();
		const contentStorage = new MemoryStorage();
		const configuration: TemplateConfiguration = {
			pagePathStrategy: PagePathStrategy.absolute
		};

		const inline = getHelpers(true, 'index.html', configuration, templateStorage, contentStorage);
		const notInline = getHelpers(false, 'index.html', configuration, templateStorage, contentStorage);

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
		templateStorage.setContent('text', 'page.html', '{{> header}}_a_{{A.B.C}}{{#if $INLINE}}!!{{/if}}_z_{{{$copyright}}}');
		templateStorage.setContent('text', 'header.partial', '1234');
		const contentStorage = new MemoryStorage();
		const pagesDataGenerator = new PagesDataGenerator();
		const renderer = new TemplateRenderer(true, templateStorage, contentStorage, pagesDataGenerator);

		const data = {
			A: {
				B: {
					C: 'Q'
				}
			}
		};
		const templateData: TemplateData = {
			meta: {} as TemplateDataMeta,
			data: data,
			configuration: {
				pagePathStrategy: PagePathStrategy.absolute
			}
		};

		const pages: Page[] = [
			{ name: 'PAGE', virtualFilePath: 'page.html', filePath: 'page.html', templateFilePath: 'page.html' }
		];

		const html = renderer.render(pages, pages[0], templateData);

		expect(html.startsWith('1234_a_Q!!_z_')).toBeTrue();
		expect((<any>data).$PAGES).toBeUndefined();
		expect((<any>data).$PAGE).toBeUndefined();
	});
});
