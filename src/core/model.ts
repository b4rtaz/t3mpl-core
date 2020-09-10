
export interface TemplateManifest {
	meta: TemplateManifestMeta;
	dataContract: DataContract;
	pages: PageContractMap;
}

export interface TemplateManifestMeta {
	version: number;
	name: string;
	license: string;
	author: string;
	exportable: boolean;
	homepageUrl?: string;
	donationUrl?: string;
	filePaths: string[];
}

export interface PageContractMap {
	[pageName: string]: PageContract;
}

export interface PageContract {
	filePath: string;
	templateFilePath: string;

	multiplier?: MultiplierPageContract;
	divider?: DividerPageContract;
}

export interface MultiplierPageContract {
	dataPath: string;
	fileNameDataPath?: string;
}

export interface DividerPageContract {
	pageName: string;
	divisor: number;
	firstFilePath?: string;
}

//

export interface DataContract {
	zones: ZoneContractMap;
}

export interface ZoneContractMap {
	[zoneName: string]: ZoneContract;
}

export interface ZoneContract {
	_label?: string;
	_description?: string;
	sections: SectionContractMap;
}

export interface SectionContractMap {
	[sectionName: string]: SectionContract;
}

export interface SectionContract {
	_label?: string;
	_description?: string;
	_panel?: string;
	properties: PropertyContractMap;
}

export enum PropertyContractType {
	html = 'html',
	markdown = 'markdown',
	text = 'text',
	boolean = 'boolean',
	dateTime = 'dateTime',
	image = 'image',
	collection = 'collection',
	choice = 'choice',
	color = 'color'
}

export interface PropertyContractMap {
	[propertyName: string]: PropertyContract;
}

export interface PropertyContract {
	type: PropertyContractType;
	required: boolean;
	_label?: string;
	_description?: string;
}

export interface TextPropertyContract extends PropertyContract {
	defaultValue?: string;
	maxLength?: number;
}

export interface BooleanPropertyContract extends PropertyContract {
	defaultValue?: boolean;
}

export interface DateTimePropertyContract extends PropertyContract {
	defaultValue?: string;
	now?: boolean;
}

export interface ImagePropertyContract extends PropertyContract {
	width?: number;
	height?: number;
	defaultFilePath?: string;
	images?: string[];
}

export interface ChoicePropertyContract extends PropertyContract {
	defaultValue?: string;
	values: ChoicePropertyContractValues;
}

export interface ChoicePropertyContractValues {
	[value: string]: string;
}

export interface ColorPropertyContract extends PropertyContract {
	defaultValue?: string;
}

export interface HtmlPropertyContract extends PropertyContract {
	defaultFilePath?: string;
}

export interface MarkdownPropertyContract extends PropertyContract {
	defaultFilePath?: string;
}

export interface CollectionPropertyContract extends PropertyContract {
	min?: number;
	max?: number;
	defaultOccurrences?: number;
	properties: PropertyContractMap;
}

//

export interface Page {
	name: string;
	filePath: string;
	templateFilePath: string;
	dataPath?: string;
	index?: number;
	subPages?: Page[];
}

export interface TemplateData {
	meta: TemplateDataMeta;
	data: any;
}

export interface TemplateDataMeta {
	name: string;
	version: number;
	filePaths: string[];
}
