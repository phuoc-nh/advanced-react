export function getItem<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
		if (item) {
			return JSON.parse(item) as T;
		}
	} catch (error) {
		console.error(`Error parsing item from localStorage for key "${key}":`, error);
	}
	return null;
}	

export function setItem<T>(key: string, value: T): void {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error setting item in localStorage for key "${key}":`, error);
	}
}