import {
	BooleanPropertyContract,
	ChoicePropertyContract,
	CollectionPropertyContract,
	DateTimePropertyContract,
	PropertyContractType,
	TextPropertyContract
} from './model';
import { TemplateManifestParser, transformToLabel, validFilePath, validPropertyName } from './template-manifest-parser';

describe('TemplateManifestParser', () => {
	const parser = new TemplateManifestParser();

	it('should parse an example as expected', () => {
		const t = parser.parse(
`meta:
  version: 123
  name: Example
  license: MIT
  author: b4rtaz
  homepageUrl: http://foo.com/
  donationUrl: http://donate.com/
  filePaths:
    - index.html
    - test.js

dataContract:
  ALFA:
    _label: Alfa
    sections:
      BETA:
        _label: Beta
        properties:
          GAMMA:
            type: (collection)
            properties:
              TITLE:
                type: (text)
                _label: T1tl3
                _description: D3scr
              LIPSUM:
                type: (text)
                defaultValueSet: (lipsumXL)
              CONTENT:
                type: (html)
              BOOL:
                type: (boolean)
                defaultValue: false
                _label: B00l
              CHOICE:
                type: (choice)
                values: [alfa(a), beta]
              DATE:
                type: (dateTime)
                defaultValue: 2020-09-09T00:01:36.220+02:00
                required: false

pages:
  TEST:
    filePath: t3st.html
    templateFilePath: test.html
    divider:
      divisor: 99
      pageName: ZETA
      firstFilePath: q.js
    multiplier:
      dataPath: Q.W.E.R.T.Y
      fileNameDataPath: P.Q
`);

		expect(t.meta.version).toEqual(123);
		expect(t.meta.name).toEqual('Example');
		expect(t.meta.license).toEqual('MIT');
		expect(t.meta.author).toEqual('b4rtaz');
		expect(t.meta.homepageUrl).toEqual('http://foo.com/');
		expect(t.meta.donationUrl).toEqual('http://donate.com/');
		expect(t.meta.filePaths).toContain('index.html');
		expect(t.meta.filePaths).toContain('test.js');

		const GAMMA = t.dataContract.zones.ALFA.sections.BETA.properties.GAMMA as CollectionPropertyContract;
		expect(GAMMA.type).toEqual(PropertyContractType.collection);

		expect(GAMMA.properties.TITLE.type).toEqual(PropertyContractType.text);
		expect(GAMMA.properties.TITLE._label).toEqual('T1tl3');
		expect(GAMMA.properties.TITLE._description).toEqual('D3scr');

		const lipsum = GAMMA.properties.LIPSUM as TextPropertyContract;
		expect(lipsum.type).toEqual(PropertyContractType.text);
		expect(lipsum.defaultValue).not.toBeNull();

		expect(GAMMA.properties.CONTENT.type).toEqual(PropertyContractType.html);
		expect(GAMMA.properties.CONTENT._label).toEqual('Content');

		const bool = GAMMA.properties.BOOL as BooleanPropertyContract;
		expect(bool.type).toEqual(PropertyContractType.boolean);
		expect(bool._label).toEqual('B00l');
		expect(bool.defaultValue).toBeFalse();

		const choice = GAMMA.properties.CHOICE as ChoicePropertyContract;
		const choiceValueKeys = Object.keys(choice.values);
		const choiceValueValues = Object.values(choice.values);
		expect(choice.type).toEqual(PropertyContractType.choice);
		expect(choice._label).toEqual('Choice');
		expect(choice.required).toBeTrue();
		expect(choiceValueKeys[0]).toEqual('a');
		expect(choiceValueKeys[1]).toEqual('beta');
		expect(choiceValueValues[0]).toEqual('alfa');
		expect(choiceValueValues[1]).toEqual('beta');

		const date = GAMMA.properties.DATE as DateTimePropertyContract;
		expect(date.type).toEqual(PropertyContractType.dateTime);
		expect(date._label).toEqual('Date');
		expect(date.defaultValue).toEqual('2020-09-09T00:01:36.220+02:00');
		expect(date.required).toBeFalse();

		expect(t.pages.TEST.filePath).toEqual('t3st.html');
		expect(t.pages.TEST.templateFilePath).toEqual('test.html');
		expect(t.pages.TEST.divider).not.toBeNull();
		expect(t.pages.TEST.divider.divisor).toEqual(99);
		expect(t.pages.TEST.divider.pageName).toEqual('ZETA');
		expect(t.pages.TEST.divider.firstFilePath).toEqual('q.js');
		expect(t.pages.TEST.multiplier).not.toBeNull();
		expect(t.pages.TEST.multiplier.dataPath).toEqual('Q.W.E.R.T.Y');
		expect(t.pages.TEST.multiplier.fileNameDataPath).toEqual('P.Q');
	});

	it('validPropertyName() valids correctly', () => {
		const m = (e: Error) => e.message.startsWith('Invalid format for property name');

		const invalid = ['test', 'TeST', 't', '#', '$', '1S', '_'];
		const correct = ['TEST', 'TEST_SUB', 'S_M_T_H', 'S1'];

		invalid.forEach(name => expect(() => validPropertyName(name)).toThrowMatching(m));
		correct.forEach(name => expect(() => validPropertyName(name)).not.toThrow());
	});

	it('validFilePath() valids correctly', () => {
		const m = (e: Error) => e.message.startsWith('Invalid file path format');

		const invalid = ['/a.jpg', '$.js', '@.js', './q.js', 'a/../b.js', '../q.js'];
		const correct = ['a.jpg', 'a.b.c.gif', 'a/.b/c.pdf', 'test.js'];

		invalid.forEach(name => expect(() => validFilePath(name)).toThrowMatching(m));
		correct.forEach(name => expect(() => validFilePath(name)).not.toThrow());
	});

	it('transformToLabel() returns proper value', () => {
		expect(transformToLabel('NAME')).toEqual('Name');
		expect(transformToLabel('N')).toEqual('N');
		expect(transformToLabel('N_Q_Z')).toEqual('N Q Z');
		expect(transformToLabel('LOREM_IPSUM')).toEqual('Lorem Ipsum');
		expect(transformToLabel('CAT_DOG_BIRD')).toEqual('Cat Dog Bird');
	});
});
