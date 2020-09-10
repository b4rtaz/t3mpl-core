import { MemoryStorage } from '../../memory-storage';
import { FileScriptTemplateHelper } from './file-script-templat-helper';

describe('FileScriptTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const storage = new MemoryStorage();
		const helper = new FileScriptTemplateHelper(storage);

		storage.setContent('text', 'js.js', 'var a = 1;');

		const html = helper.execute('js.js');

		const doc = new DOMParser().parseFromString(html, 'text/html');

		const script = doc.querySelector('script');
		expect(script).not.toBeNull();
		expect(script.getAttribute('type')).toEqual('text/javascript');
		expect(script.getAttribute('src')).toEqual('js.js');
	});
});
