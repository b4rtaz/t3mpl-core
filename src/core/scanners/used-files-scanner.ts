import { DataPath } from '../data/data-path';
import { CollectionPropertyContract, DataContract, PropertyContract, PropertyContractType } from '../model';
import { ReadableStorage } from '../storage';
import { isRelativeUrl } from '../utils/url-utils';
import { HtmlImagesScanner } from './html-images-scanner';
import { MarkdownImagesScanner } from './markdown-images-scanner';

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
					this.scanHtmlImages(html, usedFilePaths);
				}
				break;

			case PropertyContractType.markdown:
				const mdFilePath = DataPath.parse(dataPath).get(data);
				if (mdFilePath) {
					usedFilePaths.push(mdFilePath);

					const mdContent = this.contentStorage.getContent('text', mdFilePath);
					this.scanMarkdown(mdContent, usedFilePaths);
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

	private scanMarkdown(content: string, usedFilePaths: string[]) {
		const filePaths = MarkdownImagesScanner.scanUrls(content)
			.filter(url => isRelativeUrl(url));
		usedFilePaths.push(...filePaths);
	}

	private scanHtmlImages(html: string, usedFilePaths: string[]) {
		const filePaths = HtmlImagesScanner.scanUrls(html)
			.filter(url => isRelativeUrl(url));
		usedFilePaths.push(...filePaths);
	}
}
