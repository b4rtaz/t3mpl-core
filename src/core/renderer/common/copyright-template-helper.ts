import { formatDate } from '../../utils/date-utils';
import { TemplateHelper } from '../template-helper';

export class CopyrightTemplateHelper implements TemplateHelper {
	public name = '$copyright';

	public constructor(
		private readonly timezone?: string) {
	}

	public execute(): string {
		const now = new Date();
		const year = formatDate(now, 'YYYY', this.timezone);
		return `<script>document.write('&copy;' + (new Date()).getFullYear());</script><noscript>&copy;${year}</noscript>`;
	}
}
