import { MemoryStorage } from '../../memory-storage';
import { InlineHtmlInjector } from '../inline/inline-html-injector';
import { MarkdownRenderer } from '../markdown-renderer';
import { MarkdownTemplateHelper } from './markdown-template-helper';

describe('MarkdownTemplateHelper', () => {

	let contentStorage: MemoryStorage;
	let renderer: MarkdownRenderer;
	let helper: MarkdownTemplateHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		renderer = new MarkdownRenderer(new InlineHtmlInjector(contentStorage), contentStorage);
		helper = new MarkdownTemplateHelper(renderer);
	});

	it ('execute() returns generated correctly html', () => {
		contentStorage.setContent('text', 'content/foo.md', '**bold**');

		const html = helper.execute('content/foo.md');

		expect(html).toContain('<p><strong>bold</strong></p>');
	});

	it ('execute() does not support excerpt', () => {
		contentStorage.setContent('text', 'foo.md', '12345<!--more-->6789');

		const html = helper.execute('foo.md');

		expect(html).toContain('12345');
		expect(html).toContain('6789');
	});
});
