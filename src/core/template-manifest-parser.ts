import * as jsyaml from 'js-yaml';
import * as moment from 'moment';

import {
	BooleanPropertyContract,
	ChoicePropertyContract,
	ChoicePropertyContractValues,
	CollectionPropertyContract,
	DataContract,
	DateTimePropertyContract,
	HtmlPropertyContract,
	ImagePropertyContract,
	MarkdownPropertyContract,
	PageContract,
	PageContractMap,
	PropertyContractMap,
	PropertyContractType,
	SectionContractMap,
	TemplateManifest,
	TemplateManifestMeta,
	TextPropertyContract,
	ZoneContractMap,
	ColorPropertyContract
} from './model';
import { getChoiceValuesSet, getTextValueSet } from './template-sets';

export class TemplateManifestParser {

	public parse(data: string): TemplateManifest {
		if (!data) {
			throw new Error('The input is empty.');
		}

		const yaml = jsyaml.load(data);

		const template: TemplateManifest = {
			meta: this.parseMeta(readObject(yaml, 'meta')),
			dataContract: this.parseDataContract(readObject(yaml, 'dataContract')),
			pages: this.parsePages(readObject(yaml, 'pages'))
		};
		return template;
	}

	private parseMeta(template: any): TemplateManifestMeta {
		const filePaths = tryReadStringArray(template, 'filePaths');
		filePaths.forEach(path => validFilePath(path));

		return {
			version: tryReadNumber(template, 'version', -1),
			name: readString(template, 'name'),
			author: readString(template, 'author'),
			license: readString(template, 'license'),
			exportable: tryReadBoolean(template, 'exportable', true),
			homepageUrl: tryReadString(template, 'homepageUrl', null),
			donationUrl: tryReadString(template, 'donationUrl', null),
			filePaths
		};
	}

	private parseDataContract(dataContract: any): DataContract {
		return {
			zones: this.parseZones(dataContract)
		};
	}

	private parseZones(zones: any): ZoneContractMap {
		const map: ZoneContractMap = {};

		for (const zoneName of Object.keys(zones)) {
			const zone = zones[zoneName];
			const sections = readObject(zone, 'sections');
			validPropertyName(zoneName);

			map[zoneName] = {
				_label: this.readLabel(zone, zoneName),
				_description: tryReadString(zone, '_description', null),
				sections: this.parseSections(sections)
			};
		}
		return map;
	}

	private parseSections(sections: any): SectionContractMap {
		const map: SectionContractMap = {};
		for (const sectionName of Object.keys(sections)) {
			const section = sections[sectionName];
			validPropertyName(sectionName);

			map[sectionName] = {
				_label: this.readLabel(section, sectionName),
				_description: tryReadString(section, '_description', null),
				_panel: tryReadString(section, '_panel', null),
				properties: this.parseProperties(section.properties)
			};
		}
		return map;
	}

	private parseProperties(properties: any): PropertyContractMap {
		const map: PropertyContractMap = {};
		for (const propertyName of Object.keys(properties)) {
			validPropertyName(propertyName);
			const property = properties[propertyName];
			this.parserProperty(propertyName, property, map);
		}
		return map;
	}

