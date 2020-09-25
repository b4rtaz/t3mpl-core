import * as Handlebars from 'handlebars';

import { PARTIAL_EXT } from '../constants';
import { PagesDataGenerator } from '../data/pages-data-generator';
import { Page } from '../model';
import { ReadableStorage } from '../storage';
import { getFileExt, getFilePathWithoutExt } from '../utils/path-utils';
import { CopyrightTemplateHelper } from './common/copyright-template-helper';
import { DateTimeTemplateHelper } from './common/datetime-template-helper';
import { HtmlTemplateHelper } from './common/html-template-helper';
import { ifEqualHelper } from './common/if-equal-helper';
import { jsonHelper } from './common/json-helper';
import { MarkdownExcerptTemplateHelper } from './common/markdown-excerpt-template-helper';
import { MarkdownTemplateHelper } from './common/markdown-template-helper';
import { poweredByHelper } from './common/powered-by-helper';
import { FileCssTemplateHelper } from './file/file-css-template-helper';
import { FileImageTemplateHelper } from './file/file-image-template-helper';
import { FilePageLinkTemplateHelper } from './file/file-page-link-template-helper';
import { FileScriptTemplateHelper } from './file/file-script-templat-helper';
import { InlineCssTemplateHelper } from './inline/inline-css-template-helper';
import { InlineImageTemplateHelper } from './inline/inline-image-template-helper';
import { InlinePageLinkTemplateHelper } from './inline/inline-page-link-template-helper';
import { InlineScriptTemplateHelper } from './inline/inline-script-templat-helper';

export class TemplateRenderer {

	public constructor(
		private readonly inline: boolean,
		private readonly templateStorage: ReadableStorage,
		private readonly contentStorage: ReadableStorage,
		private readonly pagesDataGenerator: PagesDataGenerator) {
	}

	public render(pages: Page[], currentPage: Page, data: any): string {
		const pageContent = this.templateStorage.getContent('text', currentPage.templateFilePath);

		const pagesData = this.pagesDataGenerator.generateData(pages, currentPage, data);

		const extendedData = Object.assign(pagesData, data);

		const template = Handlebars.compile(pageContent, {
			strict: true
		});
		const output = template(extendedData, {
			partials: getPartials(currentPage.templateFilePath, this.templateStorage),
			helpers: getHelpers(this.inline, currentPage.filePath, this.templateStorage, this.contentStorage)
		});
		return output;
	}
}

export function getPartials(templateFilePath: string, templateStorage: ReadableStorage): PartialMap {
	const partials: PartialMap = {};

	const filePaths = templateStorage.getFilePaths('text');
	for (const path of filePaths) {
		if (path !== templateFilePath && getFileExt(path) === PARTIAL_EXT) {
			const partialName = getFilePathWithoutExt(path);
			partials[partialName] = (data, options) => {
				const content = templateStorage.getContent('text', path);
				const template = Handlebars.compile(content);
				return template(data, options);
			};
		}
	}
	return partials;
}

export function getHelpers(inline: boolean, currentPagePath: string, templateStorage: ReadableStorage, contentStorage: ReadableStorage): HelperMap {
	const helpers = [];

	if (inline) {
		helpers.push(new InlineCssTemplateHelper(templateStorage));
		helpers.push(new InlineScriptTemplateHelper(templateStorage));
		helpers.push(new InlineImageTemplateHelper(contentStorage));
		helpers.push(new InlinePageLinkTemplateHelper());
	} else {
		helpers.push(new FileCssTemplateHelper(currentPagePath, templateStorage));
		helpers.push(new FileScriptTemplateHelper(currentPagePath, templateStorage));
		helpers.push(new FileImageTemplateHelper(currentPagePath, contentStorage));
		helpers.push(new FilePageLinkTemplateHelper(currentPagePath));
	}

	helpers.push(new HtmlTemplateHelper(contentStorage));
	helpers.push(new MarkdownTemplateHelper(contentStorage));
	helpers.push(new MarkdownExcerptTemplateHelper(contentStorage));
	helpers.push(new DateTimeTemplateHelper(null)); // TODO: utfOffset should come from project settings.
	helpers.push(new CopyrightTemplateHelper(null)); // TODO: ^

	const map: HelperMap = {};
	for (const h of helpers) {
		map[h.name] = (...args: any[]) => h.execute.apply(h, args);
	}

	map.if_eq = ifEqualHelper;
	map.$powered_by = poweredByHelper;
	map.$json = jsonHelper;
	return map;
}

export interface PartialMap {
	[partialName: string]: HandlebarsTemplateDelegate;
}

export interface HelperMap {
	[helperName: string]: Handlebars.HelperDelegate;
}
