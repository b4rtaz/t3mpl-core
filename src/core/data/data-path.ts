
export class DataPath {

	public static parse(dataPath: string): DataPath {
		if (!dataPath) {
			throw new Error('Path is empty.');
		}
		if (typeof(dataPath) !== 'string') {
			throw new Error(`Path must be a string. Got ${typeof(dataPath)}.`);
		}

		const path = [];
		dataPath.split('.').forEach(key => {
			const braketPos1 = key.indexOf('[');
			const braketPos2 = key.indexOf(']');
			if (braketPos1 >= 0 && braketPos2 > braketPos1) {
				path.push(key.substring(0, braketPos1));
				path.push(parseInt(key.substring(braketPos1 + 1, braketPos2), 10));
			} else {
				path.push(key);
			}
		});
		return new DataPath(path);
	}

	//

	private constructor(
		private readonly pathParts: string[]) {
	}

	public set(data: any, value: any) {
		this.find(data, this.pathParts, (node, key) => {
			node[key] = value;
		});
	}

	public get(data: any): any {
		let value = null;
		this.find(data, this.pathParts, (node, key) => {
			value = node[key];
		});
		return value;
	}

	public unshiftItem(data: any, value: any) {
		this.find(data, this.pathParts, (node: any[], key) => {
			node[key].unshift(value);
		});
	}

	public removeItem(data: any, index: number) {
		this.find(data, this.pathParts, (node: { [name: string]: any[]}, key) => {
			node[key].splice(index, 1);
		});
	}

	public moveItem(data: any, oldIndex: number, newIndex: number) {
		this.find(data, this.pathParts, (node: { [name: string]: any[]}, key) => {
			const array = node[key];
			const copy = array[newIndex];
			array[newIndex] = array[oldIndex];
			array[oldIndex] = copy;
		});
	}

	private find(node: any, pathParts: string[], found: FoundHandler) {
		try {
			this._find(node, pathParts, found);
		} catch (e) {
			if (e instanceof FindError) {
				throw new FindError(`${e.message} (${pathParts.join('.')})`);
			} else {
				throw e;
			}
		}
	}

	private _find(node: any, pathParts: string[], found: FoundHandler) {
		const key = pathParts[0];

		if (typeof key === 'string') {
			if (!Object.keys(node).includes(key)) {
				throw new FindError('Cannot find the path: ' + pathParts.join('.'));
			}
		} else if (typeof key === 'number') {
			if (!Array.isArray(node)) {
				throw new FindError('Invalid path. Node is not array.');
			}
			if ((node as any[]).length <= key) {
				throw new FindError('Invalid array index: ' + key);
			}
		}

		if (pathParts.length === 1) {
			found(node, key);
		} else {
			this._find(node[key], pathParts.slice(1), found);
		}
	}
}

type FoundHandler = (node: any, key: string) => void;

class FindError extends Error {
}
