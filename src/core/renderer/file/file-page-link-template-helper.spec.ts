import { FilePageLinkTemplateHelper } from './file-page-link-template-helper';
import { FileUrlBuilder } from './file-url-builder';

describe('FilePageLinkTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const fub = new FileUrlBuilder('index.html');
		const storage = new FilePageLinkTemplateHelper(fub);

		const linkWithClass = storage.execute('index.html', 'home-page', 'grey');
		const linkWithoutClass = storage.execute('index.html', 'home-page');

		expect(linkWithClass).not.toBeNull();
		expect(linkWithoutClass).not.toBeNull();
	});
});
