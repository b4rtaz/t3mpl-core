import { MarkdownRenderer } from '../markdown-renderer';
import { TemplateHelper } from '../template-helper';

export class MarkdownExcerptTemplateHelper implements TemplateHelper {
	public readonly name = '$markdown_excerpt';

	public constructor(
		private readonly markdownRenderer: MarkdownRenderer) {
	}

	public execute(filePath: string): string {
		return this.markdownRenderer.render(true, filePath);
	}
}
