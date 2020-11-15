import { MarkdownRenderer } from '../markdown-renderer';
import { TemplateHelper } from '../template-helper';

export class MarkdownTemplateHelper implements TemplateHelper {
	public readonly name = '$markdown';

	public constructor(
		private readonly markdownRenderer: MarkdownRenderer) {
	}

	public execute(filePath: string): string {
		return this.markdownRenderer.render(false, filePath);
	}
}
