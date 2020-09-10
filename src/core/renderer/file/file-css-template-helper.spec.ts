import { MemoryStorage } from '../../memory-storage';
import { FileCssTemplateHelper } from './file-css-template-helper';

describe('FileCssTemplateHelper', () => {

	const CSS_FILE_PATH = 'foo/t3st.css';

	it('execute() returns proper value', () => {
		const storage = new MemoryStorage();
		storage.setContent('text', CSS_FILE_PATH, 'a {}');

		const helper = new FileCssTemplateHelper(storage);

		const html = helper.execute(CSS_FILE_PATH);

		const doc = new DOMParser().parseFromString(html, 'text/html');

		const link = doc.querySelector('link');
		expect(link).not.toBeNull();
		expect(link.getAttribute('rel')).toEqual('stylesheet');
		expect(link.getAttribute('href')).toEqual(CSS_FILE_PATH);
	});
});
