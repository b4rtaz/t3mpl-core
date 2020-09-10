import { generateUniqueId, generateFileName } from './file-name-generator';

describe('FileNameGenerator', () => {

	it('generateUniqueId() returns correct id length', () => {
		expect(generateUniqueId(10).length).toEqual(10);
		expect(generateUniqueId(4).length).toEqual(4);
		expect(generateUniqueId(32).length).toEqual(32);
		expect(generateUniqueId(5).length).toEqual(5);
		expect(generateUniqueId(2).length).toEqual(2);
		expect(generateUniqueId(1).length).toEqual(1);
	});

	function fakeUniqueIdGenerator(length: number): string {
		let id = '';
		for (let i = 0; i < length; i++) {
			id += '%';
		}
		return id;
	}

	it('generateFilePath() returns proper value', () => {
		const t1 = generateFileName({
			name: 'Lorem Ipsum Sit Dolor',
			fileExt: '.pdf',
			uniqueIdGenerator: fakeUniqueIdGenerator,
			fileNameLength: 24
		});
		expect(t1).toEqual('lorem-i-%%%%%%%%%%%%.pdf');
		expect(t1.length).toEqual(24);

		const t2 = generateFileName({
			fileExt: '.jpeg',
			uniqueIdGenerator: fakeUniqueIdGenerator,
			fileNameLength: 24
		});
		expect(t2).toEqual('%%%%%%%%%%%%%%%%%%%.jpeg');
		expect(t2.length).toEqual(24);
	});
});
