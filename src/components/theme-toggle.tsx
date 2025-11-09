"use client";

import { useState } from "react";

export function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const toggle = () => {
		const next = theme === 'light' ? 'dark' : 'light';
		setTheme(next);
		try {
			if (typeof document !== 'undefined') {
				document.documentElement.classList.toggle('dark', next === 'dark');
			}
		} catch (e) {
			// ignore
		}
	};
	return (
		<button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded">
			{theme === 'light' ? '🌞' : '🌙'}
		</button>
	);
}

export { HamburgerMenu } from "@/components/ui/base";