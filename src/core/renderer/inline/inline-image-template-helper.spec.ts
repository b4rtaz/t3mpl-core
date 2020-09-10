import { MemoryStorage } from '../../memory-storage';
import { InlineImageTemplateHelper } from './inline-image-template-helper';

describe('InlineImageTemplateHelper', () => {

	let storage: MemoryStorage;
	let helper: InlineImageTemplateHelper;

	beforeEach(() => {
		storage = new MemoryStorage();
		helper = new InlineImageTemplateHelper(storage);
	});

	it('execute() returns proper value', () => {
		storage.setContent('dataUrl', 'foo.jpg', 'data:...');

		const res = helper.execute('foo.jpg');

		expect(res).toEqual('data:...');
	});

	it('execute() throws error when a path is empty', () => {
		expect(() => helper.execute(''))
			.toThrowMatching((e: Error) => e.message.startsWith('$image got empty path'));
	});
});
