import { MemoryStorage } from '../../memory-storage';
import { MarkdownToTextHelper } from './markdown-to-text-helper';

describe('MarkdownToTextHelper', () => {

	let contentStorage: MemoryStorage;
	let helper: MarkdownToTextHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		helper = new MarkdownToTextHelper(contentStorage);
	});

	it ('execute() returns plain text', () => {
		contentStorage.setContent('text', 'article.md',
`# My **title**

<img src="foo.jpg" />

Lorem **ipsum** sit [dolor](http://o.com/)`);

		const text = helper.execute('article.md');

		expect(text).toEqual('My title Lorem ipsum sit dolor');
	});

	it ('execute() returns trimmed plain text', () => {
		contentStorage.setContent('text', 'page.md', `# Some long description`);

		const text = helper.execute('page.md', 12);

		expect(text).toEqual('Some long...');
	});
});
