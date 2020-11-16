import parse from 'node-html-parser';

import { MemoryStorage } from '../../memory-storage';
import { InlineHtmlInjector } from './inline-html-injector';

describe('InlineHtmlInjector', () => {

	it('inject() injects properly', () => {
		const storage = new MemoryStorage();
		storage.setContent('dataUrl', 'foo.jpg', 'data:');

		const injector = new InlineHtmlInjector(storage);

		const injectedHtml = injector.inject(
`<h2>Test</h2>
<img src="foo.jpg" class="first" />
<img src="http://foo.com/img.jpg" class="second">
<img />`);

		const doc = parse(injectedHtml);

		expect(doc.querySelector('img.first').getAttribute('src')).toEqual('data:');
		expect(doc.querySelector('img.second').getAttribute('src')).toEqual('http://foo.com/img.jpg');
	});
});
