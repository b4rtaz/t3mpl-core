import { MemoryStorage } from '../memory-storage';
import { extractExcerpt, MarkdownRenderer } from './markdown-renderer';

describe('MarkdownRenderer', () => {

	let contentStorage: MemoryStorage;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
	});

	it ('render() returns [NULL] when file path is null', () => {
		const renderer = new MarkdownRenderer(false, contentStorage);

		const html = renderer.render(false, null);

		expect(html).toEqual('[NULL]');
	});

	it ('render() returns proper value', () => {
		const renderer = new MarkdownRenderer(false, contentStorage);

		contentStorage.setContent('text', 'content/foo.md', '**bold**');

		const html = renderer.render(false, 'content/foo.md');

		expect(html).toContain('<p><strong>bold</strong></p>');
	});

	it ('render() when excerpt mode is enabled then returns cutted content', () => {
		const renderer = new MarkdownRenderer(false, contentStorage);

		contentStorage.setContent('text', 'a.md', 'Te<!--more-->st');
		contentStorage.setContent('text', 'b.md', 'Test');

		const a = renderer.render(true, 'a.md');
		expect(a).toContain('<p>Te</p>');

		const b = renderer.render(true, 'b.md');
		expect(b).toContain('<p>Test</p>');
	});

	it ('render() when inline mode is enabled then returns processed html to inline', () => {
		const renderer = new MarkdownRenderer(true, contentStorage);

		contentStorage.setContent('dataUrl', 'image.jpg', 'IM4G3_C0NT3NT');
		contentStorage.setContent('text', 'text.md', '![img](image.jpg)');

		const html = renderer.render(false, 'text.md');

		expect(html).toContain('IM4G3_C0NT3NT');
	});
});

describe('extractExcerpt', () => {

	it ('extractExcerpt() returns proper value', () => {
		expect(extractExcerpt('Lorem<!--more-->Ipsum')).toEqual('Lorem');
		expect(extractExcerpt('Lorem<!--more-->Ipsum<!--more-->Sit')).toEqual('Lorem');
		expect(extractExcerpt('Lorem')).toEqual('Lorem');
	});
});
