/**
 * Walk Score API Service
 *
 * Provides walkability, transit, and bike scores for any address.
 * Useful for property assessments and service area analysis.
 *
 * @see https://www.walkscore.com/professional/api.php
 *
 * Requires API key from Walk Score (free tier available).
 * Get key at: https://www.walkscore.com/professional/api-sign-up.php
 */

const WALK_SCORE_BASE_URL = "https://api.walkscore.com";

export interface WalkScoreResult {
	walkScore: number;
	walkDescription: string;
	transitScore?: number;
	transitDescription?: string;
	bikeScore?: number;
	bikeDescription?: string;
	logoUrl: string;
	moreInfoLink: string;
}

export interface DetailedScore {
	score: number;
	description: string;
	summary: string;
}

export interface TransitDetails {
	score: number;
	description: string;
	summary: string;
	transitLines?: TransitLine[];
}

export interface TransitLine {
	name: string;
	type: string;
	distance: number;
}

export interface BikeDetails {
	score: number;
	description: string;
	bikeLaneNetwork?: number;
	hills?: string;
	roadConnectivity?: number;
	bikeCommunting?: number;
}

export interface LocationScores {
	address: string;
	lat: number;
	lng: number;
	walkScore: DetailedScore;
	transitScore?: TransitDetails;
	bikeScore?: BikeDetails;
	updated: string;
}

export interface PropertyAccessibility {
	address: string;
	overallAccessibility: "excellent" | "good" | "fair" | "poor";
	walkScore: number;
	transitScore?: number;
	bikeScore?: number;
	serviceImplications: string[];
	parkingLikely: boolean;
}

// Walk Score descriptions by range
const WALK_DESCRIPTIONS: Record<
	string,
	{ min: number; max: number; description: string; summary: string }
> = {
	walkers_paradise: {
		min: 90,
		max: 100,
		description: "Walker's Paradise",
		summary: "Daily errands do not require a car",
	},
	very_walkable: {
		min: 70,
		max: 89,
		description: "Very Walkable",
		summary: "Most errands can be accomplished on foot",
	},
	somewhat_walkable: {
		min: 50,
		max: 69,
		description: "Somewhat Walkable",
		summary: "Some errands can be accomplished on foot",
	},
	car_dependent_some: {
		min: 25,
		max: 49,
		description: "Car-Dependent",
		summary: "Most errands require a car",
	},
	car_dependent_all: {
		min: 0,
		max: 24,
		description: "Car-Dependent",
		summary: "Almost all errands require a car",
	},
};

const TRANSIT_DESCRIPTIONS: Record<
	string,
	{ min: number; max: number; description: string; summary: string }
> = {
	excellent: {
		min: 90,
		max: 100,
		description: "Excellent Transit",
		summary: "Convenient for most trips",
	},
	great: {
		min: 70,
		max: 89,
		description: "Excellent Transit",
		summary: "Many nearby public transportation options",
	},
	good: {
		min: 50,
		max: 69,
		description: "Good Transit",
		summary: "Many nearby public transportation options",
	},
	some: {
		min: 25,
		max: 49,
		description: "Some Transit",
		summary: "A few public transportation options",
	},
	minimal: {
		min: 0,
		max: 24,
		description: "Minimal Transit",
		summary: "Few or no public transportation options",
	},
};

const BIKE_DESCRIPTIONS: Record<
	string,
	{ min: number; max: number; description: string; summary: string }
> = {
	paradise: {
		min: 90,
		max: 100,
		description: "Biker's Paradise",
		summary: "Daily errands can be accomplished on a bike",
	},
	excellent: {
		min: 70,
		max: 89,
		description: "Very Bikeable",
		summary: "Biking is convenient for most trips",
	},
	bikeable: {
		min: 50,
		max: 69,
		description: "Bikeable",
		summary: "Some bike infrastructure",
	},
	minimal: {
		min: 0,
		max: 49,
		description: "Minimal Bike Infrastructure",
		summary: "Minimal bike infrastructure",
	},
};

class WalkScoreService {
	private apiKey: string;
	private baseUrl = WALK_SCORE_BASE_URL;

