import { MemoryStorage } from '../../memory-storage';
import { FileScriptTemplateHelper } from './file-script-templat-helper';

describe('FileScriptTemplateHelper', () => {

	let storage: MemoryStorage;
	let helper: FileScriptTemplateHelper;

	beforeEach(() => {
		storage = new MemoryStorage();
		helper = new FileScriptTemplateHelper('index.html', storage);
	});

	it('execute() returns proper value', () => {
		storage.setContent('text', 'js.js', 'var a = 1;');

		const html = helper.execute('js.js');

		const doc = new DOMParser().parseFromString(html, 'text/html');

		const script = doc.querySelector('script');
		expect(script).not.toBeNull();
		expect(script.getAttribute('type')).toEqual('text/javascript');
		expect(script.getAttribute('src')).toEqual('js.js');
	});

	it('execute() throws error when cannot find the file', () => {
		expect(() => helper.execute('unknown.js'))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find script file'));
	});
});
