import { ContentType, FileEntry, ReadableStorage, WritableStorage } from './storage';

export class MemoryStorage implements ReadableStorage, WritableStorage {

	private readonly entries: FileEntryMap = {};

	public setContent(contentType: ContentType, filePath: string, data: string) {
		const current = this.entries[filePath];
		if (current && current.contentType !== contentType) {
			throw new Error(`Previous file has diffrent content type: ${current.contentType}.`);
		}
		this.entries[filePath] = {
			contentType,
			content: data
		};
	}

	public has(contentType: ContentType | ContentType[], filePath: string): boolean {
		return !!this.tryGet(contentType, filePath);
	}

	public getContent(contentType: ContentType, filePath: string): string {
		const entry = this.tryGet(contentType, filePath);
		if (!entry) {
			throw new Error(`Cannot find the file ${filePath}.`);
		}
		return entry.content;
	}

	public getEntry(contentType: ContentType | ContentType[], filePath: string): FileEntry {
		const entry = this.tryGet(contentType, filePath);
		if (!entry) {
			throw new Error(`Cannot find the file ${filePath}.`);
		}
		return entry;
	}

	private tryGet(contentType: ContentType | ContentType[], filePath: string): FileEntry {
		const entry = this.entries[filePath];
		if (!entry) {
			return null;
		}
		const ok = Array.isArray(contentType)
			? contentType.includes(entry.contentType)
			: contentType === entry.contentType;
		if (!ok) {
			return null;
		}
		return entry;
	}

	public getFilePaths(contentType: ContentType | ContentType[]): string[] {
		if (Array.isArray(contentType)) {
			return Object.keys(this.entries)
				.filter(p => contentType.includes(this.entries[p].contentType));
		} else {
			return Object.keys(this.entries)
				.filter(p => this.entries[p].contentType === contentType);
		}
	}
}

interface FileEntryMap {
	[filePath: string]: FileEntry;
}
