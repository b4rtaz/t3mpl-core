import { MemoryStorage } from '../memory-storage';
import { PropertyContractMap, PropertyContractType, TextPropertyContract } from '../model';
import { TemplateManifestParser } from '../template-manifest-parser';
import { DataActivator } from './data-activator';

describe('DataActivator', () => {
	const parser = new TemplateManifestParser();

	const templateStorage = new MemoryStorage();
	templateStorage.setContent('text', 'doc.html', '<hr />');
	templateStorage.setContent('text', 'article.md', '...');
	templateStorage.setContent('binary', 'image.jpg', '...');

	const contentStorage = new MemoryStorage();
	const activator = new DataActivator(templateStorage, contentStorage);

	it('createInstance() should generate correct instance', () => {
		const t = parser.parse(
`meta:
  version: 1
  name: Zombie
  author: Zombie
  license: Zombie
  filePaths: []

dataContract:
  ALFA:
    sections:
      BETA:
        properties:
          GAMMA:
            min: 2
            type: (collection)
            properties:
              TITLE:
                type: (text)
              CONTENT:
                type: (text)
          DELTA:
            type: (text)
            defaultValue: Lorem
          EPSILON:
            type: (collection)
            defaultOccurrences: 32
            properties:
              DESCR:
                type: (text)
          ZETA:
            type: (collection)
            properties:
              X:
                type: (text)
      TYPES:
        properties:
          COLOR:
            type: (color)
            defaultValue: '#CE4848'
          COLOR_NULL:
            type: (color)
          BOOLEAN:
            type: (boolean)
            defaultValue: true
          DATETIME:
            type: (dateTime)
            defaultValue: 2020-09-09T00:01:36.220+02:00
          DATETIME_NOW:
            type: (dateTime)
            now: true
          DATETIME_NULL:
            type: (dateTime)
          CHOICE:
            type: (choice)
            values: [a,b,c]
            defaultValue: c
          CHOICE_NULL:
            type: (choice)
            values: [x, y, z]
          HTML:
            type: (html)
            defaultFilePath: doc.html
          HTML_NULL:
            type: (html)
          MARKDOWN:
            type: (markdown)
            defaultFilePath: article.md
          MARKDOWN_NULL:
            type: (markdown)
          IMAGE:
            type: (image)
            defaultFilePath: image.jpg
          IMAGE_NULL:
            type: (image)
pages:
  INDEX:
    filePath: index.html
    templateFilePath: index.html
`);

		const instance = activator.createInstance(t.dataContract);

		expect(instance).not.toBeNull();
		expect(instance.ALFA).not.toBeNull();
		expect(instance.ALFA.BETA).not.toBeNull();
		expect(instance.ALFA.BETA.GAMMA).not.toBeNull();
		expect(instance.ALFA.BETA.GAMMA.length).toEqual(2);
		expect(instance.ALFA.BETA.EPSILON).not.toBeNull();
		expect(instance.ALFA.BETA.EPSILON.length).toEqual(32);
		expect(instance.ALFA.BETA.ZETA).not.toBeNull();
		expect(instance.ALFA.BETA.ZETA.length).toEqual(0);
		expect(instance.ALFA.BETA.DELTA).toEqual('Lorem');

		expect(instance.ALFA.TYPES.COLOR).toEqual('#CE4848');
		expect(instance.ALFA.TYPES.COLOR_NULL).toBeNull();
		expect(instance.ALFA.TYPES.BOOLEAN).toEqual(true);
		expect(instance.ALFA.TYPES.DATETIME).not.toBeUndefined();
		expect(instance.ALFA.TYPES.DATETIME_NOW).not.toBeUndefined();
		expect(instance.ALFA.TYPES.DATETIME_NULL).toBeNull();
		expect(instance.ALFA.TYPES.CHOICE).toEqual('c');
		expect(instance.ALFA.TYPES.CHOICE_NULL).toBeNull();
		expect(instance.ALFA.TYPES.HTML).not.toEqual('doc.html');
		expect(instance.ALFA.TYPES.HTML_NULL).toBeNull();
		expect(instance.ALFA.TYPES.MARKDOWN).not.toEqual('article.md');
		expect(instance.ALFA.TYPES.MARKDOWN_NULL).toBeNull();
		expect(instance.ALFA.TYPES.IMAGE).toEqual('image.jpg');
		expect(instance.ALFA.TYPES.IMAGE_NULL).toBeNull();
	});

	it('createPropertiesInstance() should generate correct instance', () => {
		const map: PropertyContractMap = {
			'A': {
				type: PropertyContractType.text,
				required: true,
				defaultValue: 'test'
			} as TextPropertyContract
		};

		const instance = activator.createPropertiesInstance(map);

		expect(instance.A).toEqual('test');
	});

	it('createPropertiesInstance() throws error when property contract type is invalid', () => {
		const map: PropertyContractMap = {
			'B': {
				type: <any>'unknown',
				required: false
			}
		};

		expect(() => activator.createPropertiesInstance(map))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported property type'));
	});
});
