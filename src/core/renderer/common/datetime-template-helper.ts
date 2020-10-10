import { formatDate } from '../../utils/date-utils';
import { TemplateHelper } from '../template-helper';

export class DateTimeTemplateHelper implements TemplateHelper {
	public name = '$format_dt';

	public constructor(
		private readonly timezone?: string) {
	}

	public execute(dataTime: string, format?: string): string {
		if (!dataTime) {
			return '[NULL]';
		}
		if (format && typeof(format) === 'string') {
			return formatDate(dataTime, format, this.timezone);
		}
		return dataTime;
	}
}
