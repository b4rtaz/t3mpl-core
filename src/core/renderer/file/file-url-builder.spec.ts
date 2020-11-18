import { FileUrlBuilder } from './file-url-builder';

describe('FileUrlBuilder', () => {

	it('build() when base url is not defined returns relative url', () => {
		const b = new FileUrlBuilder('articles/where-are.html', null);

		const url = b.build('assets/image.jpg');

		expect(url).toEqual('../assets/image.jpg');
	});

	it('build() when base url is defined returns absolute url', () => {
		const b0 = new FileUrlBuilder('articles/where-are.html', 'http://n4no.com/');
		expect(b0.build('assets/image.jpg')).toEqual('http://n4no.com/assets/image.jpg');

		const b1 = new FileUrlBuilder('articles/where-are.html', 'http://n4no.com/');
		expect(b1.build('./')).toEqual('http://n4no.com/');
	});
});
