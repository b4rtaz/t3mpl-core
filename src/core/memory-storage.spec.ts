import { MemoryStorage } from './memory-storage';

describe('MemoryStorage', () => {

	let storage: MemoryStorage;

	beforeEach(() => {
		storage = new MemoryStorage();
	});

	it('getFilePaths() returns proper value', () => {
		storage.setContent('text', 'a.txt', 'alfa');
		storage.setContent('text', 'assets/b.txt', 'alfa');
		storage.setContent('dataUrl', 'media/images/x.gif', 'data:...');
		storage.setContent('dataUrl', 'y.pdf', 'data:...');
		storage.setContent('binary', 'q.pdf', '####');

		const textPaths = storage.getFilePaths('text');
		const dataUrlPaths = storage.getFilePaths('dataUrl');
		const binPaths = storage.getFilePaths(['dataUrl', 'binary']);

		expect(textPaths).toContain('a.txt');
		expect(textPaths).toContain('assets/b.txt');
		expect(dataUrlPaths).toContain('media/images/x.gif');
		expect(dataUrlPaths).toContain('y.pdf');
		expect(binPaths).toContain('media/images/x.gif');
		expect(binPaths).toContain('y.pdf');
		expect(binPaths).toContain('q.pdf');
	});

	it('has() returns proper value', () => {
		storage.setContent('text', 'a.txt', 'alfa');
		storage.setContent('dataUrl', 'y.pdf', 'data:...');
		storage.setContent('binary', 'z.pdf', '###');

		expect(storage.has('text', 'a.txt')).toBeTruthy();
		expect(storage.has('dataUrl', 'b.txt')).toBeFalsy();
		expect(storage.has('dataUrl', 'y.pdf')).toBeTruthy();
		expect(storage.has(['dataUrl', 'binary'], 'y.pdf')).toBeTruthy();
		expect(storage.has('text', 'z.pdf')).toBeFalsy();
		expect(storage.has('binary', 'z.pdf')).toBeTruthy();
		expect(storage.has(['binary', 'dataUrl'], 'z.pdf')).toBeTruthy();
		expect(storage.has(['text'], 'z.pdf')).toBeFalsy();
		expect(storage.has('text', 'z.pdf')).toBeFalsy();
	});

	it('setContent() throws error when content type is diffrent', () => {
		storage.setContent('text', 'a.txt', '1');
		storage.setContent('text', 'a.txt', '2');

		expect(() => storage.setContent('binary', 'a.txt', '3'))
			.toThrowMatching((e: Error) => e.message.startsWith('Previous file has diffrent content type'));
	});

	it('getContent() throws error when cannot file the file', () => {
		expect(() => storage.getContent('text', 'unknown.json'))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find the file'));
	});

	it('getEntry() throws error when cannot file the file', () => {
		expect(() => storage.getEntry('text', 'unknown.json'))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find the file'));
	});
});
