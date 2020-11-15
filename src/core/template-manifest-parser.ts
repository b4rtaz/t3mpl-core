import * as jsyaml from 'js-yaml';

import {
	BooleanPropertyContract,
	ChoicePropertyContract,
	ChoicePropertyContractValues,
	CollectionPropertyContract,
	ColorPropertyContract,
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
	ZoneContractMap
} from './model';
import { PropertyReader as PR } from './property-reader';
import { getChoiceValuesSet, getTextValueSet } from './template-sets';
import { dateToIsoString } from './utils/date-utils';

export class TemplateManifestParser {

	public parse(data: string): TemplateManifest {
		if (!data) {
			throw new Error('The input is empty.');
		}

		const yaml = jsyaml.load(data);

		const template: TemplateManifest = {
			meta: this.parseMeta(PR.readObject(yaml, 'meta')),
			dataContract: this.parseDataContract(PR.readObject(yaml, 'dataContract')),
			pages: this.parsePages(PR.readObject(yaml, 'pages'))
		};
		return template;
	}

	private parseMeta(template: any): TemplateManifestMeta {
		const filePaths = PR.tryReadStringArray(template, 'filePaths');
		filePaths.forEach(path => validFilePath(path));

		return {
			version: PR.tryReadNumber(template, 'version', -1),
			name: PR.readString(template, 'name'),
			author: PR.readString(template, 'author'),
			license: PR.readString(template, 'license'),
			exportable: PR.tryReadBoolean(template, 'exportable', true),
			homepageUrl: PR.tryReadString(template, 'homepageUrl', null),
			donationUrl: PR.tryReadString(template, 'donationUrl', null),
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
			const sections = PR.readObject(zone, 'sections');
			validPropertyName(zoneName);

			map[zoneName] = {
				_label: this.readLabel(zone, zoneName),
				_description: PR.tryReadString(zone, '_description', null),
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
				_description: PR.tryReadString(section, '_description', null),
				_panel: PR.tryReadString(section, '_panel', null),
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
		const type = PR.readString(property, 'type');
		const required = PR.tryReadBoolean(property, 'required', true);
		const label = this.readLabel(property, propertyName);
		const descr = PR.tryReadString(property, '_description', null);

		switch (type) {
			case '(text)':
				let tDefaultValue = PR.tryReadString(property, 'defaultValue', null);
				if (!tDefaultValue) {
					const tDefaultValueSet = PR.tryReadString(property, 'defaultValueSet', null);
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
					maxLength: PR.tryReadNumber(property, 'maxLength', null)
				};
				map[propertyName] = tps;
				break;

			case '(boolean)':
				const bpc: BooleanPropertyContract = {
					type: PropertyContractType.boolean,
					required,
					_label: label,
					_description: descr,
					defaultValue: PR.tryReadBoolean(property, 'defaultValue', null)
				};
				map[propertyName] = bpc;
				break;

			case '(dateTime)':
				const dDefaultValue = PR.tryReadDate(property, 'defaultValue', null);
				const dtpc: DateTimePropertyContract = {
					type: PropertyContractType.dateTime,
					required,
					_label: label,
					_description: descr,
					defaultValue: dDefaultValue ? dateToIsoString(dDefaultValue) : null,
					now: !dDefaultValue ? PR.tryReadBoolean(property, 'now', null) : null
				};
				map[propertyName] = dtpc;
				break;

			case '(html)':
				const hFefaultFilePath = PR.tryReadString(property, 'defaultFilePath', null);
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
				const mdFefaultFilePath = PR.tryReadString(property, 'defaultFilePath', null);
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
				const iDefaultFilePath = PR.tryReadString(property, 'defaultFilePath', null);
				if (iDefaultFilePath) {
					validFilePath(iDefaultFilePath);
				}

				const ips: ImagePropertyContract = {
					type: PropertyContractType.image,
					required,
					_label: label,
					_description: descr,
					width: PR.tryReadNumber(property, 'width', null),
					height: PR.tryReadNumber(property, 'height', null),
					defaultFilePath: iDefaultFilePath,
					images: property._images
				};
				map[propertyName] = ips;
				break;

			case '(choice)':
				let choices: ChoicePropertyContractValues = null;

				const values = PR.tryReadStringArray(property, 'values');
				if (values) {
					choices = this.parseChoiceValues(values);
				} else {
					const valuesSet = PR.tryReadString(property, 'valuesSet', null);
					if (valuesSet) {
						choices = getChoiceValuesSet(valuesSet);
					}
				}
				if (!choices) {
					throw new Error(`(choice) does not have values.`);
				}

				const cDefaultValue = PR.tryReadString(property, 'defaultValue', null);
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
					defaultValue: PR.tryReadString(property, 'defaultValue', null)
				};
				map[propertyName] = cpc;
				break;

			case '(collection)':
				const cProperties = PR.readObject(property, 'properties');
				const cps: CollectionPropertyContract = {
					type: PropertyContractType.collection,
					required,
					_label: label,
					_description: descr,
					min: PR.tryReadNumber(property, 'min', null),
					max: PR.tryReadNumber(property, 'max', null),
					defaultOccurrences: PR.tryReadNumber(property, 'defaultOccurrences', null),
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

			const filePath = PR.readString(page, 'filePath');
			const templateFilePath = PR.readString(page, 'templateFilePath');
			validFilePath(filePath);
			validFilePath(templateFilePath);

			const contract: PageContract = {
				filePath,
				templateFilePath
			};
			if (page.multiplier) {
				contract.multiplier = {
					dataPath: PR.readString(page.multiplier, 'dataPath'),
					fileNameDataPath: PR.tryReadString(page.multiplier, 'fileNameDataPath', null)
				};
			}
			if (page.divider) {
				contract.divider = {
					divisor: PR.tryReadNumber(page.divider, 'divisor', 3),
					pageName: PR.readString(page.divider, 'pageName'),
					firstFilePath: PR.tryReadString(page.divider, 'firstFilePath', null)
				};
			}
			map[pageName] = contract;
		}
		return map;
	}

	private readLabel(data: any, fieldName: string) {
		const label = PR.tryReadString(data, '_label', null);
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
