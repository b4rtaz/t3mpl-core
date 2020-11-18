import { MarkdownScanner } from './markdown-scanner';

describe('MarkdownScanner', () => {

	it('scan() returns proper values', () => {
		const md =
`# Header

Paragraph

![img](img.jpg)`;
		const types: string[] = [];
		MarkdownScanner.scan(md, (type, token) => {
			expect(token).toBeDefined();
			types.push(type);
		});

		expect(types.length).toEqual(7);
		expect(types[0]).toEqual('heading');
		expect(types[1]).toEqual('text');
		expect(types[2]).toEqual('paragraph');
		expect(types[3]).toEqual('text');
		expect(types[4]).toEqual('space');
		expect(types[5]).toEqual('paragraph');
		expect(types[6]).toEqual('image');
	});
});
