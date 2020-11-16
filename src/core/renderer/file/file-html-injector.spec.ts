import parse from 'node-html-parser';

import { FileHtmlInjector } from './file-html-injector';

describe('FileHtmlInjector', () => {

	it('inject() injects properly', () => {
		const injector = new FileHtmlInjector('articles/');

		const injectedHtml = injector.inject(
`<img src="foo.jpg" class="first" />
<img src="http://foo.com/img.jpg" class="second" />
<img />`);

		const doc = parse(injectedHtml);

		expect(doc.querySelector('img.first').getAttribute('src')).toEqual('../foo.jpg');
		expect(doc.querySelector('img.second').getAttribute('src')).toEqual('http://foo.com/img.jpg');
	});
});
