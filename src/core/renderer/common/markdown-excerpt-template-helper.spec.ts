import { MemoryStorage } from '../../memory-storage';
import { MarkdownExcerptTemplateHelper, extractExcerpt } from './markdown-excerpt-template-helper';

describe('MarkdownExcerptTemplateHelper', () => {

	let contentStorage: MemoryStorage;
	let helper: MarkdownExcerptTemplateHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		helper = new MarkdownExcerptTemplateHelper(contentStorage);
	});

	it ('execute() returns [NULL] when file path is null', () => {
		const html = helper.execute(null);

		expect(html).toEqual('[NULL]');
	});

	it ('extractExcerpt() returns proper value', () => {
		expect(extractExcerpt('Lorem<!--more-->Ipsum')).toEqual('Lorem');
		expect(extractExcerpt('Lorem<!--more-->Ipsum<!--more-->Sit')).toEqual('Lorem');
		expect(extractExcerpt('Lorem')).toEqual('Lorem');
	});
});
