import { PagePath } from './page-path';

describe('PagePath', () => {

	it('createAbsolute() returns proper value', () => {
		const ap1 = PagePath.createAbsolute('index.html');
		expect(ap1.filePath).toEqual('index.html');
		expect(ap1.virutalFilePath).toEqual('index.html');
	});

	it('createDirectory() returns proper value', () => {
		const pp1 = PagePath.createDirectory('article.html');
		expect(pp1.filePath).toEqual('article/index.html');
		expect(pp1.virutalFilePath).toEqual('article/');

		const pp2 = PagePath.createDirectory('feed/rss.xml');
		expect(pp2.filePath).toEqual('feed/rss.xml');
		expect(pp2.virutalFilePath).toEqual('feed/rss.xml');

		const pp3 = PagePath.createDirectory('rss.xml');
		expect(pp3.filePath).toEqual('rss.xml');
		expect(pp3.virutalFilePath).toEqual('rss.xml');

		const pp4 = PagePath.createDirectory('index.html');
		expect(pp4.filePath).toEqual('index.html');
		expect(pp4.virutalFilePath).toEqual('./');

		const pp5 = PagePath.createDirectory('directory/index.html');
		expect(pp5.filePath).toEqual('directory/index.html');
		expect(pp5.virutalFilePath).toEqual('directory/');
	});
});
