import { parse } from 'node-html-parser';

import { MemoryStorage } from '../../memory-storage';
import { FileCssTemplateHelper } from './file-css-template-helper';
import { FileUrlBuilder } from './file-url-builder';

describe('FileCssTemplateHelper', () => {

	const CSS_FILE_PATH = 'foo/t3st.css';

	let storage: MemoryStorage;
	let helper: FileCssTemplateHelper;

	beforeEach(() => {
		storage = new MemoryStorage();
		const fub = new FileUrlBuilder('index.html');
		helper = new FileCssTemplateHelper(fub, storage);
	});

	it('execute() returns proper value', () => {
		storage.setContent('text', CSS_FILE_PATH, 'a {}');

		const html = helper.execute(CSS_FILE_PATH);

		const doc = parse(html);

		const link = doc.querySelector('link');
		expect(link).not.toBeNull();
		expect(link.getAttribute('rel')).toEqual('stylesheet');
		expect(link.getAttribute('href')).toEqual(CSS_FILE_PATH);
	});

	it('execute() throws error when cannot find the file', () => {
		expect(() => helper.execute('unknown.css'))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find CSS file'));
	});
});
