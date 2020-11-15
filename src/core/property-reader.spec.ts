import { PropertyReader } from './property-reader';

describe('PropertyReader', () => {

	it('tryRead() returns proper value', () => {
		const data = {
			str: 'str',
			int: 10
		};

		expect(PropertyReader.tryRead(data, 'str', 'string', null)).toEqual('str');
		expect(PropertyReader.tryRead(data, 'str0', 'string', 'aaa')).toEqual('aaa');
		expect(PropertyReader.tryRead(data, 'int', 'number', null)).toEqual(10);
		expect(PropertyReader.tryRead(data, 'int0', 'number', 20)).toEqual(20);
	});

	it('tryRead() throws error when value has wrong type', () => {
		const data = {
			index: 'wrong'
		};

		expect(() => PropertyReader.tryRead<number>(data, 'index', 'number', null))
			.toThrowMatching((e: Error) => e.message === 'Invalid value for the key index. Got string, expected number.');
	});

	it('readObject() / readString() throws error when property does not exist', () => {
		const e = (err: Error) => err.message === 'The property user does not exist.';

		const data = {};

		expect(() => PropertyReader.readObject(data, 'user')).toThrowMatching(e);
		expect(() => PropertyReader.readString(data, 'user')).toThrowMatching(e);
	});

	it('tryReadDate() throws error when value is not date', () => {
		const data = {
			now: { _: -10 }
		};

		expect(() => PropertyReader.tryReadDate(data, 'now', null))
			.toThrowMatching((e: Error) => e.message === 'The property now does not contain a date.');
	});

	it('tryReadStringArray() throws error when value is not string array', () => {
		const data = {
			indexes: [10, 20]
		};

		expect(() => PropertyReader.tryReadStringArray(data, 'indexes'))
			.toThrowMatching((e: Error) => e.message === 'The property indexes does not contain an array of strings.');
	});
});