	private parserProperty(propertyName: string, property: any, map: PropertyContractMap) {
		const type = readString(property, 'type');
		const required = tryReadBoolean(property, 'required', true);
		const label = this.readLabel(property, propertyName);
		const descr = tryReadString(property, '_description', null);

		switch (type) {
			case '(text)':
				let tDefaultValue = tryReadString(property, 'defaultValue', null);
				if (!tDefaultValue) {
					const tDefaultValueSet = tryReadString(property, 'defaultValueSet', null);
					if (tDefaultValueSet) {
						tDefaultValue = getTextValueSet(tDefaultValueSet);
					}
				}

				const tps: TextPropertyContract = {
					type: PropertyContractType.text,
					required,
					_label: label,
					_description: descr,
					defaultValue: tDefaultValue,
					maxLength: tryReadNumber(property, 'maxLength', null)
				};
				map[propertyName] = tps;
				break;

			case '(boolean)':
				const bpc: BooleanPropertyContract = {
					type: PropertyContractType.boolean,
					required,
					_label: label,
					_description: descr,
					defaultValue: tryReadBoolean(property, 'defaultValue', null)
				};
				map[propertyName] = bpc;
				break;

			case '(dateTime)':
				const dDefaultValue = tryReadDate(property, 'defaultValue', null);
				const dtpc: DateTimePropertyContract = {
					type: PropertyContractType.dateTime,
					required,
					_label: label,
					_description: descr,
					defaultValue: dDefaultValue ? moment(dDefaultValue).toISOString(true) : null,
					now: !dDefaultValue ? tryReadBoolean(property, 'now', null) : null
				};
				map[propertyName] = dtpc;
				break;

			case '(html)':
				const hFefaultFilePath = tryReadString(property, 'defaultFilePath', null);
				if (hFefaultFilePath) {
					validFilePath(hFefaultFilePath);
				}

				const hps: HtmlPropertyContract = {
					type: PropertyContractType.html,
					required,
					_label: label,
					_description: descr,
					defaultFilePath: hFefaultFilePath
				};
				map[propertyName] = hps;
				break;

			case '(markdown)':
				const mdFefaultFilePath = tryReadString(property, 'defaultFilePath', null);
				if (mdFefaultFilePath) {
					validFilePath(mdFefaultFilePath);
				}

				const mdps: MarkdownPropertyContract = {
					type: PropertyContractType.markdown,
					required,
					_label: label,
					_description: descr,
					defaultFilePath: mdFefaultFilePath
				};
				map[propertyName] = mdps;
				break;

			case '(image)':
				const iDefaultFilePath = tryReadString(property, 'defaultFilePath', null);
				if (iDefaultFilePath) {
					validFilePath(iDefaultFilePath);
				}

				const ips: ImagePropertyContract = {
					type: PropertyContractType.image,
					required,
					_label: label,
					_description: descr,
					width: tryReadNumber(property, 'width', null),
					height: tryReadNumber(property, 'height', null),
					defaultFilePath: iDefaultFilePath,
					images: property._images
				};
				map[propertyName] = ips;
				break;

			case '(choice)':
				let choices: ChoicePropertyContractValues = null;

				const values = tryReadStringArray(property, 'values');
				if (values) {
					choices = this.parseChoiceValues(values);
				} else {
					const valuesSet = tryReadString(property, 'valuesSet', null);
					if (valuesSet) {
						choices = getChoiceValuesSet(valuesSet);
					}
				}
				if (!choices) {
					throw new Error(`TextChoice property does not have defined values.`);
				}

				const cDefaultValue = tryReadString(property, 'defaultValue', null);
				if (cDefaultValue && !Object.keys(choices).includes(cDefaultValue)) {
					throw new Error('The default value must be included in values.');
				}
				const tcps: ChoicePropertyContract = {
					type: PropertyContractType.choice,
					required,
					_label: label,
					_description: descr,
					values: choices,
					defaultValue: cDefaultValue
				};
				map[propertyName] = tcps;
				break;

			case '(color)':
				const cpc: ColorPropertyContract = {
					type: PropertyContractType.color,
					required,
					_label: label,
					_description: descr,
					defaultValue: tryReadString(property, 'defaultValue', null)
				};
				map[propertyName] = cpc;
				break;

			case '(collection)':
				const cProperties = readObject(property, 'properties');
				const cps: CollectionPropertyContract = {
					type: PropertyContractType.collection,
					required,
					_label: label,
					_description: descr,
					min: tryReadNumber(property, 'min', null),
					max: tryReadNumber(property, 'max', null),
					defaultOccurrences: tryReadNumber(property, 'defaultOccurrences', null),
					properties: this.parseProperties(cProperties)
				};
				map[propertyName] = cps;
				break;

			default:
				throw new Error(`The type ${type} is not supported.`);
		}
	}

