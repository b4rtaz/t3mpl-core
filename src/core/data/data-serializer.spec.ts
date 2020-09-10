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
			data: { A: 21356 },
		});

		const q = ser.deserialize(s);

		expect(q.data).not.toBeNull();
		expect(q.data.A).toEqual(21356);
		expect(q.meta.name).toContain('X');
		expect(q.meta.version).toEqual(124);
		expect(q.meta.filePaths).toContain('a.jpg');
		expect(q.meta.filePaths).toContain('data.json');
	});

	it('deserialize() throws error when input is invalid', () => {
		const v = (e: Error) => e.message.startsWith('Cannot deserialize');

		expect(() => ser.deserialize(null)).toThrowMatching(v);
		expect(() => ser.deserialize('{}')).toThrowMatching(v);
		expect(() => ser.deserialize('{"data": {}}')).toThrowMatching(v);
		expect(() => ser.deserialize('{"meta": {}}')).toThrowMatching(v);
	});
});
