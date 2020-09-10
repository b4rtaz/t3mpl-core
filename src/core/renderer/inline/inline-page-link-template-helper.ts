import { TemplateHelper } from '../template-helper';

export class InlinePageLinkTemplateHelper implements TemplateHelper {
	public name = '$page_link';

	public execute(pageFilePath: string, title: string, className?: string): string {
		const a = document.createElement('a');
		a.setAttribute('href', '#/' + pageFilePath);
		a.setAttribute('onclick', 'window.parent.postMessage(\'openPage:' + pageFilePath + '\', \'*\'); event.preventDefault();');
		if (className && typeof(className) === 'string') {
			a.setAttribute('class', className);
		}
		a.innerText = title;
		return a.outerHTML;
	}
}
