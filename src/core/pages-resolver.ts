import { DataPath } from './data/data-path';
import { Page, PageContract, PageContractMap } from './model';
import { extendFileName, replaceFileName } from './utils/path-utils';

export class PagesResolver {

	public resolve(contractMap: PageContractMap, data: any): Page[] {
		const pages: Page[] = [];
		const dividers: { pageName: string, contract: PageContract, insertIndex: number }[] = [];

		for (const pageName of Object.keys(contractMap)) {
			const contract = contractMap[pageName];
			if (contract.multiplier) {
				this.resolveMultiplier(pages, pageName, contract, data);
			} else if (contract.divider) {
				dividers.push({
					pageName,
					contract,
					insertIndex: pages.length
				});
			} else {
				this.resolveSingle(pages, pageName, contract);
			}
		}

		for (const i of dividers) {
			this.resolveDivider(pages, i.pageName, i.contract, i.insertIndex);
		}
		return pages;
	}

	private resolveSingle(pages: Page[], pageName: string, contract: PageContract) {
		pages.push({
			name: pageName,
			filePath: contract.filePath,
			templateFilePath: contract.templateFilePath,
			dataPath: null,
			index: null
		});
	}

	private resolveMultiplier(pages: Page[], pageName: string, contract: PageContract, data: any) {
		const collection = DataPath.parse(contract.multiplier.dataPath).get(data);

		if (!Array.isArray(collection)) {
			throw new Error('Unsuported data type. Collection was expected.');
		}

		for (let i = 0; i < collection.length; i++) {
			let filePath = null;
			if (contract.multiplier.fileNameDataPath) {
				const value = DataPath.parse(contract.multiplier.fileNameDataPath).get(collection[i]);
				if (value) {
					filePath = replaceFileName(contract.filePath, value);
				}
			}
			if (filePath === null) {
				const suffix = (collection.length - i).toString();
				filePath = extendFileName(contract.filePath, suffix);
			}

			pages.push({
				name: pageName,
				filePath,
				templateFilePath: contract.templateFilePath,
				dataPath: `${contract.multiplier.dataPath}[${i}]`,
				index: i
			});
		}
	}

	private resolveDivider(pages: Page[], pageName: string, contract: PageContract, insertIndex: number) {
		const sourcePages = pages.filter(p => p.name === contract.divider.pageName);

		const divisor = contract.divider.divisor;
		const fragments = Math.ceil(sourcePages.length / divisor);

		for (let i = 0; i < fragments; i++) {
			const offset = divisor * i;
			const subPages: Page[] = [];

			for (let j = offset; j < sourcePages.length && j < offset + divisor; j++) {
				subPages.push(sourcePages[j]);
			}

			const filePath = (i === 0 && contract.divider.firstFilePath)
				? contract.divider.firstFilePath
				: extendFileName(contract.filePath, (i + 1).toString());

			const page: Page = {
				name: pageName,
				filePath,
				templateFilePath: contract.templateFilePath,
				subPages,
				index: i
			};
			pages.splice(insertIndex, 0, page);
			insertIndex++;
		}
	}
}
