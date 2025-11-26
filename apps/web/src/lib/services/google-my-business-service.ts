/**
 * Google My Business (Business Profile) API Service
 *
 * Manage business listings on Google Search and Maps.
 * Requires OAuth 2.0 with business.manage scope.
 *
 * Features:
 * - Business information management
 * - Hours of operation
 * - Posts and updates
 * - Reviews management
 * - Photos and media
 * - Insights and analytics
 *
 * @see https://developers.google.com/my-business/reference/rest
 */

// Types
export interface Account {
	name: string;
	accountName: string;
	type: "PERSONAL" | "LOCATION_GROUP" | "USER_GROUP" | "ORGANIZATION";
	verificationState?:
		| "VERIFICATION_STATE_UNSPECIFIED"
		| "VERIFIED"
		| "UNVERIFIED"
		| "VERIFICATION_REQUESTED";
	vettedState?:
		| "VETTED_STATE_UNSPECIFIED"
		| "NOT_VETTED"
		| "VETTED"
		| "INVALID";
	accountNumber?: string;
	permissionLevel?:
		| "PERMISSION_LEVEL_UNSPECIFIED"
		| "OWNER_LEVEL"
		| "MEMBER_LEVEL";
	role?:
		| "ACCOUNT_ROLE_UNSPECIFIED"
		| "PRIMARY_OWNER"
		| "OWNER"
		| "MANAGER"
		| "SITE_MANAGER";
}

export interface Location {
	name: string;
	title: string;
	storefrontAddress?: PostalAddress;
	phoneNumbers?: PhoneNumbers;
	websiteUri?: string;
	regularHours?: BusinessHours;
	specialHours?: SpecialHours;
	serviceArea?: ServiceArea;
	labels?: string[];
	adWordsLocationExtensions?: {
		adPhone?: string;
	};
	latlng?: {
		latitude: number;
		longitude: number;
	};
	openInfo?: {
		status:
			| "OPEN_FOR_BUSINESS_UNSPECIFIED"
			| "OPEN"
			| "CLOSED_PERMANENTLY"
			| "CLOSED_TEMPORARILY";
		canReopen?: boolean;
		openingDate?: Date;
	};
	profile?: {
		description?: string;
	};
	relationshipData?: {
		parentChain?: string;
		childrenLocations?: string[];
	};
	moreHours?: MoreHours[];
	serviceItems?: ServiceItem[];
}

export interface PostalAddress {
	regionCode: string;
	postalCode?: string;
	administrativeArea?: string;
	locality?: string;
	addressLines: string[];
}

export interface PhoneNumbers {
	primaryPhone?: string;
	additionalPhones?: string[];
}

export interface BusinessHours {
	periods: TimePeriod[];
}

export interface TimePeriod {
	openDay: DayOfWeek;
	openTime: TimeOfDay;
	closeDay: DayOfWeek;
	closeTime: TimeOfDay;
}

export type DayOfWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export interface TimeOfDay {
	hours: number;
	minutes: number;
	seconds?: number;
	nanos?: number;
}

export interface SpecialHours {
	specialHourPeriods: SpecialHourPeriod[];
}

export interface SpecialHourPeriod {
	startDate: Date;
	openTime?: TimeOfDay;
	endDate?: Date;
	closeTime?: TimeOfDay;
	closed?: boolean;
}

export interface Date {
	year: number;
	month: number;
	day: number;
}

export interface ServiceArea {
	businessType:
		| "BUSINESS_TYPE_UNSPECIFIED"
		| "CUSTOMER_LOCATION_ONLY"
		| "CUSTOMER_AND_BUSINESS_LOCATION";
	places?: { placeInfos: { placeName: string; placeId: string }[] };
	regionCode?: string;
}

export interface MoreHours {
	hoursTypeId: string;
	periods: TimePeriod[];
}

export interface ServiceItem {
	structuredServiceItem?: {
		serviceTypeId: string;
		description?: string;
	};
	freeFormServiceItem?: {
		category: string;
		label: string;
	};
	price?: Money;
}

export interface Money {
	currencyCode: string;
	units?: string;
	nanos?: number;
}

export interface Review {
	name: string;
	reviewId: string;
	reviewer: {
		profilePhotoUrl?: string;
		displayName?: string;
		isAnonymous?: boolean;
	};
	starRating:
		| "STAR_RATING_UNSPECIFIED"
		| "ONE"
		| "TWO"
		| "THREE"
		| "FOUR"
		| "FIVE";
	comment?: string;
	createTime: string;
	updateTime: string;
	reviewReply?: {
		comment: string;
		updateTime: string;
	};
}

