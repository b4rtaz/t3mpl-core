
export function generateUniqueId(length: number): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let id = '';
	for (let i = 0; i < length; i++) {
		id += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
	}
	return id;
}
