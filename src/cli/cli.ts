import * as fs from 'fs';
import * as process from 'process';

import { DataSerializer } from '../core/data/data-serializer';
import { PagesDataGenerator } from '../core/data/pages-data-generator';
import { exportRelease } from '../core/exporter';
import { MemoryStorage } from '../core/memory-storage';
import { PagesResolver } from '../core/pages-resolver';
import { TemplateRenderer } from '../core/renderer/template-renderer';
import { ContentType } from '../core/storage';
import { TemplateManifestParser } from '../core/template-manifest-parser';
import { getBasePath, getFileExt, isTextFileExt, simplifyPath } from '../core/utils/path-utils';

function getArg(name: string): string {
	const arg = process.argv.find(a => a.startsWith(name));
	if (arg) {
		return arg.substring(name.length);
	}
	throw new Error(`The argument ${name} is required.`);
}

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

export function cli() {
	if (process.argv[2] !== 'build') {
		throw new Error('Unknow command.');
	}

	const manifestPath = getArg('--manifest=');
	const dataPath = getArg('--data=');
	const outDir = getArg('--outDir=');

	const manifestRaw = fs.readFileSync(manifestPath, 'utf8');
	const dataRaw = fs.readFileSync(dataPath, 'utf8');

	const parser = new TemplateManifestParser();
	const manifest = parser.parse(manifestRaw);

	const dataSerializer = new DataSerializer();
	const data = dataSerializer.deserialize(dataRaw);

	const templateStorage = readFiles(getBasePath(manifestPath), manifest.meta.filePaths);
	const contentStorage = readFiles(getBasePath(dataPath), data.meta.filePaths);

	const pagesResolver = new PagesResolver();
	const pagesDataGenerator = new PagesDataGenerator();
	const renderer = new TemplateRenderer(false, templateStorage, contentStorage, pagesDataGenerator);

	exportRelease(manifest, data.data, contentStorage, templateStorage, pagesResolver, renderer,
		(filePath, contentType: ContentType, content) => {
			const realPath = simplifyPath(outDir + filePath);
			if (contentType === 'text') {
				writeFile(realPath, Buffer.from(content, 'utf8'));
			} else {
				writeFile(realPath, Buffer.from(content, 'binary'));
			}
		});
}
