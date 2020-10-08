import * as process from 'process';

import { build } from './build';
import { version } from './version';

export function main() {
	switch (process.argv[2]) {
		case 'build':
			build();
			break;

		case 'version':
			version();
			break;

		default:
			console.error('This command is not supported.');
			break;
	}
}