	constructor() {
		this.apiKey = process.env.WALK_SCORE_API_KEY || "";
	}

	/**
	 * Get Walk Score for an address
	 */
	async getWalkScore(
		address: string,
		lat?: number,
		lng?: number,
	): Promise<WalkScoreResult | null> {
		if (!this.apiKey) {
			console.error("Walk Score API key not configured");
			return null;
		}

		try {
			const url = new URL(`${this.baseUrl}/score`);
			url.searchParams.set("format", "json");
			url.searchParams.set("address", address);
			url.searchParams.set("wsapikey", this.apiKey);

			if (lat !== undefined && lng !== undefined) {
				url.searchParams.set("lat", lat.toString());
				url.searchParams.set("lon", lng.toString());
			}

			// Request transit and bike scores too
			url.searchParams.set("transit", "1");
			url.searchParams.set("bike", "1");

			const response = await fetch(url.toString());

			if (!response.ok) {
				throw new Error(`Walk Score API error: ${response.status}`);
			}

			const data = await response.json();

			if (data.status !== 1) {
				console.error("Walk Score API returned error status:", data.status);
				return null;
			}

			return {
				walkScore: data.walkscore || 0,
				walkDescription:
					data.description || this.getWalkDescription(data.walkscore || 0),
				transitScore: data.transit?.score,
				transitDescription: data.transit?.description,
				bikeScore: data.bike?.score,
				bikeDescription: data.bike?.description,
				logoUrl: data.logo_url || "https://cdn.walk.sc/images/api-logo.png",
				moreInfoLink:
					data.ws_link ||
					`https://www.walkscore.com/score/${encodeURIComponent(address)}`,
			};
		} catch (error) {
			console.error("Error fetching Walk Score:", error);
			return null;
		}
	}

	/**
	 * Get detailed scores for a location
	 */
	async getDetailedScores(
		address: string,
		lat?: number,
		lng?: number,
	): Promise<LocationScores | null> {
		const result = await this.getWalkScore(address, lat, lng);

		if (!result) {
			return null;
		}

		const walkDesc = this.getScoreDetails(result.walkScore, WALK_DESCRIPTIONS);
		const transitDesc =
			result.transitScore !== undefined
				? this.getScoreDetails(result.transitScore, TRANSIT_DESCRIPTIONS)
				: undefined;
		const bikeDesc =
			result.bikeScore !== undefined
				? this.getScoreDetails(result.bikeScore, BIKE_DESCRIPTIONS)
				: undefined;

		return {
			address,
			lat: lat || 0,
			lng: lng || 0,
			walkScore: {
				score: result.walkScore,
				description: walkDesc.description,
				summary: walkDesc.summary,
			},
			transitScore: transitDesc
				? {
						score: result.transitScore!,
						description: transitDesc.description,
						summary: transitDesc.summary,
					}
				: undefined,
			bikeScore: bikeDesc
				? {
						score: result.bikeScore!,
						description: bikeDesc.description,
						summary: bikeDesc.summary,
					}
				: undefined,
			updated: new Date().toISOString(),
		};
	}

	/**
	 * Get score description based on score value
	 */
	private getWalkDescription(score: number): string {
		const desc = this.getScoreDetails(score, WALK_DESCRIPTIONS);
		return desc.description;
	}

