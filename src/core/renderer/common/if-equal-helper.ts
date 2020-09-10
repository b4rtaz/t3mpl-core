import * as Handlebars from 'handlebars';

export function ifEqualHelper(a: any, b: any, o: Handlebars.HelperOptions) {
	if (a === b) {
		return o.fn(this);
	} else {
		return o.inverse(this);
	}
}
