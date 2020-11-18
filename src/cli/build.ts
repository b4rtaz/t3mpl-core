import * as fs from 'fs';
import * as path from 'path';

import { DataActivator } from '../core/data/data-activator';
import { DataSerializer } from '../core/data/data-serializer';
import { PagesDataGenerator } from '../core/data/pages-data-generator';
import { Exporter } from '../core/exporter';
import { MemoryStorage } from '../core/memory-storage';
import { TemplateData } from '../core/model';
import { PagesResolver } from '../core/pages-resolver';
import { TemplateRenderer } from '../core/renderer/template-renderer';
import { UsedFilesScanner } from '../core/scanners/used-files-scanner';
import { ContentType } from '../core/storage';
import { getDefaultConfiguration } from '../core/template-configuration';
import { TemplateManifestParser } from '../core/template-manifest-parser';
import { getBasePath, getFileExt, isTextFileExt } from '../core/utils/path-utils';
import { getArg, tryGetArg } from './node-utils';

function readFiles(basePath: string, filePaths: string[]): MemoryStorage {
	const storage = new MemoryStorage();

	for (const filePath of filePaths) {
		const finalPath = path.join(basePath, filePath);
		const fileExt = getFileExt(finalPath);
		const isText = isTextFileExt(fileExt);

		if (isText) {
			const text = fs.readFileSync(finalPath, 'utf8');
			storage.setContent('text', filePath, text);
		} else {
			const content = fs.readFileSync(finalPath, 'binary');
			storage.setContent('binary', filePath, content);
		}
	}
	return storage;
}

function writeFile(filePath: string, buffer: Buffer) {
	const dirPath = path.dirname(filePath);
	fs.mkdirSync(dirPath, { recursive: true });
	fs.writeFileSync(filePath, buffer);
	console.log(`${filePath} ${buffer.byteLength} bytes`);
}

export function build() {
	const manifestPath = getArg('--manifest=');
	const exampleData = tryGetArg('--exampleData=') === 'true';
	const dataPath = exampleData ? null : getArg('--data=');
	const outDir = getArg('--outDir=');

	const manifestRaw = fs.readFileSync(manifestPath, 'utf8');

	const parser = new TemplateManifestParser();
	const manifest = parser.parse(manifestRaw);

	const templateStorage = readFiles(path.dirname(manifestPath), manifest.meta.filePaths);
	let contentStorage: MemoryStorage;
	let templateData: TemplateData;

	if (exampleData) {
		contentStorage = new MemoryStorage();
		const dataActivator = new DataActivator(templateStorage, contentStorage);
		const data = dataActivator.createInstance(manifest.dataContract);
		templateData = {
			data,
			configuration: getDefaultConfiguration(),
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

	const pagesResolver = new PagesResolver(templateData.configuration.pagePathStrategy);
	const pagesDataGenerator = new PagesDataGenerator();
	const renderer = new TemplateRenderer(false, templateStorage, contentStorage, pagesDataGenerator);
	const usedFilesScanner = new UsedFilesScanner(contentStorage);

	Exporter.exportRelease(manifest, templateData, contentStorage, templateStorage, pagesResolver, renderer, usedFilesScanner,
		(filePath, contentType: ContentType, content) => {
			const finalPath = path.join(outDir, filePath);
			if (contentType === 'text') {
				writeFile(finalPath, Buffer.from(content, 'utf8'));
			} else {
				writeFile(finalPath, Buffer.from(content, 'binary'));
			}
		});
}
