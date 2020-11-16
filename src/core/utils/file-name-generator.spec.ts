import { generateFileName } from './file-name-generator';

describe('FileNameGenerator', () => {

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

		const t3 = generateFileName({
			name: 'short',
			fileExt: '.jpeg',
			uniqueIdGenerator: fakeUniqueIdGenerator,
			minUniqueIdLength: 10
		});

		expect(t3).toEqual('short-%%%%%%%%%%%%%.jpeg');
		expect(t3.length).toEqual(24);
	});
});
