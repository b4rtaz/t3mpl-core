import { MemoryStorage } from '../memory-storage';
import { TemplateManifestParser } from '../template-manifest-parser';
import { DataActivator } from './data-activator';

describe('DataActivator', () => {
	const parser = new TemplateManifestParser();
	const templateStorage = new MemoryStorage();
	const contentStorage = new MemoryStorage();
	const activator = new DataActivator(templateStorage, contentStorage);

	it('should generate correct instance', () => {
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
            properties:
              DESCR:
                type: (text)

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
		expect(instance.ALFA.BETA.EPSILON.length).toEqual(0);
		expect(instance.ALFA.BETA.DELTA).toEqual('Lorem');
	});
});
