import { create } from "zustand";
import type {
	WeatherData,
	WeatherPeriod,
} from "@/lib/services/weather-service";

type WeatherState = {
	// Data
	weather: WeatherData | null;
	isLoading: boolean;
	error: string | null;
	lastFetch: Date | null;

	// Actions
	setWeather: (weather: WeatherData | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchWeather: () => Promise<void>;
	clearWeather: () => void;

	// Helpers
	getCurrentConditions: () => WeatherPeriod | null;
	getForecastForDate: (date: Date) => WeatherPeriod | null;
	getHourlyForecast: (hour: number) => WeatherPeriod | null;
	hasActiveAlerts: () => boolean;
	getSevereAlerts: () => WeatherData["alerts"];
};

export const useWeatherStore = create<WeatherState>()((set, get) => ({
	// Initial state
	weather: null,
	isLoading: false,
	error: null,
	lastFetch: null,

	// Actions
	setWeather: (weather) => set({ weather, lastFetch: new Date(), error: null }),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),

	fetchWeather: async () => {
		const state = get();

		// Don't refetch if we have data less than 10 minutes old
		if (
			state.weather &&
			state.lastFetch &&
			Date.now() - state.lastFetch.getTime() < 10 * 60 * 1000
		) {
			return;
		}

		set({ isLoading: true, error: null });

		try {
			const response = await fetch("/api/weather");
			if (!response.ok) {
				throw new Error("Failed to fetch weather");
			}
			const data = await response.json();
			set({ weather: data, lastFetch: new Date(), isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Failed to fetch weather",
				isLoading: false,
			});
		}
	},

	clearWeather: () =>
		set({ weather: null, lastFetch: null, error: null, isLoading: false }),

	// Helpers
	getCurrentConditions: () => {
		const { weather } = get();
		if (!weather?.hourly?.periods?.[0]) return null;
		return weather.hourly.periods[0];
	},

	getForecastForDate: (date: Date) => {
		const { weather } = get();
		if (!weather?.forecast?.periods) return null;

		const targetDay = date.toLocaleDateString("en-US", { weekday: "long" });
		const isNight = date.getHours() >= 18 || date.getHours() < 6;

		// Find the period that matches the target day
		return (
			weather.forecast.periods.find((period) => {
				const periodName = period.name.toLowerCase();
				const matchesDay = periodName.includes(targetDay.toLowerCase());
				const matchesTimeOfDay = isNight
					? periodName.includes("night") || periodName.includes("evening")
					: !periodName.includes("night") && !periodName.includes("evening");
				return matchesDay && matchesTimeOfDay;
			}) || weather.forecast.periods[0]
		);
	},

	getHourlyForecast: (hour: number) => {
		const { weather } = get();
		if (!weather?.hourly?.periods) return null;

		const now = new Date();
		const targetTime = new Date(now);
		targetTime.setHours(hour, 0, 0, 0);

		// Find the hourly period closest to the target hour
		return (
			weather.hourly.periods.find((period) => {
				const periodStart = new Date(period.startTime);
				return (
					periodStart.getHours() === hour &&
					periodStart.toDateString() === now.toDateString()
				);
			}) || null
		);
	},

	hasActiveAlerts: () => {
		const { weather } = get();
		return weather?.hasActiveAlerts ?? false;
	},

	getSevereAlerts: () => {
		const { weather } = get();
		if (!weather?.alerts) return [];
		return weather.alerts.filter(
			(alert) => alert.severity === "Extreme" || alert.severity === "Severe"
		);
	},
}));
