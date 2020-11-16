import { parse } from 'node-html-parser';

import { MemoryStorage } from '../../memory-storage';
import { InlineScriptTemplateHelper } from './inline-script-templat-helper';

describe('InlineScriptTemplateHelper', () => {

	const SCRIPT_CONTENT = 'var aq3424 = -1;';

	it('execute() returns proper value', () => {
		const storage = new MemoryStorage();
		storage.setContent('text', 'file.js', SCRIPT_CONTENT);

		const helper = new InlineScriptTemplateHelper(storage);

		const html = helper.execute('file.js');

		const doc = parse(html);

		const script = doc.querySelector('script');
		expect(script).not.toBeNull();
		expect(script.getAttribute('type')).toEqual('text/javascript');
		const js = script.innerHTML;
		expect(js).toContain(SCRIPT_CONTENT);
	});
});
