
export interface TemplateHelper {
	name: string;
	execute(...args: string[]): string;
}
