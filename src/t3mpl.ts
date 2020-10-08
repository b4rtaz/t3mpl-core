import { main } from './cli/main';

function isNode(): boolean {
	return typeof module !== 'undefined' && module.exports;
}

if (isNode()) {
	main();
}
