import { ReadableStorage } from '../../storage';
import { TemplateHelper } from '../template-helper';

export class InlineScriptTemplateHelper implements TemplateHelper {
	public readonly name = '$script';

	public constructor(
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		const rawJs = this.templateStorage.getContent('text', filePath);

		const script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.innerHTML = rawJs;
		return script.outerHTML;
	}
}
