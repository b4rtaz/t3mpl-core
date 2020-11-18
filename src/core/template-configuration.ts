import { PagePathStrategy, TemplateConfiguration } from './model';

export function getDefaultConfiguration(): TemplateConfiguration {
	return {
		pagePathStrategy: PagePathStrategy.absolute,
		baseUrl: null
	};
}
