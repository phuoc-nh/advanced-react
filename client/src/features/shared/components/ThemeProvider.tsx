import { getItem, setItem } from "@/lib/utils/localStorage";
import { createContext, use, useEffect, useState } from "react";

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeProviderState | undefined>({
	theme: 'system',
	setTheme: () => {
		// Default implementation does nothing
	}
});

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'advanced-react-theme'
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		getItem<Theme>(storageKey) || defaultTheme
	);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			root.classList.add(systemTheme);
			setItem(storageKey, systemTheme);
			return;
		}

		root.classList.add(theme);
		setItem(storageKey, theme);
	}, [theme, storageKey]);

	return (
		<ThemeContext value={{ theme, setTheme }}>
			{children}
		</ThemeContext>
	);
}

export const useTheme = () => {
	const context = use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}