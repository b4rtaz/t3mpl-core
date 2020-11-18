
export function isRelativeUrl(url: string): boolean {
	if (!url) {
		return false;
	}
	return !(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url));
}

export function isDataUrl(data: string): boolean {
	return data.startsWith('data:');
}

export function concatUrl(baseUrl: string, path: string): string {
	let url = baseUrl;
	if (!url.endsWith('/')) {
		url += '/';
	}
	url += path;
	return url.replace(/\/\.\//g, '/');
}
