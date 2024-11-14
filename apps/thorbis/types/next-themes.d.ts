declare module "next-themes" {
	export interface ThemeProviderProps {
		attribute?: string;
		defaultTheme?: string;
		enableSystem?: boolean;
		disableTransitionOnChange?: boolean;
		children?: React.ReactNode;
		[key: string]: unknown;
	}

	export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}

declare module "next-themes/dist/types" {
	export interface ThemeProviderProps {
		attribute?: string;
		defaultTheme?: string;
		enableSystem?: boolean;
		disableTransitionOnChange?: boolean;
		children?: React.ReactNode;
		[key: string]: unknown;
	}
}
