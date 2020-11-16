import parse from 'node-html-parser';

import { MemoryStorage } from '../../memory-storage';
import { InlineCssTemplateHelper } from './inline-css-template-helper';

describe('InlineCssTemplateHelper', () => {

	const DATA_URL1 = 'data:image/gif;base64,d41d8cd98f00b204e9800998ecf8427e';
	const DATA_URL2 = 'data:image/gif;base64,3c81cc62cd8a24b231d0c0db34feda61';
	const FONT_URL = 'https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap';
	const EXTERNAL_URL = 'https://domain.com/b.jpg';
	const HASH_URL = '#svgid';
	const COLOR1 = '#A03131';
	const COLOR2 = '#368393';
	const COLOR3 = '#A0CED8';
	const COLOR4 = '#CE0FC4';

	it('execute() returns proper value', () => {
		const storage = new MemoryStorage();

		storage.setContent('text', 'style.css',
			`@import 'import1.css';
			@import   'import2.css'  ;
			@import 'import3.css' ;
			@import '${FONT_URL}';
			body {background: url   ('file.png') ;}
			section {background: url(${DATA_URL2});}
			div {background: url(${EXTERNAL_URL}) ;}
			nav {background: url(${HASH_URL}) ;}`);

		storage.setContent('dataUrl', 'file.png', DATA_URL1);
		storage.setContent('text', 'import1.css', `h1 {color: ${COLOR1};}`);
		storage.setContent('text', 'import2.css', `h2 {color: ${COLOR2};}`);
		storage.setContent('text', 'import3.css',
			`@import 'import4.css';
			h3 {color: ${COLOR3};}`);
		storage.setContent('text', 'import4.css', `h4 {color: ${COLOR4};}`);

		const helper = new InlineCssTemplateHelper(storage);

		const html = helper.execute('style.css');

		const doc = parse(html);
		const style = doc.querySelector('style');
		expect(style).not.toBeNull();
		expect(style.getAttribute('type')).toEqual('text/css');
		const css = style.innerHTML;
		expect(css).toContain(FONT_URL);
		expect(css).toContain(DATA_URL1);
		expect(css).toContain(DATA_URL2);
		expect(css).toContain(EXTERNAL_URL);
		expect(css).toContain(HASH_URL);
		expect(css).toContain(COLOR1);
		expect(css).toContain(COLOR2);
		expect(css).toContain(COLOR3);
		expect(css).toContain(COLOR4);
	});
});
