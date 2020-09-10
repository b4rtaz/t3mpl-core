import { ReadableStorage } from '../../storage';
import { isRelativeUrl } from '../../utils/url-utils';
import { TemplateHelper } from '../template-helper';
import { getBasePath, simplifyPath } from '../../utils/path-utils';

export class InlineCssTemplateHelper implements TemplateHelper {
	public readonly name = '$css';

	public constructor(
		private readonly templateStorage: ReadableStorage) {
	}

	public execute(filePath: string): string {
		const basePath = getBasePath(filePath);
		const rawCss = this.templateStorage.getContent('text', filePath);
		const css = this.process(basePath, rawCss);

		const style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.innerHTML = css;
		return style.outerHTML;
	}

	public process(basePath: string, rawCss: string): string {
		return rawCss
			.replace(/\@import\s+[\'\"]([^\'\"]+)[\'\"]\s*\;/g, (e, url) => this.processImport(basePath, e, url))
			.replace(/url\s*\([\'\"]?([^\'\"\)]+)[\'\"]?\)\s*/g, (e, url) => this.processUrl(basePath, e, url));
	}

	private processImport(basePath: string, expression: string, url: string): string {
		if (isRelativeUrl(url)) {
			const path = simplifyPath(basePath + url);
			const subRawCss = this.templateStorage.getContent('text', path);
			return this.process(basePath, subRawCss);
		}
		return expression;
	}

	private processUrl(basePath: string, expression: string, url: string) {
		if (isRelativeUrl(url) && !url.startsWith('#')) {
			const path = simplifyPath(basePath + url);
			const base64 = this.templateStorage.getContent('dataUrl', path);
			return `url('${base64}')`;
		}
		return expression;
	}
}