	/**
	 * Get description details for a score
	 */
	private getScoreDetails(
		score: number,
		descriptions: Record<
			string,
			{ min: number; max: number; description: string; summary: string }
		>,
	): { description: string; summary: string } {
		for (const key in descriptions) {
			const range = descriptions[key];
			if (score >= range.min && score <= range.max) {
				return { description: range.description, summary: range.summary };
			}
		}
		return { description: "Unknown", summary: "Score not available" };
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Analyze property accessibility for service calls
	 * Helps technicians prepare for parking and access challenges
	 */
	async analyzePropertyAccessibility(
		address: string,
		lat?: number,
		lng?: number,
	): Promise<PropertyAccessibility | null> {
		const scores = await this.getDetailedScores(address, lat, lng);

		if (!scores) {
			return null;
		}

		const implications: string[] = [];
		let overallAccessibility: PropertyAccessibility["overallAccessibility"];

		// High walk score = likely urban, potential parking issues
		if (scores.walkScore.score >= 90) {
			overallAccessibility = "excellent";
			implications.push("Urban/dense area - may have parking restrictions");
			implications.push("Consider metered parking or parking garage");
			implications.push("Customer may not have dedicated parking");
			implications.push("Good for foot traffic if local office nearby");
		} else if (scores.walkScore.score >= 70) {
			overallAccessibility = "good";
			implications.push("Mixed residential/commercial area");
			implications.push("Street parking usually available");
			implications.push("Check for permit parking zones");
		} else if (scores.walkScore.score >= 50) {
			overallAccessibility = "fair";
			implications.push("Suburban area - parking generally available");
			implications.push("May need longer travel times between jobs");
		} else {
			overallAccessibility = "poor";
			implications.push("Car-dependent area - parking readily available");
			implications.push("Driveways common, easy equipment access");
			implications.push("Plan for longer drive times");
		}

		// Transit implications
		if (scores.transitScore && scores.transitScore.score >= 70) {
			implications.push(
				"Good transit area - customer may not have car for equipment disposal",
			);
		}

		// Bike score implications (for some markets)
		if (scores.bikeScore && scores.bikeScore.score >= 70) {
			implications.push("Bike-friendly area - watch for cyclists near vehicle");
		}

		// Parking likelihood
		const parkingLikely = scores.walkScore.score < 70;

		return {
			address,
			overallAccessibility,
			walkScore: scores.walkScore.score,
			transitScore: scores.transitScore?.score,
			bikeScore: scores.bikeScore?.score,
			serviceImplications: implications,
			parkingLikely,
		};
	}

	/**
	 * Estimate travel difficulty based on area walkability
	 * Higher walk scores often mean more traffic, tighter streets
	 */
	async estimateTravelDifficulty(address: string): Promise<{
		difficulty: "easy" | "moderate" | "challenging";
		factors: string[];
		recommendations: string[];
	} | null> {
		const result = await this.getWalkScore(address);

		if (!result) {
			return null;
		}

		const factors: string[] = [];
		const recommendations: string[] = [];
		let difficulty: "easy" | "moderate" | "challenging";

		if (result.walkScore >= 85) {
			difficulty = "challenging";
			factors.push("High-density urban area");
			factors.push("Limited or expensive parking");
			factors.push("Narrow streets possible");
			factors.push("High pedestrian traffic");
			recommendations.push("Arrive early to find parking");
			recommendations.push("Use smaller service vehicle if possible");
			recommendations.push("Budget extra time for job completion");
			recommendations.push("Confirm building access procedures with customer");
		} else if (result.walkScore >= 60) {
			difficulty = "moderate";
			factors.push("Mixed-use neighborhood");
			factors.push("Street parking may require searching");
			recommendations.push("Check for parking restrictions before arrival");
			recommendations.push("Standard service vehicle appropriate");
		} else {
			difficulty = "easy";
			factors.push("Suburban/residential area");
			factors.push("Ample parking usually available");
			factors.push("Easy vehicle access");
			recommendations.push("Standard routing and timing appropriate");
		}

		if (result.transitScore && result.transitScore >= 70) {
			factors.push("Major transit hub nearby - watch for buses");
		}

		return {
			difficulty,
			factors,
			recommendations,
		};
	}

	/**
	 * Get neighborhood character for customer communication
	 * Helps set expectations for urban vs suburban service experience
	 */
	async getNeighborhoodCharacter(address: string): Promise<{
		type: "urban-core" | "urban" | "suburban" | "rural";
		description: string;
		typicalParkingAccess: string;
		equipmentAccessNotes: string;
	} | null> {
		const result = await this.getWalkScore(address);

		if (!result) {
			return null;
		}

		if (result.walkScore >= 90) {
			return {
				type: "urban-core",
				description: "Dense urban core - high walkability, excellent transit",
				typicalParkingAccess:
					"Street parking limited, may need garage or loading zone",
				equipmentAccessNotes:
					"Elevators/stairs for upper floors, coordinate with building management",
			};
		} else if (result.walkScore >= 70) {
			return {
				type: "urban",
				description: "Urban neighborhood - walkable with good transit access",
				typicalParkingAccess:
					"Street parking available but may be metered or time-limited",
				equipmentAccessNotes:
					"Mix of single-family and multi-family, verify access requirements",
			};
		} else if (result.walkScore >= 40) {
			return {
				type: "suburban",
				description:
					"Suburban area - car-dependent with some walkable amenities",
				typicalParkingAccess:
					"Driveways and ample street parking typically available",
				equipmentAccessNotes:
					"Standard residential access, garages and basements common",
			};
		} else {
			return {
				type: "rural",
				description:
					"Rural or low-density area - car required for all activities",
				typicalParkingAccess: "Driveways, large lots, no parking concerns",
				equipmentAccessNotes:
					"May have long driveways, outbuildings, well/septic systems",
			};
		}
	}

	/**
	 * Compare walkability across multiple service locations
	 * Useful for route optimization and territory planning
	 */
	async compareLocations(addresses: string[]): Promise<
		{
			address: string;
			walkScore: number;
			difficulty: "easy" | "moderate" | "challenging";
			parkingAvailability: "limited" | "moderate" | "ample";
		}[]
	> {
		const results = await Promise.all(
			addresses.map((addr) => this.getWalkScore(addr)),
		);

		return results
			.map((result, index) => {
				if (!result) {
					return null;
				}

				let difficulty: "easy" | "moderate" | "challenging";
				let parkingAvailability: "limited" | "moderate" | "ample";

				if (result.walkScore >= 85) {
					difficulty = "challenging";
					parkingAvailability = "limited";
				} else if (result.walkScore >= 60) {
					difficulty = "moderate";
					parkingAvailability = "moderate";
				} else {
					difficulty = "easy";
					parkingAvailability = "ample";
				}

				return {
					address: addresses[index],
					walkScore: result.walkScore,
					difficulty,
					parkingAvailability,
				};
			})
			.filter((r): r is NonNullable<typeof r> => r !== null);
	}

	/**
	 * Get parking recommendations for service call
	 */
	async getParkingRecommendations(address: string): Promise<{
		difficulty: "easy" | "moderate" | "hard";
		recommendations: string[];
		estimatedParkingTime: number; // minutes to find parking
		suggestCustomerConfirmation: boolean;
	} | null> {
		const result = await this.getWalkScore(address);

		if (!result) {
			return null;
		}

		const recommendations: string[] = [];
		let difficulty: "easy" | "moderate" | "hard";
		let estimatedParkingTime: number;
		let suggestCustomerConfirmation: boolean;

		if (result.walkScore >= 90) {
			difficulty = "hard";
			estimatedParkingTime = 10;
			suggestCustomerConfirmation = true;
			recommendations.push(
				"Contact customer about parking options before arrival",
			);
			recommendations.push(
				"Ask if there's a driveway, garage, or designated visitor parking",
			);
			recommendations.push(
				"Check for loading zones that allow temporary parking",
			);
			recommendations.push(
				"Consider using parking app (SpotHero, ParkMobile) if available",
			);
			recommendations.push("Budget 10-15 extra minutes for parking");
		} else if (result.walkScore >= 70) {
			difficulty = "moderate";
			estimatedParkingTime = 5;
			suggestCustomerConfirmation = true;
			recommendations.push(
				"Street parking usually available but may be metered",
			);
			recommendations.push("Check for permit parking restrictions");
			recommendations.push(
				"Ask customer about best parking spot when confirming appointment",
			);
		} else if (result.walkScore >= 50) {
			difficulty = "moderate";
			estimatedParkingTime = 2;
			suggestCustomerConfirmation = false;
			recommendations.push("Parking generally available");
			recommendations.push("Driveway or street parking should be accessible");
		} else {
			difficulty = "easy";
			estimatedParkingTime = 0;
			suggestCustomerConfirmation = false;
			recommendations.push(
				"Ample parking expected - driveways and wide streets",
			);
			recommendations.push("No special parking arrangements needed");
		}

		return {
			difficulty,
			recommendations,
			estimatedParkingTime,
			suggestCustomerConfirmation,
		};
	}
}

// Export singleton instance
export const walkScoreService = new WalkScoreService();
