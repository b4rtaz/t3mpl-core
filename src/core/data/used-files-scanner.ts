import * as marked from 'marked';

import { CollectionPropertyContract, DataContract, PropertyContract, PropertyContractType } from '../model';
import { ReadableStorage } from '../storage';
import { isRelativeUrl } from '../utils/url-utils';
import { DataPath } from './data-path';

export class UsedFilesScanner {

	public constructor(
		private readonly contentStorage: ReadableStorage) {
	}

	public scan(dataContract: DataContract, data: any): string[] {
		const usedFilePaths: string[] = [];

		for (const zoneName of Object.keys(dataContract.zones)) {
			const zone = dataContract.zones[zoneName];
			for (const sectionName of Object.keys(zone.sections)) {
				const section = zone.sections[sectionName];
				for (const propertyName of Object.keys(section.properties)) {
					const property = section.properties[propertyName];
					const dataPath = `${zoneName}.${sectionName}.${propertyName}`;
					this.scanProperty(property, dataPath, data, usedFilePaths);
				}
			}
		}
		return usedFilePaths;
	}

	private scanProperty(contract: PropertyContract, dataPath: string, data: any, usedFilePaths: string[]) {
		switch (contract.type) {
			case PropertyContractType.image:
				const imageFilePath = DataPath.parse(dataPath).get(data);
				if (imageFilePath) {
					usedFilePaths.push(imageFilePath);
				}
				break;

			case PropertyContractType.html:
				const htmlFilePath = DataPath.parse(dataPath).get(data);
				if (htmlFilePath) {
					usedFilePaths.push(htmlFilePath);
					const html = this.contentStorage.getContent('text', htmlFilePath);
					this.scanHtml(html, usedFilePaths);
				}
				break;

			case PropertyContractType.markdown:
				const mdFilePath = DataPath.parse(dataPath).get(data);
				if (mdFilePath) {
					usedFilePaths.push(mdFilePath);

					const markdown = this.contentStorage.getContent('text', mdFilePath);
					const tokens = marked.lexer(markdown);
					this.scanMarkdown(tokens, usedFilePaths);
				}
				break;

			case PropertyContractType.collection:
				const cpc = contract as CollectionPropertyContract;
				const items = DataPath.parse(dataPath).get(data);

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					for (const propertyName of Object.keys(item)) {
						const propertyContract = cpc.properties[propertyName];
						const propDataPath = `${dataPath}[${i}].${propertyName}`;
						this.scanProperty(propertyContract, propDataPath, data, usedFilePaths);
					}
				}
				break;
		}
	}

	private scanMarkdown(tokens: marked.TokensList, usedFilePaths: string[]) {
		for (const token of tokens) {
			const image = token as marked.Tokens.Image;
			if (image.type === 'image') {
				usedFilePaths.push(image.href);
				continue;
			}

			const html = token as marked.Tokens.HTML;
			if (html.type === 'html') {
				this.scanHtml(html.raw, usedFilePaths);
				continue;
			}

			const children = (token as any).tokens;
			if (children) {
				this.scanMarkdown(children, usedFilePaths);
				continue;
			}
		}
	}

	private scanHtml(html: string, usedFilePaths: string[]) {
		const regexp = new RegExp(/<\s*img[^>]*src=["']([^"']+)["'][^>]*>/gi);
		let result: RegExpExecArray;
		do {
			result = regexp.exec(html);
			if (result) {
				const url = result[1];
				if (isRelativeUrl(url)) {
					usedFilePaths.push(result[1]);
				}
			}
		} while (result);
	}
}
