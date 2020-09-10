import * as moment from 'moment';

import { TemplateHelper } from '../template-helper';

export class DateTimeTemplateHelper implements TemplateHelper {
	public name = '$format_dt';

	public constructor(
		private readonly utcOffset?: number) {
	}

	public execute(dataTime: string, format?: string): string {
		if (!dataTime) {
			return '[NULL]';
		}
		let date = moment(dataTime);
		if (this.utcOffset) {
			date = date.utcOffset(this.utcOffset);
		}
		if (format && typeof(format) === 'string') {
			return date.format(format);
		}
		return date.toISOString(true);
	}
}
