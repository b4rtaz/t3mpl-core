import { HTML_CONTENT_BASE_PATH, HTML_CONTENT_EXT, MARKDOWN_CONTENT_BASE_PATH, MARKDOWN_CONTENT_EXT } from '../constants';
import {
	BooleanPropertyContract,
	ChoicePropertyContract,
	CollectionPropertyContract,
	ColorPropertyContract,
	DataContract,
	DateTimePropertyContract,
	HtmlPropertyContract,
	ImagePropertyContract,
	MarkdownPropertyContract,
	PropertyContract,
	PropertyContractMap,
	PropertyContractType,
	SectionContractMap,
	TextPropertyContract,
	ZoneContractMap
} from '../model';
import { ReadableStorage, WritableStorage } from '../storage';
import { dateToIsoString } from '../utils/date-utils';
import { generateFileName } from '../utils/file-name-generator';

export class DataActivator {

	public constructor(
		private readonly templateStorage: ReadableStorage,
		private readonly contentStorage: WritableStorage) {
	}

	public createInstance(dataContract: DataContract): any {
		return this.generateZones(dataContract.zones);
	}

	public createPropertiesInstance(map: PropertyContractMap): any {
		return this.generateProperties(map);
	}

	private generateZones(map: ZoneContractMap): any {
		const zones = {};
		for (const zoneName of Object.keys(map)) {
			const zone = map[zoneName];
			zones[zoneName] = this.generateSections(zone.sections);
		}
		return zones;
	}

	private generateSections(map: SectionContractMap): any {
		const sections = {};
		for (const sectionName of Object.keys(map)) {
			const section = map[sectionName];
			sections[sectionName] = this.generateProperties(section.properties);
		}
		return sections;
	}

	private generateProperties(map: PropertyContractMap): any {
		const properties = {};
		for (const propertyName of Object.keys(map)) {
			const property = map[propertyName];
			properties[propertyName] = this.generateProperty(propertyName, property);
		}
		return properties;
	}

	private generateProperty(propertyName: string, property: PropertyContract): any {
		switch (property.type) {
			case PropertyContractType.text:
				const textProperty = property as TextPropertyContract;
				return textProperty.defaultValue;

			case PropertyContractType.boolean:
				const boolProperty = property as BooleanPropertyContract;
				return boolProperty.defaultValue;

			case PropertyContractType.dateTime:
				const dateProperty = property as DateTimePropertyContract;
				if (dateProperty.defaultValue) {
					return dateProperty.defaultValue;
				}
				if (dateProperty.now) {
					return dateToIsoString(new Date());
				}
				return null;

			case PropertyContractType.html:
				const htmlProperty = property as HtmlPropertyContract;
				if (htmlProperty.defaultFilePath) {
					return this.cloneTextFile(htmlProperty.defaultFilePath, propertyName, HTML_CONTENT_BASE_PATH, HTML_CONTENT_EXT);
				}
				return null;

			case PropertyContractType.markdown:
				const mdProperty = property as MarkdownPropertyContract;
				if (mdProperty.defaultFilePath) {
					return this.cloneTextFile(mdProperty.defaultFilePath, propertyName, MARKDOWN_CONTENT_BASE_PATH, MARKDOWN_CONTENT_EXT);
				}
				return null;

			case PropertyContractType.image:
				const imageProperty = property as ImagePropertyContract;
				if (imageProperty.defaultFilePath) {
					const entry = this.templateStorage.getEntry(['dataUrl', 'binary'], imageProperty.defaultFilePath);
					this.contentStorage.setContent(entry.contentType, imageProperty.defaultFilePath, entry.content);
					return imageProperty.defaultFilePath;
				}
				return null;

			case PropertyContractType.choice:
				const choiceProperty = property as ChoicePropertyContract;
				return choiceProperty.defaultValue ? choiceProperty.defaultValue : null;

			case PropertyContractType.color:
				const colorProperty = property as ColorPropertyContract;
				return colorProperty.defaultValue ? colorProperty.defaultValue : null;

			case PropertyContractType.collection:
				const collectionProperty = property as CollectionPropertyContract;
				let occurs: number = null;
				if (collectionProperty.defaultOccurrences) {
					occurs = collectionProperty.defaultOccurrences;
				}
				if (collectionProperty.min && occurs === null) {
					occurs = collectionProperty.min;
				}
				if (occurs) {
					const items = [];
					for (let  i = 0; i < occurs; i++) {
						items.push(this.generateProperties(collectionProperty.properties));
					}
					return items;
				} else {
					return [];
				}

			default:
				throw new Error(`Not supported property type: ${property.type}.`);
		}
	}

	private cloneTextFile(defaultFilePath: string, propertName: string, basePath: string, fileExt: string): string {
		const content = this.templateStorage.getContent('text', defaultFilePath);
		const newFilePath = basePath + generateFileName({
			name: propertName,
			fileExt
		});
		this.contentStorage.setContent('text', newFilePath, content);
		return newFilePath;
	}
}
