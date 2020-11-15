
export class PropertyReader {

	public static tryRead<T>(data: any, key: string, type: string, defaultValue: T) {
		const value = data[key];
		if (value !== undefined) {
			if (typeof value !== type) {
				throw new Error(`Invalid value for the key ${key}. Got ${typeof(value)}, expected ${type}.`);
			}
			return value;
		}
		return defaultValue;
	}

	public static readObject(data: any, key: string): any {
		const value = PropertyReader.tryRead(data, key, 'object', null);
		if (value === null) {
			throw new Error(`The property ${key} does not exist.`);
		}
		return value;
	}

	public static readString(data: any, key: string): string {
		const value = PropertyReader.tryReadString(data, key, null);
		if (!value) {
			throw new Error(`The property ${key} does not exist.`);
		}
		return value;
	}

	public static tryReadStringArray(data: any, key: string): string[] {
		const arr = PropertyReader.tryRead(data, key, 'object', null) as string[];
		if (arr !== null) {
			if (!Array.isArray(arr) || arr.find(i => typeof i !== 'string')) {
				throw new Error(`The property ${key} does not contain an array of strings.`);
			}
			return arr;
		}
	}

	public static tryReadString(data: any, key: string, defaultValue: string): string {
		return PropertyReader.tryRead(data, key, 'string', defaultValue);
	}

	public static tryReadBoolean(data: any, key: string, defaultValue: boolean): boolean {
		return PropertyReader.tryRead(data, key, 'boolean', defaultValue);
	}

	public static tryReadNumber(data: any, key: string, defaultValue: number): number {
		return PropertyReader.tryRead(data, key, 'number', defaultValue);
	}

	public static tryReadDate(data: any, key: string, defaultValue: number): Date {
		const value = PropertyReader.tryRead(data, key, 'object', defaultValue);
		if (value !== null && !(value instanceof Date)) {
			throw new Error(`The property ${key} does not contain a date.`);
		}
		return value;
	}
}
