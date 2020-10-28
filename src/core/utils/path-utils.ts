
export function getFileExt(filePath: string): string {
	const pos = filePath.lastIndexOf('.');
	if (pos >= 0) {
		return filePath.substring(pos);
	}
	return '';
}

export function getFilePathWithoutExt(filePath: string): string {
	const pos = filePath.lastIndexOf('.');
	if (pos >= 0) {
		return filePath.substring(0, pos);
	} else {
		return filePath;
	}
}

export function isTextFileExt(fileExt: string): boolean {
	return [
		'.txt', '.html', '.htm', '.css', '.js', '.json', '.yaml', '.xml', '.xsd', '.partial', '.md', '.h'
	].includes(fileExt.toLowerCase());
}

export function getBasePath(filePath: string): string {
	const pos = filePath.lastIndexOf('/');
	return pos > 0 ? filePath.substring(0, pos + 1) : '';
}

export function extendFileName(filePath: string, suffix: string): string {
	let path = getFilePathWithoutExt(filePath);
	path += '-' + suffix;
	path += getFileExt(filePath);
	return path;
}

export function replaceFileName(filePath: string, fileName: string): string {
	const basePath = getBasePath(filePath);
	const fileExt = getFileExt(filePath);
	return basePath + fileName + fileExt;
}

export function simplifyPath(filePath: string): string {
	let pos = filePath.lastIndexOf('?');
	if (pos < 0) {
		pos = filePath.lastIndexOf('#');
	}
	const path = pos > 0 ? filePath.substring(0, pos) : filePath;
	const inParts = path.split('/');
	const outParts = [];
	for (const part of inParts) {
		switch (part) {
			case '.':
				continue;
			case '..':
				if (outParts.length < 1) {
					throw new Error(`Invalid relative file path: ${path}`);
				}
				outParts.splice(-1, 1);
				break;
			default:
				outParts.push(part);
				break;
		}
	}
	return outParts.join('/');
}

export function relativize(targetFilePath: string, assetFilePath: string): string {
	const parts = targetFilePath.split('/');
	parts.splice(parts.length - 1, 1); // It removes current directory or file name.

	const base = parts.map(() => '../').join('');

	return (base + assetFilePath).replace(/\/\.\//g, '/');
}
