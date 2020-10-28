import { PageContractMap, PagePathStrategy } from './model';
import { PagesResolver } from './pages-resolver';

describe('PagesResolver', () => {

	it('resolve() returns proper value', () => {
		const data = {
			A: {
				B: {
					C: [
						{ URL: 'alfa' },
						{ URL: 'beta' },
						{ URL: null }
					]
				}
			}
		};
		const pages: PageContractMap = {
			INDEX: {
				filePath: 'index.html',
				templateFilePath: 'index.html'
			},
			ARTICLES: {
				filePath: 'articles/article.html',
				templateFilePath: 'article.html',
				multiplier: {
					dataPath: 'A.B.C'
				}
			},
			NEWS: {
				filePath: 'news.html',
				templateFilePath: 'template.html',
				multiplier: {
					dataPath: 'A.B.C',
					fileNameDataPath: 'URL'
				}
			},
			NOEXT: {
				filePath: 'no-ext',
				templateFilePath: 'noext.html',
				multiplier: {
					dataPath: 'A.B.C'
				}
			}
		};

		const resolver = new PagesResolver(PagePathStrategy.absolute);
		const p = resolver.resolve(pages, data);

		expect(p.length).toEqual(10);
		expect(p[0].filePath).toEqual('index.html');
		expect(p[0].templateFilePath).toEqual('index.html');

		expect(p[1].filePath).toEqual('articles/article-3.html');
		expect(p[2].filePath).toEqual('articles/article-2.html');
		expect(p[3].filePath).toEqual('articles/article-1.html');
		expect(p[3].dataPath).toEqual('A.B.C[2]');
		expect(p[3].templateFilePath).toEqual('article.html');
		expect(p[3].name).toEqual('ARTICLES');

		expect(p[4].filePath).toEqual('alfa.html');
		expect(p[5].filePath).toEqual('beta.html');
		expect(p[6].filePath).toEqual('news-1.html');
		expect(p[6].dataPath).toEqual('A.B.C[2]');
		expect(p[6].templateFilePath).toEqual('template.html');
		expect(p[6].name).toEqual('NEWS');

		expect(p[7].filePath).toEqual('no-ext-3');
		expect(p[8].filePath).toEqual('no-ext-2');
		expect(p[9].filePath).toEqual('no-ext-1');
	});

	it('resolve() throws error when dataPath has pointer to invalid type', () => {
		const data = { A: { B: { C: 'string' } }};

		const pages: PageContractMap = {
			ARTICLE: {
				filePath: 'article.html',
				templateFilePath: 'article.html',
				multiplier: {
					dataPath: 'A.B.C'
				}
			}
		};

		const resolver = new PagesResolver(PagePathStrategy.absolute);

		expect(() => resolver.resolve(pages, data))
			.toThrowMatching((e: Error) => e.message === 'Unsuported data type. Collection was expected.');
	});

	it('resolve() divider', () => {
		const data = { A: { B: { C: [] } }};
		for (let i = 0; i < 30; i++) {
			data.A.B.C.push({ D: i });
		}

		const pages: PageContractMap = {
			ENTRIES: {
				filePath: 'entries.html',
				templateFilePath: 'entries.html',
				divider: {
					divisor: 4,
					pageName: 'ARTICLE',
					firstFilePath: 'index.html'
				}
			},
			ARTICLE: {
				filePath: 'article.html',
				templateFilePath: 'article.html',
				multiplier: {
					dataPath: 'A.B.C'
				}
			}
		};

		const resolver = new PagesResolver(PagePathStrategy.directory);
		const p = resolver.resolve(pages, data);

		expect(p.length).toEqual(30 + 8);

		expect(p[0].filePath).toEqual('index.html');
		expect(p[0].virtualFilePath).toEqual('./');
		expect(p[0].subPages.length).toEqual(4);
		expect(p[0].subPages[0].filePath).toEqual('article-30/index.html');
		expect(p[0].subPages[3].filePath).toEqual('article-27/index.html');

		expect(p[1].filePath).toEqual('entries-2/index.html');
		expect(p[1].subPages.length).toEqual(4);
		expect(p[1].subPages[0].filePath).toEqual('article-26/index.html');
		expect(p[1].subPages[3].filePath).toEqual('article-23/index.html');

		expect(p[2].filePath).toEqual('entries-3/index.html');
		expect(p[2].virtualFilePath).toEqual('entries-3/');
		expect(p[3].filePath).toEqual('entries-4/index.html');
		expect(p[3].virtualFilePath).toEqual('entries-4/');

		expect(p[8].filePath).toEqual('article-30/index.html');
		expect(p[8].virtualFilePath).toEqual('article-30/');
		expect(p[9].filePath).toEqual('article-29/index.html');
		expect(p[10].filePath).toEqual('article-28/index.html');
		expect(p[11].filePath).toEqual('article-27/index.html');
	});

	it('resolve() throws error when path strategy is not supported', () => {
		const data = { A: { B: { C: [] } }};

		const pages: PageContractMap = {
			INDEX: {
				filePath: 'index.html',
				templateFilePath: 'index.html'
			}
		};

		const resolver = new PagesResolver(<any>'NOT_SUPPORTED_PATH_STRATEGY');

		expect(() => resolver.resolve(pages, data))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported page path strategy'));
	});
});
