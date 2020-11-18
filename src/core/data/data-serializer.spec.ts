import { PagePathStrategy } from '../model';
import { DataSerializer } from './data-serializer';

describe('DataSerializer', () => {

	const ser = new DataSerializer();

	it('serialize() / deserialize() test', () => {
		const s = ser.serialize({
			meta: {
				name: 'X',
				version: 124,
				filePaths: [ 'data.json', 'a.jpg' ]
			},
			configuration: {
				pagePathStrategy: PagePathStrategy.absolute
			},
			data: { A: { B: { C: 21356 } } }
		});

		const d = ser.deserialize(s);

		expect(d.data).not.toBeNull();
		expect(d.data.A.B.C).toEqual(21356);
		expect(d.meta.name).toContain('X');
		expect(d.meta.version).toEqual(124);
		expect(d.meta.filePaths).toContain('a.jpg');
		expect(d.meta.filePaths).toContain('data.json');
	});

	it('deserialize() throws error when input is invalid', () => {
		const v = (e: Error) => e.message.startsWith('Cannot deserialize');

		expect(() => ser.deserialize(null)).toThrowMatching(v);
		expect(() => ser.deserialize('{}')).toThrowMatching(v);
		expect(() => ser.deserialize('{"data": {}}')).toThrowMatching(v);
		expect(() => ser.deserialize('{"meta": {}}')).toThrowMatching(v);
	});

	it('deserialize() upgrades data without configuration', () => {
		const json = `{
			"meta": {
				"name": "Boilerplate",
				"version": 1,
				"filePaths": [ "data.json" ]
			},
			"data": {
				"A": { "B": { "C": 1 } }
			}
		}`;

		const d = ser.deserialize(json);

		expect(d.configuration).toBeDefined();
		expect(d.configuration.pagePathStrategy).toEqual(PagePathStrategy.absolute);
		expect(d.configuration.baseUrl).toBeNull();
	});

	it('deserialize() upgrades data with no baseUrl', () => {
		const json = `{
			"meta": {
				"name": "Boilerplate",
				"version": 1,
				"filePaths": [ "data.json" ]
			},
			"data": {
				"A": { "B": { "C": 1 } }
			},
			"configuration": {
				"pagePathStrategy": "directory"
			}
		}`;

		const d = ser.deserialize(json);

		expect(d.configuration.pagePathStrategy).toEqual(PagePathStrategy.directory);
		expect(d.configuration.baseUrl).toBeNull();
	});
});
