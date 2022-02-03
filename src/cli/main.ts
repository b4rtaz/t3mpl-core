import * as process from 'process';

import { handleBuildCommand } from './commands/build-command';
import { handleVersionCommand } from './commands/version-command';

export function main() {
	switch (process.argv[2]) {
		case 'build':
			handleBuildCommand();
			break;

		case 'version':
			handleVersionCommand();
			break;

		default:
			console.error('This command is not supported');
			break;
	}
}
