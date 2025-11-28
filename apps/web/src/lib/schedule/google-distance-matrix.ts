import type { Coordinates } from "./route-optimization";

export type DistanceMatrixResult = {
	durationSeconds: number;
	durationText: string;
	distanceMeters: number;
	distanceText: string;
};

export class GoogleDistanceMatrix {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async getDistance(
		origin: Coordinates,
		destination: Coordinates,
	): Promise<DistanceMatrixResult> {
		const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
		url.searchParams.set("origins", `${origin.lat},${origin.lng}`);
		url.searchParams.set("destinations", `${destination.lat},${destination.lng}`);
		url.searchParams.set("mode", "driving");
		url.searchParams.set("departure_time", "now");
		url.searchParams.set("key", this.apiKey);

		const res = await fetch(url.toString());
		if (!res.ok) {
			throw new Error(`Distance Matrix failed: ${res.status}`);
		}
		const data = await res.json();
		const element = data.rows?.[0]?.elements?.[0];
		if (!element || element.status !== "OK") {
			throw new Error("Distance Matrix returned no result");
		}

		return {
			durationSeconds: element.duration_in_traffic?.value ?? element.duration.value,
			durationText: element.duration_in_traffic?.text ?? element.duration.text,
			distanceMeters: element.distance.value,
			distanceText: element.distance.text,
		};
	}
}
