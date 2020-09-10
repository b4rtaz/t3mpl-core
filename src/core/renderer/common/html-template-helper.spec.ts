import { MemoryStorage } from '../../memory-storage';
import { HtmlTemplateHelper } from './html-template-helper';

describe('HtmlTemplateHelper', () => {

	const HTML_FILE_PATH = 'a/b/c/html.html';
	const HTML_CONTENT = '<h1>123</h1> &amp;';

	let contentStorage: MemoryStorage;
	let helper: HtmlTemplateHelper;

	beforeEach(() => {
		contentStorage = new MemoryStorage();
		helper = new HtmlTemplateHelper(contentStorage);
	});

	it('execute() returns proper value', () => {
		contentStorage.setContent('text', HTML_FILE_PATH, HTML_CONTENT);

		const html = helper.execute(HTML_FILE_PATH);

		expect(html).toEqual(HTML_CONTENT);
	});

	it ('execute() returns [NULL] when file path is null', () => {
		const html = helper.execute(null);

		expect(html).toEqual('[NULL]');
	});
});
