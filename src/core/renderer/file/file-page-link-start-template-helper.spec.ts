import { FilePageLinkStartTemplateHelper } from './file-page-link-start-template-helper';
import { FileUrlBuilder } from './file-url-builder';

describe('FilePageLinkEndTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const fub = new FileUrlBuilder('index.html');
		const helper = new FilePageLinkStartTemplateHelper(fub);

		const withClass = helper.execute('image.jpg', 'alfa');
		expect(withClass).toEqual('<a href="image.jpg" class="alfa">');

		const withoutClass = helper.execute('rrr.jpg');
		expect(withoutClass).toEqual('<a href="rrr.jpg">');
	});
});
