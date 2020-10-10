import { MemoryStorage } from '../../memory-storage';
import { MarkdownTemplateHelper } from './markdown-template-helper';

describe('MarkdownTemplateHelper', () => {

	let contentStorage: MemoryStorage;
	let helper: MarkdownTemplateHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		helper = new MarkdownTemplateHelper(contentStorage);
	});

	it ('execute() returns [NULL] when file path is null', () => {
		const html = helper.execute(null);

		expect(html).toEqual('[NULL]');
	});

	it ('execute() returns proper value', () => {
		contentStorage.setContent('text', 'content/foo.md', '**bold**');

		const html = helper.execute('content/foo.md');

		expect(html).toContain('<p><strong>bold</strong></p>');
	});
});
