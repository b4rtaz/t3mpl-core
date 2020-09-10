import { Page } from '../model';
import { PageData, PagesDataGenerator } from './pages-data-generator';

describe('PagesDataGenerator', () => {

	it('generateData() returns proper value', () => {
		const pages: Page[] = [
			{ name: 'ALFA', filePath: 'alfa0.html', templateFilePath: 'alfa.html', dataPath: 'A.B.C[0]', index: 0 },
			{ name: 'ALFA', filePath: 'alfa1.html', templateFilePath: 'alfa.html', dataPath: 'A.B.C[1]', index: 1 },
			{ name: 'ALFA', filePath: 'alfa2.html', templateFilePath: 'alfa.html', dataPath: 'A.B.C[2]', index: 2 },
			{ name: 'BETA', filePath: 'beta.html', templateFilePath: 'beta.html' },
		];

		pages.push({ name: 'ENTRIES', filePath: 'entries0.html', templateFilePath: 'entires.html', subPages: [ pages[0], pages[1] ], index: 0 });

		const data = {
			A: {
				B: {
					C: [
						{ TITLE: 'a' },
						{ TITLE: 'b' },
						{ TITLE: 'c' },
					]
				}
			}
		};

		const generator = new PagesDataGenerator();
		const d = generator.generateData(pages, pages[0], data);

		expect(d.$PAGE.FILE_PATH).toEqual('alfa0.html');
		const alfa = d.$PAGES.ALFA as PageData[];

		const alfa0 = alfa[0];
		expect(alfa0.IS_CURRENT).toBeTruthy();
		expect(alfa0.FILE_PATH).toEqual('alfa0.html');
		expect(alfa0.DATA.TITLE).toEqual('a');
		expect(alfa0.$SUB_PAGES).toBeFalsy();
		expect(alfa0.SUB_PAGE_NUMBER).toEqual(1);
		expect(alfa0.PREVIOUS_PAGE).toBeUndefined();
		expect(alfa0.NEXT_PAGE.FILE_PATH).toEqual('alfa1.html');

		const alfa1 = alfa[1];
		expect(alfa1.FILE_PATH).toEqual('alfa1.html');
		expect(alfa1.DATA.TITLE).toEqual('b');
		expect(alfa1.SUB_PAGE_NUMBER).toEqual(2);
		expect(alfa1.PREVIOUS_PAGE.FILE_PATH).toEqual('alfa0.html');
		expect(alfa1.NEXT_PAGE.FILE_PATH).toEqual('alfa2.html');

		const alfa2 = alfa[2];
		expect(alfa2.FILE_PATH).toEqual('alfa2.html');
		expect(alfa2.DATA.TITLE).toEqual('c');
		expect(alfa2.SUB_PAGE_NUMBER).toEqual(3);
		expect(alfa2.PREVIOUS_PAGE.FILE_PATH).toEqual('alfa1.html');
		expect(alfa2.NEXT_PAGE).toBeUndefined();

		const beta = d.$PAGES.BETA as PageData;
		expect(beta.FILE_PATH).toEqual('beta.html');
		expect(beta.DATA).toBeUndefined();
		expect(beta.PREVIOUS_PAGE).toBeUndefined();
		expect(beta.NEXT_PAGE).toBeUndefined();

		const entries = d.$PAGES.ENTRIES as PageData[];
		const entries0 = entries[0];
		expect(entries0.FILE_PATH).toEqual('entries0.html');
		expect(entries0.SUB_PAGE_NUMBER).toEqual(1);
		expect(entries0.DATA).toBeFalsy();
		expect(entries0.$SUB_PAGES).toContain(alfa0);
		expect(entries0.$SUB_PAGES).toContain(alfa1);
	});
});
