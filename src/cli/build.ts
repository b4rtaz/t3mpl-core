import * as fs from 'fs';

import { DataActivator } from '../core/data/data-activator';
import { DataSerializer } from '../core/data/data-serializer';
import { PagesDataGenerator } from '../core/data/pages-data-generator';
import { exportRelease } from '../core/exporter';
import { MemoryStorage } from '../core/memory-storage';
import { TemplateData } from '../core/model';
import { PagesResolver } from '../core/pages-resolver';
import { TemplateRenderer } from '../core/renderer/template-renderer';
import { ContentType } from '../core/storage';
import { TemplateManifestParser } from '../core/template-manifest-parser';
import { getBasePath, getFileExt, isTextFileExt, simplifyPath } from '../core/utils/path-utils';
import { getArg, tryGetArg } from './node-utils';

function readFiles(basePath: string, filePaths: string[]): MemoryStorage {
	const storage = new MemoryStorage();

	for (const filePath of filePaths) {
		const path = simplifyPath(basePath + filePath);
		const fileExt = getFileExt(path);
		const isText = isTextFileExt(fileExt);

		if (isText) {
			const text = fs.readFileSync(path, 'utf8');
			storage.setContent('text', filePath, text);
		} else {
			const content = fs.readFileSync(path, 'binary');
			storage.setContent('binary', filePath, content);
		}
	}
	return storage;
}

function writeFile(path: string, buffer: Buffer) {
	const dirPath = getBasePath(path);
	fs.mkdirSync(dirPath, { recursive: true });
	fs.writeFileSync(path, buffer);
	console.log(`${path} ${buffer.byteLength} bytes`);
}

export function build() {
	const manifestPath = getArg('--manifest=');
	const exampleData = tryGetArg('--exampleData=') === 'true';
	const dataPath = exampleData ? null : getArg('--data=');
	const outDir = getArg('--outDir=');

	const manifestRaw = fs.readFileSync(manifestPath, 'utf8');

	const parser = new TemplateManifestParser();
	const manifest = parser.parse(manifestRaw);

	const templateStorage = readFiles(getBasePath(manifestPath), manifest.meta.filePaths);
	let contentStorage: MemoryStorage;
	let templateData: TemplateData;

	if (exampleData) {
		contentStorage = new MemoryStorage();
		const dataActivator = new DataActivator(templateStorage, contentStorage);
		const data = dataActivator.createInstance(manifest.dataContract);
		templateData = {
			data: data,
			meta: {
				name: manifest.meta.name,
				version: manifest.meta.version,
				filePaths: contentStorage.getFilePaths(['binary', 'text'])
			}
		};
	} else {
		const templateDataRaw = fs.readFileSync(dataPath, 'utf8');
		const dataSerializer = new DataSerializer();
		templateData = dataSerializer.deserialize(templateDataRaw);
		contentStorage = readFiles(getBasePath(dataPath), templateData.meta.filePaths);
	}

	const pagesResolver = new PagesResolver();
	const pagesDataGenerator = new PagesDataGenerator();
	const renderer = new TemplateRenderer(false, templateStorage, contentStorage, pagesDataGenerator);

	exportRelease(manifest, templateData.data, contentStorage, templateStorage, pagesResolver, renderer,
		(filePath, contentType: ContentType, content) => {
			const realPath = simplifyPath(outDir + filePath);
			if (contentType === 'text') {
				writeFile(realPath, Buffer.from(content, 'utf8'));
			} else {
				writeFile(realPath, Buffer.from(content, 'binary'));
			}
		});
}
