
export function tryGetArg(name: string): string {
	const v = process.argv.find(a => a.startsWith(name));
	return v ? v.substring(name.length) : null;
}

export function getArg(name: string): string {
	const v = tryGetArg(name);
	if (!v) {
		throw new Error(`The argument ${name} is required.`);
	}
	return v;
}
