import * as fs from 'fs';
import * as path from 'path';

export function handleVersionCommand() {
	const baseDir = path.dirname(require.main.filename);
	const filePath = baseDir.endsWith('bin')
		? '/../package.json'
		: '/package.json';

	const raw = fs.readFileSync(baseDir + filePath, 'utf8');
	const json = JSON.parse(raw);
	console.log(json['name']);
	console.log(json['version']);
}
