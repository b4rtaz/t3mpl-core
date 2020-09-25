import { MemoryStorage } from '../../memory-storage';
import { FileImageTemplateHelper } from './file-image-template-helper';

describe('FileImageTemplateHelper', () => {

	let storage: MemoryStorage;
	let helper: FileImageTemplateHelper;

	beforeEach(() => {
		storage = new MemoryStorage();
		helper = new FileImageTemplateHelper('index.html', storage);
	});

	it('execute() returns proper value', () => {
		storage.setContent('dataUrl', 'a.jpg', 'data:...');
		storage.setContent('binary', 'b.jpg', '###');

		const r1 = helper.execute('a.jpg');
		const r2 = helper.execute('b.jpg');

		expect(r1).toEqual('a.jpg');
		expect(r2).toEqual('b.jpg');
	});

	it('execute() throws error when the file does not exist', () => {
		expect(() => helper.execute('unknow.gif'))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find an image file'));
	});
});
