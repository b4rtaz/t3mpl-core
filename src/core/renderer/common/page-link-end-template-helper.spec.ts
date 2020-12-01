import { PageLinkEndTemplateHelper } from './page-link-end-template-helper';

describe('PageLinkEndTemplateHelper', () => {

	it('execute() returns proper value', () => {
		const helper = new PageLinkEndTemplateHelper();

		expect(helper.execute()).toEqual('</a>');
	});
});
