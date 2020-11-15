import { MemoryStorage } from '../../memory-storage';
import { MarkdownRenderer } from '../markdown-renderer';
import { MarkdownTemplateHelper } from './markdown-template-helper';

describe('MarkdownTemplateHelper', () => {

	let contentStorage: MemoryStorage;
	let renderer: MarkdownRenderer;
	let helper: MarkdownTemplateHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		renderer = new MarkdownRenderer(false, contentStorage);
		helper = new MarkdownTemplateHelper(renderer);
	});

	it ('execute() returns generated correctly html', () => {
		contentStorage.setContent('text', 'content/foo.md', '**bold**');

		const html = helper.execute('content/foo.md');

		expect(html).toContain('<p><strong>bold</strong></p>');
	});

	it ('execute() does not support excerpt', () => {
		contentStorage.setContent('text', 'foo.md', 'Te<!--more-->st');

		const html = helper.execute('foo.md');

		expect(html).toContain('Te<!--more-->st');
	});
});
