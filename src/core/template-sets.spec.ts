import { getChoiceValuesSet, getTextValueSet } from './template-sets';

describe('TemplateSets', () => {

	it('(iso6391Languages) choice set contains popular languages', () => {
		const values = getChoiceValuesSet('(iso6391Languages)');
		const keys = Object.keys(values);

		const popularLangs = ['en', 'pl', 'ar', 'de', 'es', 'fr', 'hi', 'zh', 'ru'];
		popularLangs.forEach(lang => expect(keys).toContain(lang));
	});

	it('(direction) choice set contains known values', () => {
		const values = getChoiceValuesSet('(direction)');
		const keys = Object.keys(values);

		const knownValues = ['ltr', 'rtl', 'auto'];
		knownValues.forEach(value => expect(keys).toContain(value));
	});

	it('getChoiceValuesSet() throws error when set is unknown', () => {
		expect(() => getChoiceValuesSet('(uknonw)'))
			.toThrowMatching((e: Error) => e.message.endsWith('is not supported.'));
	});

	it('getTextValueSet() returns a trimmed string', () => {
		const setNames = ['(lipsumXS)', '(lipsumS)', '(lipsumM)', '(lipsumL)', '(lipsumXL)', '(lipsumXXL)'];

		setNames.forEach(name => {
			const value = getTextValueSet(name);
			expect(value).toMatch(/^[^\s].*[^\s]$/);
		});
	});

	it('getTextValueSet() throws error when set is unknown', () => {
		expect(() => getTextValueSet('(uknonw)'))
			.toThrowMatching((e: Error) => e.message.endsWith('is not supported.'));
	});
});
