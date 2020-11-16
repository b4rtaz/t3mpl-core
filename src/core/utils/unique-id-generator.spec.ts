import { generateUniqueId } from './unique-id-generator';

describe('unique id generator', () => {

	it('generateUniqueId() returns correct id length', () => {
		expect(generateUniqueId(10).length).toEqual(10);
		expect(generateUniqueId(4).length).toEqual(4);
		expect(generateUniqueId(32).length).toEqual(32);
		expect(generateUniqueId(5).length).toEqual(5);
		expect(generateUniqueId(2).length).toEqual(2);
		expect(generateUniqueId(1).length).toEqual(1);
	});
});
