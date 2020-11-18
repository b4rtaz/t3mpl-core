import { MemoryStorage } from '../../memory-storage';
import { FileMarkdownThumbnailHelper } from './file-markdown-thumbnail-helper';
import { FileUrlBuilder } from './file-url-builder';

describe('FileMarkdownThumbnailHelper', () => {

	let contentStorage: MemoryStorage;
	let helper: FileMarkdownThumbnailHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		const fub = new FileUrlBuilder('index.html');
		helper = new FileMarkdownThumbnailHelper(fub, contentStorage);
	});

	it ('execute() returns first exist relative image url', () => {
		contentStorage.setContent('binary', 'assets/b.jpg', '...');
		contentStorage.setContent('text', 'text.md',
`![a](assets/a.jpg)
![a](assets/b.jpg)
<img src="assets/c.jpg" />`);

		const url = helper.execute('text.md');

		expect(url).toEqual('assets/b.jpg');
	});

	it ('execute() returns null when content does not have any image', () => {
		contentStorage.setContent('text', 'text.md', `## header`);

		const url = helper.execute('text.md');

		expect(url).toBeNull();
	});

	it ('execute() returns null when argument is null', () => {
		const url = helper.execute(null);

		expect(url).toBeNull();
	});
});
