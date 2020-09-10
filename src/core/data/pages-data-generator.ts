import { Page } from '../model';
import { DataPath } from './data-path';

export class PagesDataGenerator {

	public generateData(pages: Page[], currentPage: Page, data: any): PagesData {
		const pageDataMap: PageDataMap = {};
		const secondLoop: { row: PageData, subPages: Page[] }[] = [];

		let currentPageData: PageData = null;
		for (const page of pages) {
			const isCurrentPage: boolean = (page.filePath === currentPage.filePath);
			const pageData: PageData = {
				IS_CURRENT: isCurrentPage,
				FILE_PATH: page.filePath
			};
			if (page.dataPath) {
				let pageDataItems: PageData[] = pageDataMap[page.name] as PageData[];
				if (!pageDataItems) {
					pageDataItems = pageDataMap[page.name] = [];
				}
				pageData.SUB_PAGE_NUMBER = page.index + 1;
				pageData.DATA = DataPath.parse(page.dataPath).get(data);
				pageDataItems.push(pageData);
			} else if (page.subPages) {
				let pageDataItems: PageData[] = pageDataMap[page.name] as PageData[];
				if (!pageDataItems) {
					pageDataItems = pageDataMap[page.name] = [];
				}
				pageData.SUB_PAGE_NUMBER = page.index + 1;
				secondLoop.push({
					row: pageData,
					subPages: page.subPages
				});
				pageDataItems.push(pageData);
			} else {
				pageDataMap[page.name] = pageData;
			}
			if (isCurrentPage) {
				currentPageData = pageData;
			}
		}

		for (const p of secondLoop) {
			const pageName = p.subPages[0].name;
			const pageDataItems = pageDataMap[pageName] as PageData[];

			p.row.$SUB_PAGES = pageDataItems.filter(i => {
				return p.subPages.find(sp => sp.filePath === i.FILE_PATH);
			});
		}

		for (const pageName of Object.keys(pageDataMap)) {
			const p = pageDataMap[pageName];
			if (Array.isArray(p)) {
				for (let i = 0; i < p.length; i++) {
					if (i + 1 < p.length) {
						p[i].NEXT_PAGE = p[i + 1];
					}
					if (i - 1 >= 0) {
						p[i].PREVIOUS_PAGE = p[i - 1];
					}
				}
			}
		}

		return {
			$PAGES: pageDataMap,
			$PAGE: currentPageData
		};
	}
}

export interface PagesData {
	$PAGES: PageDataMap;
	$PAGE: PageData;
}

export interface PageDataMap {
	[pageName: string]: PageData[] | PageData;
}

export interface PageData {
	FILE_PATH: string;
	IS_CURRENT: boolean;

	// multiplier + divider
	PREVIOUS_PAGE?: PageData;
	NEXT_PAGE?: PageData;

	// multiplier
	DATA?: any;

	// divider
	SUB_PAGE_NUMBER?: number;
	$SUB_PAGES?: PageData[];
}