	private parseChoiceValues(values: string[]): ChoicePropertyContractValues {
		const choices: ChoicePropertyContractValues = {};
		values.forEach(v => {
			const bracketPos1 = v.indexOf('(');
			const bracketPos2 = v.indexOf(')');
			if (bracketPos1 > 0 && bracketPos2 > bracketPos1) {
				const value = v.substring(bracketPos1 + 1, bracketPos2);
				const displayName = v.substring(0, bracketPos1);
				choices[value] = displayName;
			} else {
				choices[v] = v;
			}
		});
		return choices;
	}

	private parsePages(pages: any): PageContractMap {
		const map: PageContractMap = {};
		for (const pageName of Object.keys(pages)) {
			const page = pages[pageName];
			validPropertyName(pageName);

			const filePath = readString(page, 'filePath');
			const templateFilePath = readString(page, 'templateFilePath');
			validFilePath(filePath);
			validFilePath(templateFilePath);

			const contract: PageContract = {
				filePath,
				templateFilePath
			};
			if (page.multiplier) {
				contract.multiplier = {
					dataPath: readString(page.multiplier, 'dataPath'),
					fileNameDataPath: tryReadString(page.multiplier, 'fileNameDataPath', null)
				};
			}
			if (page.divider) {
				contract.divider = {
					divisor: tryReadNumber(page.divider, 'divisor', 3),
					pageName: readString(page.divider, 'pageName'),
					firstFilePath: tryReadString(page.divider, 'firstFilePath', null)
				};
			}
			map[pageName] = contract;
		}
		return map;
	}

	private readLabel(data: any, fieldName: string) {
		const label = tryReadString(data, '_label', null);
		return label ? label : transformToLabel(fieldName);
	}
}

export function validPropertyName(name: string) {
	if (!(/^[A-Z][A-Z0-9_]*$/.test(name))) {
		throw new Error(`Invalid format for property name ${name}.`);
	}
}

export function validFilePath(filePath: string) {
	if (!(/^([a-z0-9\.\-\_]+\/?)+?$/.test(filePath)) || (/^\.+\//.test(filePath)) || (/\/\.+\//.test(filePath))) {
		throw new Error(`Invalid file path format ${filePath}.`);
	}
}

export function transformToLabel(fieldName: string): string {
	return fieldName.split('_').map(word => {
		const lower = word.toLowerCase();
		return lower.charAt(0).toUpperCase() + lower.slice(1);
	}).join(' ');
}

function tryRead<T>(data: any, key: string, type: string, defaultValue: T) {
	const value = data[key];
	if (value !== undefined) {
		if (typeof value !== type) {
			throw new Error(`Invalid value for the key ${key}. Got ${typeof(value)}, expected ${type}.`);
		}
		return value;
	}
	return defaultValue;
}

function readObject(data: any, key: string): any {
	const value = tryRead(data, key, 'object', null);
	if (value === null) {
		throw new Error(`The property ${key} does not exist.`);
	}
	return value;
}

function readString(data: any, key: string): string {
	const value = tryReadString(data, key, null);
	if (!value) {
		throw new Error(`The property ${key} does not exist.`);
	}
	return value;
}

function tryReadStringArray(data: any, key: string): string[] {
	const arr = tryRead(data, key, 'object', null) as string[];
	if (arr !== null) {
		if (!Array.isArray(arr) || arr.find(i => typeof i !== 'string')) {
			throw new Error(`The property ${key} does not contain an array of strings.`);
		}
		return arr;
	}
}

function tryReadString(data: any, key: string, defaultValue: string): string {
	return tryRead(data, key, 'string', defaultValue);
}

function tryReadBoolean(data: any, key: string, defaultValue: boolean): boolean {
	return tryRead(data, key, 'boolean', defaultValue);
}

function tryReadNumber(data: any, key: string, defaultValue: number): number {
	return tryRead(data, key, 'number', defaultValue);
}

function tryReadDate(data: any, key: string, defaultValue: number): Date {
	const value = tryRead(data, key, 'object', defaultValue);
	if (value !== null && !(value instanceof Date)) {
		throw new Error(`The property ${key} does not contain a date.`);
	}
	return value;
}
