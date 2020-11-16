import { MemoryStorage } from '../../memory-storage';
import { InlineHtmlInjector } from '../inline/inline-html-injector';
import { MarkdownRenderer } from '../markdown-renderer';
import { MarkdownExcerptTemplateHelper } from './markdown-excerpt-template-helper';

describe('MarkdownExcerptTemplateHelper', () => {

	it ('execute() returns proper value', () => {
		const contentStorage = new MemoryStorage();
		const renderer = new MarkdownRenderer(new InlineHtmlInjector(contentStorage), contentStorage);
		const helper = new MarkdownExcerptTemplateHelper(renderer);

		contentStorage.setContent('text', 'doc.md', 'Te<!--more-->st');

		const html = helper.execute('doc.md');

		expect(html).toContain('<p>Te</p>');
	});
});
