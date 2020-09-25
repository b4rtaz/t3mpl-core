import { FilePageLinkTemplateHelper } from './file-page-link-template-helper';

describe('FilePageLinkTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const storage = new FilePageLinkTemplateHelper('index.html');

		const linkWithClass = storage.execute('index.html', 'home-page', 'grey');
		const linkWithoutClass = storage.execute('index.html', 'home-page');

		expect(linkWithClass).not.toBeNull();
		expect(linkWithoutClass).not.toBeNull();
	});
});
