import { FilePageLinkUrlTemplateHelper } from './file-page-link-url-template-helper';
import { FileUrlBuilder } from './file-url-builder';

describe('FilePageLinkUrlTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const fub = new FileUrlBuilder('catalog/test.html', 'http://example.com/');
		const helper = new FilePageLinkUrlTemplateHelper(fub);

		const url = helper.execute('assets/index.html');
		expect(url).toEqual('http://example.com/assets/index.html');
	});
});
