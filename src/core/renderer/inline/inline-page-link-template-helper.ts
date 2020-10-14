import { TemplateHelper } from '../template-helper';

export class InlinePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public execute(pageVirtualFilePath: string, title: string, className?: string): string {
		const a = document.createElement('a');
		a.setAttribute('href', '#/' + pageVirtualFilePath);
		a.setAttribute('onclick', 'window.parent.postMessage(\'openPage:' + pageVirtualFilePath + '\', \'*\'); event.preventDefault();');
		if (className && typeof(className) === 'string') {
			a.setAttribute('class', className);
		}
		a.innerText = title;
		return a.outerHTML;
	}
}
