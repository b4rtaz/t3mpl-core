import { relativize } from '../../utils/path-utils';
import { concatUrl } from '../../utils/url-utils';

export class FileUrlBuilder {

	public constructor(
		private readonly currentPagePath: string,
		private readonly baseUrl?: string) {
	}

	public build(filePath: string): string {
		if (this.baseUrl) {
			return concatUrl(this.baseUrl, filePath);
		}
		return relativize(this.currentPagePath, filePath);
	}
}
