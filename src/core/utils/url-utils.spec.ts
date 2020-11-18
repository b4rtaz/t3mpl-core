import { isDataUrl, isRelativeUrl, concatUrl } from './url-utils';

describe('UrlUtils', () => {

	it('isRelativeUrl() returns proper value', () => {
		expect(isRelativeUrl('https://n4no.com/')).toEqual(false);
		expect(isRelativeUrl('http://n4no.com/')).toEqual(false);
		expect(isRelativeUrl('https://api.jquery.com/jquery-wp-content/themes/jquery/content/books/learning-jquery-4th-ed.jpg')).toEqual(false);
		expect(isRelativeUrl('./a.js')).toEqual(true);
		expect(isRelativeUrl('../a.js')).toEqual(true);
		expect(isRelativeUrl('a.js')).toEqual(true);
		expect(isRelativeUrl('images/gradient.jpg')).toEqual(true);
		expect(isRelativeUrl('')).toEqual(false);
	});

	it('isDataUrl() returns proper value', () => {
		expect(isDataUrl('data:')).toBeTruthy();
		expect(isDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBeTruthy();
		expect(isDataUrl('123')).toBeFalsy();
		expect(isDataUrl('')).toBeFalsy();
	});

	it('joinUrl() returns proper value', () => {
		expect(concatUrl('http://test.com', 'index.html')).toEqual('http://test.com/index.html');
		expect(concatUrl('http://test.com', 'contact/')).toEqual('http://test.com/contact/');
		expect(concatUrl('http://test.com/', './')).toEqual('http://test.com/');
		expect(concatUrl('http://test.com/', 'a.html')).toEqual('http://test.com/a.html');
	});
});
