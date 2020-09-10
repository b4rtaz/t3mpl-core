import * as moment from 'moment';

import { TemplateHelper } from '../template-helper';

export class CopyrightTemplateHelper implements TemplateHelper {
	public name = '$copyright';

	public constructor(
		private readonly utcOffset?: number) {
	}

	public execute(): string {
		let now = moment();
		if (this.utcOffset) {
			now = now.zone(this.utcOffset);
		}
		const year = now.get('year');
		return `<script>document.write('&copy;' + (new Date()).getFullYear());</script><noscript>&copy;${year}</noscript>`;
	}
}
