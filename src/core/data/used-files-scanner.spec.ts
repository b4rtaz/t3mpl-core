import { MemoryStorage } from '../memory-storage';
import { TemplateManifestParser } from '../template-manifest-parser';
import { UsedFilesScanner } from './used-files-scanner';

describe('UsedFilesScanner', () => {

	it('validate() returns proper value', () => {
		const t = new TemplateManifestParser().parse(
`meta:
  version: 1
  name: X
  author: Y
  license: MIT
  filePaths: []

dataContract:
  X:
    sections:
      Y:
        properties:
          IMAGE:
            type: (image)
          HTML:
            type: (html)
          MD:
            type: (markdown)
          COLL:
            type: (collection)
            properties:
              TEXT:
                type: (text)
              THUMBNAIL:
                type: (image)
                required: false
pages:
  INDEX:
    filePath: index.html
    templateFilePath: index.html
`);

			const data = {
				X: {
					Y: {
						IMAGE: 'content/image/image.jpg',
						HTML: 'content/html/html.html',
						MD: 'content/markdown/md.md',
						COLL: [
							{
								TEXT: 'foo',
								THUMBNAIL: 'content/image/thumbnail.jpg'
							},
							{
								TEXT: 'bar',
								THUMBNAIL: null
							}
						]
					}
				}
			};

			const contentStorage = new MemoryStorage();
			contentStorage.setContent('text', 'content/html/html.html',
`<h2>Header</h2>
<img src="content/image/html-zero.gif">`);
			contentStorage.setContent('text', 'content/markdown/md.md',
`## Header

![md-alfa](content/image/md-alfa.jpg)

<p>
	<img src="content/image/md-beta.jpg" width="100" height="200" />
	<span><IMG ALT="EXAMPLE" SRC="content/image/md-gamma.jpg" /></span>
	<img src="http://some.com/image.jpg">
</p>`);

			const p = new UsedFilesScanner(contentStorage).scan(t.dataContract, data);

			expect(p).toContain('content/image/image.jpg');
			expect(p).toContain('content/image/thumbnail.jpg');
			expect(p).toContain('content/html/html.html');
			expect(p).toContain('content/image/html-zero.gif');
			expect(p).toContain('content/markdown/md.md');
			expect(p).toContain('content/image/md-alfa.jpg');
			expect(p).toContain('content/image/md-beta.jpg');
			expect(p).toContain('content/image/md-gamma.jpg');
			expect(p).not.toContain('http://some.com/image.jpg');
		});
});