export interface LocalPost {
	name?: string;
	languageCode: string;
	summary: string;
	callToAction?: {
		actionType:
			| "ACTION_TYPE_UNSPECIFIED"
			| "BOOK"
			| "ORDER"
			| "SHOP"
			| "LEARN_MORE"
			| "SIGN_UP"
			| "CALL";
		url?: string;
	};
	media?: LocalPostMedia[];
	topicType?:
		| "LOCAL_POST_TOPIC_TYPE_UNSPECIFIED"
		| "STANDARD"
		| "EVENT"
		| "OFFER"
		| "ALERT";
	alertType?: "ALERT_TYPE_UNSPECIFIED" | "COVID_19";
	event?: {
		title: string;
		schedule: {
			startDate: Date;
			startTime?: TimeOfDay;
			endDate: Date;
			endTime?: TimeOfDay;
		};
	};
	offer?: {
		couponCode?: string;
		redeemOnlineUrl?: string;
		termsConditions?: string;
	};
	createTime?: string;
	updateTime?: string;
	state?: "LOCAL_POST_STATE_UNSPECIFIED" | "REJECTED" | "LIVE" | "PROCESSING";
}

export interface LocalPostMedia {
	mediaFormat: "MEDIA_FORMAT_UNSPECIFIED" | "PHOTO" | "VIDEO";
	sourceUrl: string;
}

export interface MediaItem {
	name: string;
	mediaFormat: "MEDIA_FORMAT_UNSPECIFIED" | "PHOTO" | "VIDEO";
	sourceUrl: string;
	dataRef?: {
		resourceName: string;
	};
	locationAssociation?: {
		category?:
			| "CATEGORY_UNSPECIFIED"
			| "COVER"
			| "PROFILE"
			| "LOGO"
			| "EXTERIOR"
			| "INTERIOR"
			| "PRODUCT"
			| "AT_WORK"
			| "FOOD_AND_DRINK"
			| "MENU"
			| "COMMON_AREA"
			| "ROOMS"
			| "TEAMS"
			| "ADDITIONAL";
		priceListItemId?: string;
	};
	createTime?: string;
	dimensions?: { widthPixels: number; heightPixels: number };
	thumbnailUrl?: string;
}

export interface Insights {
	locationMetrics?: LocationMetrics;
}

export interface LocationMetrics {
	timeZone: string;
	metricValues: MetricValue[];
}

export interface MetricValue {
	metric: string;
	dimensionalValues?: DimensionalMetricValue[];
	totalValue?: {
		metricOption?: string;
		timeDimension?: {
			dayOfWeek?: DayOfWeek;
			timeOfDay?: TimeOfDay;
			timeRange?: { startTime: string; endTime: string };
		};
		value?: number;
	};
}

export interface DimensionalMetricValue {
	metricOption?: string;
	timeDimension?: { dayOfWeek?: DayOfWeek };
	value?: number;
}

