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
});
