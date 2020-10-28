import { getFileExt, getFilePathWithoutExt } from './utils/path-utils';

export class PagePath {

	public constructor(
		public readonly filePath: string,
		public readonly virutalFilePath: string) {
	}

	public static createAbsolute(filePath: string): PagePath {
		return new PagePath(filePath, filePath);
	}

	public static createDirectory(filePath: string): PagePath {
		const fileExt = getFileExt(filePath);
		if (fileExt !== '.html') {
			return PagePath.createAbsolute(filePath);
		}

		let virutalFilePath: string;
		if (filePath.endsWith('/index.html')) {
			virutalFilePath = filePath.substring(0, filePath.length - 'index.html'.length);
		} else if (filePath === 'index.html') {
			virutalFilePath = './';
		} else {
			const path = getFilePathWithoutExt(filePath);
			filePath = path + '/index.html';
			virutalFilePath = path + '/';
		}
		return new PagePath(filePath, virutalFilePath);
	}
}
