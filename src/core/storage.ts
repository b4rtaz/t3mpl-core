
export interface ReadableStorage {
	has(contentType: ContentType | ContentType[], filePath: string): boolean;
	getContent(contentType: ContentType, filePath: string): string;
	getEntry(contentType: ContentType | ContentType[], filePath: string): FileEntry;
	getFilePaths(contentType: ContentType | ContentType[]): string[];
}

export interface WritableStorage extends ReadableStorage {
	setContent(contentType: ContentType, filePath: string, data: string): void;
}

export type ContentType = 'text' | 'dataUrl' | 'binary';

export interface FileEntry {
	contentType: ContentType;
	content: string;
}
