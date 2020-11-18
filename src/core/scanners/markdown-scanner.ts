import * as marked from 'marked';

export class MarkdownScanner {

	public static scan(content: string, handler: MarkdownScannerHandler) {
		const tokens = marked.lexer(content);
		scanTokens(tokens, handler);
	}
}

export type MarkdownScannerHandler = (type: string, token: marked.Token) => void;

function scanTokens(tokens: marked.TokensList, handler: MarkdownScannerHandler) {
	for (const token of tokens) {
		handler(token['type'], token);
		const children = (token as any).tokens;
		if (children) {
			scanTokens(children, handler);
		}
	}
}
