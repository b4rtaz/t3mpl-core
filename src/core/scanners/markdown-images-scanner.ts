import { HtmlImagesScanner } from './html-images-scanner';
import { MarkdownScanner } from './markdown-scanner';

export class MarkdownImagesScanner {

	public static scanUrls(content: string): string[] {
		const urls = [];
		MarkdownScanner.scan(content, (type, token) => {
			switch (type) {
				case 'image':
					const url = (token as marked.Tokens.Image).href;
					urls.push(url);
					break;
				case 'html':
					const htmlUrls = HtmlImagesScanner.scanUrls((token as marked.Tokens.HTML).raw);
					urls.push(...htmlUrls);
					break;
			}
		});
		return urls;
	}
}
