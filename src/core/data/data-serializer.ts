import { TemplateData } from '../model';

export class DataSerializer {

	public serialize(td: TemplateData): string {
		return JSON.stringify(td, null, 4);
	}

	public deserialize(str: string): TemplateData {
		const td = JSON.parse(str) as TemplateData;
		if (!td || !td.data || !td.meta || !td.meta.filePaths) {
			throw new Error('Cannot deserialize the template data.');
		}
		return td;
	}
}
