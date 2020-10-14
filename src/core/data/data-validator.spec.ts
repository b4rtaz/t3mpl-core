import { BooleanPropertyContract, PropertyContractType } from '../model';
import { TemplateManifestParser } from '../template-manifest-parser';
import { DataValidator } from './data-validator';

describe('DataValidator', () => {

	let validator: DataValidator;

	beforeEach(() => {
		validator = new DataValidator();
	});

	it('validate() returns proper value', () => {
		const t = new TemplateManifestParser().parse(
`meta:
  version: 1
  name: Crocodile
  author: Crocodile
  license: MIT
  filePaths: []

dataContract:
  Q:
    sections:
      P:
        properties:
          COLL_MIN:
            min: 2
            type: (collection)
            properties:
              LABEL:
                type: (text)
          COLL_MAX:
            max: 2
            type: (collection)
            properties:
              DESCR:
                type: (text)
          TITLE:
            type: (text)

pages:
  INDEX:
    filePath: index.html
    templateFilePath: index.html
`);

		const data = {
			Q: {
				P: {
					COLL_MIN: [
						{ LABEL: 'x' }
					],
					COLL_MAX: [
						{ DESCR: null }
					],
					TITLE: null
				}
			}
		};

		const errors = validator.validate(t.dataContract, data);
		const invalidDataPaths = Object.keys(errors);

		expect(invalidDataPaths).toContain('Q.P.TITLE');
		expect(invalidDataPaths).toContain('Q.P.COLL_MIN');
		expect(invalidDataPaths).toContain('Q.P.COLL_MAX[0].DESCR');
	});

	it('validateProperty() returns proper value', () => {
		const propContract: BooleanPropertyContract = {
			required: true,
			type: PropertyContractType.boolean
		};

		const value: string = null;

		const errors = validator.validateProperty(propContract, 'A.B.C', value);
		const invalidDataPaths = Object.keys(errors);

		expect(invalidDataPaths).toContain('A.B.C');
	});

	it('validateProperty() throws error when property contract type is invalid', () => {
		const contract: BooleanPropertyContract = {
			required: true,
			type: <any>'invalid'
		};

		const value: string = null;

		expect(() => validator.validateProperty(contract, 'A.B.C', 'value'))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported property contract type'));
	});
});
