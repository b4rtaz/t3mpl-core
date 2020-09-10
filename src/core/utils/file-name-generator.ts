
export function generateFileName(s: GenerateFilePathSettings): string {
	if (!s.uniqueIdGenerator) {
		s.uniqueIdGenerator = generateUniqueId;
	}
	if (!s.fileNameLength) {
		s.fileNameLength = 24;
	}
	if (!s.minUniqueIdLength) {
		s.minUniqueIdLength = s.fileNameLength / 2;
	}

	let fileName = '';
	let uniqueIdLength: number;
	if (s.name) {
		const name = s.name.replace(/\s+/, '-');
		const max = s.fileNameLength - s.fileExt.length - s.minUniqueIdLength - 1;
		if (name.length > max) {
			fileName += name.substring(0, max);
			uniqueIdLength = s.minUniqueIdLength;
		} else {
			fileName += name;
			uniqueIdLength = s.minUniqueIdLength + max - name.length;
		}
		fileName += '-';
	} else {
		uniqueIdLength = s.fileNameLength - s.fileExt.length;
	}

	fileName += s.uniqueIdGenerator(uniqueIdLength);
	fileName += s.fileExt;
	return fileName.toLowerCase();
}

export interface GenerateFilePathSettings {
	name?: string;
	fileExt: string;
	fileNameLength?: number;
	minUniqueIdLength?: number;
	uniqueIdGenerator?: (length: number) => string;
}

export function generateUniqueId(length: number): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let id = '';
	for (let i = 0; i < length; i++) {
		id += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
	}
	return id;
}