// Service implementation
class GoogleMyBusinessService {
	private readonly accountsUrl =
		"https://mybusinessaccountmanagement.googleapis.com/v1";
	private readonly businessInfoUrl =
		"https://mybusinessbusinessinformation.googleapis.com/v1";

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return true; // Requires OAuth at runtime
	}

	/**
	 * List accounts
	 */
	async listAccounts(accessToken: string): Promise<Account[] | null> {
		try {
			const response = await fetch(`${this.accountsUrl}/accounts`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("MyBusiness list accounts error:", await response.text());
				return null;
			}

			const data = await response.json();
			return data.accounts || [];
		} catch (error) {
			console.error("MyBusiness list accounts error:", error);
			return null;
		}
	}

	/**
	 * Get location details
	 */
	async getLocation(
		accessToken: string,
		locationName: string,
	): Promise<Location | null> {
		try {
			const response = await fetch(
				`${this.businessInfoUrl}/${locationName}?readMask=*`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("MyBusiness get location error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("MyBusiness get location error:", error);
			return null;
		}
	}

	/**
	 * Update location information
	 */
	async updateLocation(
		accessToken: string,
		locationName: string,
		location: Partial<Location>,
		updateMask: string,
	): Promise<Location | null> {
		try {
			const response = await fetch(
				`${this.businessInfoUrl}/${locationName}?updateMask=${updateMask}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(location),
				},
			);

			if (!response.ok) {
				console.error(
					"MyBusiness update location error:",
					await response.text(),
				);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("MyBusiness update location error:", error);
			return null;
		}
	}

	/**
	 * List reviews for a location
	 */
	async listReviews(
		accessToken: string,
		accountName: string,
		locationName: string,
		pageSize = 50,
	): Promise<{ reviews: Review[]; nextPageToken?: string } | null> {
		try {
			const url = `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews?pageSize=${pageSize}`;
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error("MyBusiness list reviews error:", await response.text());
				return null;
			}

			const data = await response.json();
			return {
				reviews: data.reviews || [],
				nextPageToken: data.nextPageToken,
			};
		} catch (error) {
			console.error("MyBusiness list reviews error:", error);
			return null;
		}
	}

	/**
	 * Reply to a review
	 */
	async replyToReview(
		accessToken: string,
		reviewName: string,
		replyText: string,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ comment: replyText }),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("MyBusiness reply to review error:", error);
			return false;
		}
	}

	/**
	 * Create a local post
	 */
	async createPost(
		accessToken: string,
		locationName: string,
		post: LocalPost,
	): Promise<LocalPost | null> {
		try {
			const response = await fetch(
				`https://mybusiness.googleapis.com/v4/${locationName}/localPosts`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(post),
				},
			);

			if (!response.ok) {
				console.error("MyBusiness create post error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("MyBusiness create post error:", error);
			return null;
		}
	}

	/**
	 * List local posts
	 */
	async listPosts(
		accessToken: string,
		locationName: string,
		pageSize = 10,
	): Promise<{ posts: LocalPost[]; nextPageToken?: string } | null> {
		try {
			const response = await fetch(
				`https://mybusiness.googleapis.com/v4/${locationName}/localPosts?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("MyBusiness list posts error:", await response.text());
				return null;
			}

			const data = await response.json();
			return {
				posts: data.localPosts || [],
				nextPageToken: data.nextPageToken,
			};
		} catch (error) {
			console.error("MyBusiness list posts error:", error);
			return null;
		}
	}

	/**
	 * Delete a local post
	 */
	async deletePost(accessToken: string, postName: string): Promise<boolean> {
		try {
			const response = await fetch(
				`https://mybusiness.googleapis.com/v4/${postName}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("MyBusiness delete post error:", error);
			return false;
		}
	}

	/**
	 * Upload media
	 */
	async uploadMedia(
		accessToken: string,
		locationName: string,
		mediaUrl: string,
		category: string,
	): Promise<MediaItem | null> {
		try {
			const response = await fetch(
				`https://mybusiness.googleapis.com/v4/${locationName}/media`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						mediaFormat: "PHOTO",
						sourceUrl: mediaUrl,
						locationAssociation: { category },
					}),
				},
			);

			if (!response.ok) {
				console.error("MyBusiness upload media error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("MyBusiness upload media error:", error);
			return null;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Update business hours
	 */
	async updateBusinessHours(
		accessToken: string,
		locationName: string,
		hours: { day: DayOfWeek; open: string; close: string }[],
	): Promise<boolean> {
		const periods: TimePeriod[] = hours.map((h) => {
			const [openHours, openMinutes] = h.open.split(":").map(Number);
			const [closeHours, closeMinutes] = h.close.split(":").map(Number);

			return {
				openDay: h.day,
				openTime: { hours: openHours, minutes: openMinutes },
				closeDay: h.day,
				closeTime: { hours: closeHours, minutes: closeMinutes },
			};
		});

		const result = await this.updateLocation(
			accessToken,
			locationName,
			{ regularHours: { periods } },
			"regularHours",
		);

		return result !== null;
	}

	/**
	 * Add special hours (holiday, etc.)
	 */
	async addSpecialHours(
		accessToken: string,
		locationName: string,
		specialDay: { date: Date; closed?: boolean; open?: string; close?: string },
	): Promise<boolean> {
		const period: SpecialHourPeriod = {
			startDate: specialDay.date,
			closed: specialDay.closed,
		};

		if (!specialDay.closed && specialDay.open && specialDay.close) {
			const [openHours, openMinutes] = specialDay.open.split(":").map(Number);
			const [closeHours, closeMinutes] = specialDay.close
				.split(":")
				.map(Number);

			period.openTime = { hours: openHours, minutes: openMinutes };
			period.endDate = specialDay.date;
			period.closeTime = { hours: closeHours, minutes: closeMinutes };
		}

		const result = await this.updateLocation(
			accessToken,
			locationName,
			{ specialHours: { specialHourPeriods: [period] } },
			"specialHours",
		);

		return result !== null;
	}

	/**
	 * Post a service update
	 */
	async postServiceUpdate(
		accessToken: string,
		locationName: string,
		update: {
			title: string;
			summary: string;
			callToActionUrl?: string;
			imageUrl?: string;
		},
	): Promise<LocalPost | null> {
		const post: LocalPost = {
			languageCode: "en-US",
			summary: `${update.title}\n\n${update.summary}`,
			topicType: "STANDARD",
		};

		if (update.callToActionUrl) {
			post.callToAction = {
				actionType: "LEARN_MORE",
				url: update.callToActionUrl,
			};
		}

		if (update.imageUrl) {
			post.media = [
				{
					mediaFormat: "PHOTO",
					sourceUrl: update.imageUrl,
				},
			];
		}

		return this.createPost(accessToken, locationName, post);
	}

	/**
	 * Post a promotion/offer
	 */
	async postOffer(
		accessToken: string,
		locationName: string,
		offer: {
			title: string;
			description: string;
			couponCode?: string;
			redeemUrl?: string;
			terms?: string;
			startDate: Date;
			endDate: Date;
			imageUrl?: string;
		},
	): Promise<LocalPost | null> {
		const post: LocalPost = {
			languageCode: "en-US",
			summary: `${offer.title}\n\n${offer.description}`,
			topicType: "OFFER",
			event: {
				title: offer.title,
				schedule: {
					startDate: offer.startDate,
					endDate: offer.endDate,
				},
			},
			offer: {
				couponCode: offer.couponCode,
				redeemOnlineUrl: offer.redeemUrl,
				termsConditions: offer.terms,
			},
		};

		if (offer.imageUrl) {
			post.media = [
				{
					mediaFormat: "PHOTO",
					sourceUrl: offer.imageUrl,
				},
			];
		}

		return this.createPost(accessToken, locationName, post);
	}

	/**
	 * Get review summary
	 */
	async getReviewSummary(
		accessToken: string,
		accountName: string,
		locationName: string,
	): Promise<{
		averageRating: number;
		totalReviews: number;
		ratingDistribution: Record<string, number>;
		recentReviews: Review[];
	} | null> {
		const result = await this.listReviews(
			accessToken,
			accountName,
			locationName,
			100,
		);
		if (!result) return null;

		const reviews = result.reviews;
		const ratingDistribution: Record<string, number> = {
			FIVE: 0,
			FOUR: 0,
			THREE: 0,
			TWO: 0,
			ONE: 0,
		};

		let totalRating = 0;
		const ratingValues: Record<string, number> = {
			FIVE: 5,
			FOUR: 4,
			THREE: 3,
			TWO: 2,
			ONE: 1,
		};

		for (const review of reviews) {
			const rating = review.starRating;
			if (rating in ratingDistribution) {
				ratingDistribution[rating]++;
				totalRating += ratingValues[rating] || 0;
			}
		}

		return {
			averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
			totalReviews: reviews.length,
			ratingDistribution,
			recentReviews: reviews.slice(0, 5),
		};
	}

	/**
	 * Generate review response
	 */
	generateReviewResponse(review: Review, companyName: string): string {
		const rating = review.starRating;
		const customerName = review.reviewer.displayName || "Valued Customer";

		if (rating === "FIVE" || rating === "FOUR") {
			return `Thank you so much for your wonderful review, ${customerName}! We're thrilled that you had a great experience with ${companyName}. We appreciate your business and look forward to serving you again!`;
		} else if (rating === "THREE") {
			return `Thank you for your feedback, ${customerName}. We're always working to improve our service at ${companyName}. If there's anything specific we can do better, please don't hesitate to reach out to us directly. We value your business!`;
		} else {
			return `We're sorry to hear about your experience, ${customerName}. At ${companyName}, customer satisfaction is our top priority. Please contact us directly so we can make things right. We appreciate you bringing this to our attention.`;
		}
	}
}

// Export singleton instance
export const googleMyBusinessService = new GoogleMyBusinessService();
