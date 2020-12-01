import { TemplateHelper } from '../template-helper';

export class PageLinkEndTemplateHelper implements TemplateHelper {
	public name = '$page_link_end';

	public execute(): string {
		return '</a>';
	}
}
