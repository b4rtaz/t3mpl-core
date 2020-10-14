import {
	extendFileName,
	getBasePath,
	getFileExt,
	getFilePathWithoutExt,
	isTextFileExt,
	relativize,
	replaceFileName,
	simplifyPath
} from './path-utils';

describe('PathUtils', () => {

	it('getFileExt() returns proper value', () => {
		expect(getFileExt('test/v.pdf')).toEqual('.pdf');
		expect(getFileExt('qwe.jpeg')).toEqual('.jpeg');
		expect(getFileExt('qwe.jpg')).toEqual('.jpg');
		expect(getFileExt('.smth/.sss/.dot.zip')).toEqual('.zip');
		expect(getFileExt('test/foo/bar')).toEqual('');
	});

	it('getFilePathWithoutExt() returns proper value', () => {
		expect(getFilePathWithoutExt('test/v.pdf')).toEqual('test/v');
		expect(getFilePathWithoutExt('qwe.jpeg')).toEqual('qwe');
		expect(getFilePathWithoutExt('qwe.jpg')).toEqual('qwe');
		expect(getFilePathWithoutExt('.smth/.sss/.dot.zip')).toEqual('.smth/.sss/.dot');
		expect(getFilePathWithoutExt('test/foo/bar')).toEqual('test/foo/bar');
	});

	it('isTextFileExt() returns proper value', () => {
		expect(isTextFileExt('.txt')).toBeTruthy();
		expect(isTextFileExt('.JsOn')).toBeTruthy();
		expect(isTextFileExt('.html')).toBeTruthy();
		expect(isTextFileExt('.CSS')).toBeTruthy();
		expect(isTextFileExt('.JS')).toBeTruthy();
		expect(isTextFileExt('.pdf')).toBeFalsy();
		expect(isTextFileExt('.eot')).toBeFalsy();
		expect(isTextFileExt('.woff')).toBeFalsy();
	});

	it('getBasePath() returns proper value', () => {
		expect(getBasePath('../t/q.js')).toEqual('../t/');
		expect(getBasePath('q.js')).toEqual('');
		expect(getBasePath('t/z.pdf')).toEqual('t/');
	});

	it('extendFileName() returns proper value', () => {
		expect(extendFileName('alfa.gif', '012')).toEqual('alfa-012.gif');
		expect(extendFileName('a/b/c.jpg', '111')).toEqual('a/b/c-111.jpg');
		expect(extendFileName('a/b/c', '111')).toEqual('a/b/c-111');
	});

	it('replaceFileName() returns proper value', () => {
		expect(replaceFileName('alfa.gif', '1234')).toEqual('1234.gif');
		expect(replaceFileName('a/b/c.jpg', '5678')).toEqual('a/b/5678.jpg');
	});

	it('simplifyPath() returns proper value', () => {
		expect(simplifyPath('alfa.js?p=1')).toEqual('alfa.js');
		expect(simplifyPath('alfa.js#anchor')).toEqual('alfa.js');
		expect(simplifyPath('alfa.js?p=2#anchor')).toEqual('alfa.js');
		expect(simplifyPath('alfa/beta/../q.js')).toEqual('alfa/q.js');
		expect(simplifyPath('./a.js')).toEqual('a.js');
		expect(simplifyPath('a/b/c/../../q.js')).toEqual('a/q.js');
	});

	it('simplifyPath() throws error when path is invalid', () => {
		const valid = (e: Error) => e.message.startsWith('Invalid relative file path');
		expect(() => simplifyPath('../a.js')).toThrowMatching(valid);
		expect(() => simplifyPath('a/b/../../../a.js')).toThrowMatching(valid);
		expect(() => simplifyPath('..')).toThrowMatching(valid);
	});

	it('relativize() returns proper value', () => {
		const r1 = relativize('sub-folder/index.html', 'assets/image.jpg');
		expect(r1).toEqual('../assets/image.jpg');

		const r2 = relativize('sub-folder/sub-sub-folder/index.html', 'assets/image.jpg');
		expect(r2).toEqual('../../assets/image.jpg');

		const r3 = relativize('index.html', 'assets/image.jpg');
		expect(r3).toEqual('assets/image.jpg');

		const r4 = relativize('dir/some.html', 'articles/');
		expect(r4).toEqual('../articles/');

		const r5 = relativize('index.html', './');
		expect(r5).toEqual('./');

		const r6 = relativize('index.html', 'test/');
		expect(r6).toEqual('test/');
	});
});
