/**
 * Google Services Index
 *
 * Central export file for all Google API services.
 * All services use unified GOOGLE_API_KEY environment variable.
 *
 * Services included:
 *
 * LOCATION & MAPPING:
 * - Address Validation - Verify and standardize addresses
 * - Places - Search nearby places, autocomplete addresses
 * - Distance Matrix - Calculate travel times and distances
 * - Geolocation - Device location via WiFi/cell/IP
 * - Street View - Property imagery
 * - Routes - Directions and navigation
 * - Geocoding - Address to coordinates conversion
 * - Time Zone - Timezone lookup and conversion
 * - Elevation - Terrain elevation data
 * - Aerial View - Bird's eye video of properties
 * - Maps Static - Static map image generation
 * - Roads - Road snapping and speed limits
 *
 * ENVIRONMENTAL:
 * - Weather - Current and forecast weather data
 * - Air Quality - Air quality index and pollutants
 * - Pollen - Pollen counts and allergen forecasts
 * - Solar - Solar panel potential analysis
 *
 * AI & MEDIA:
 * - Vision - Image analysis and OCR
 * - Speech-to-Text - Audio transcription
 * - Text-to-Speech - Voice synthesis
 * - Translation - Multi-language translation
 * - Gemini - Generative AI text and embeddings
 *
 * PRODUCTIVITY:
 * - Calendar - Event management
 * - Custom Search - Web search integration
 * - Gmail - Email operations (OAuth required)
 * - YouTube - Video and channel data
 *
 * OPTIMIZATION:
 * - Route Optimization - Multi-stop route planning (VRP)
 * - PageSpeed - Performance monitoring
 *
 * ANALYTICS:
 * - Google Analytics - Website analytics and reporting (OAuth required)
 *
 * Usage:
 * ```typescript
 * import {
 *   googlePlacesService,
 *   googleDistanceMatrixService,
 *   googleStreetViewService,
 *   googleGeminiService,
 * } from "@/lib/services/google-services-index";
 *
 * // Check if API is configured
 * if (googlePlacesService.isConfigured()) {
 *   const results = await googlePlacesService.getAutocomplete("123 Main St");
 * }
 *
 * // Use Gemini for AI text generation
 * if (googleGeminiService.isConfigured()) {
 *   const result = await googleGeminiService.generateContent("Write a job description...");
 * }
 * ```
 */

// ============================================
// Location & Mapping
// ============================================

export type {
	AddressComponent,
	ValidatedAddress,
	ValidationResult,
} from "./google-address-validation-service";
export { googleAddressValidationService } from "./google-address-validation-service";
export type {
	AerialViewLocation,
	AerialViewMetadata,
	AerialViewResult,
	AerialViewState,
	VideoFormat,
} from "./google-aerial-view-service";
export { googleAerialViewService } from "./google-aerial-view-service";
export type {
	DistanceMatrixOptions,
	DistanceMatrixResult,
	DistanceResult,
	Location as DistanceLocation,
	NearestDestination,
	TrafficModel,
	TravelMode,
} from "./google-distance-matrix-service";
export { googleDistanceMatrixService } from "./google-distance-matrix-service";
export type {
	ElevationLocation,
	ElevationPoint,
	ElevationProfile,
	PropertyElevationAnalysis,
} from "./google-elevation-service";
export { googleElevationService } from "./google-elevation-service";
export type {
	AddressComponent as GeocodingAddressComponent,
	GeocodingOptions,
	GeocodingResult,
	ParsedGeocodedAddress,
	ReverseGeocodingOptions,
} from "./google-geocoding-service";
export { googleGeocodingService } from "./google-geocoding-service";
export type {
	CellTower,
	GeolocationResult,
	LocationVerification,
	WifiAccessPoint,
} from "./google-geolocation-service";
export { googleGeolocationService } from "./google-geolocation-service";
export type {
	ImageFormat,
	MapMarker,
	MapPath,
	MapStyle,
	MapType,
	MarkerSize,
	PropertyMapOptions,
	RouteMapOptions,
	ServiceAreaMapOptions,
	StaticMapOptions,
	StaticMapResult,
} from "./google-maps-static-service";
export { googleMapsStaticService } from "./google-maps-static-service";
export type {
	AutocompletePrediction,
	GooglePlaces,
	ParsedAddress,
	Place,
	PlaceDetails,
} from "./google-places-service";
export { googlePlacesService } from "./google-places-service";
export type {
	LatLng,
	NearestRoadResult,
	RouteAnalysis,
	SnappedPoint,
	SnapToRoadsResult,
	SpeedLimit,
	SpeedLimitsResult,
	TechnicianTrackingResult,
} from "./google-roads-service";
export { googleRoadsService } from "./google-roads-service";
export type {
	RouteRequest,
	RouteResponse,
	RouteStep,
} from "./google-routes-service";
export { googleRoutesService } from "./google-routes-service";
export type {
	CameraOptions,
	ImageSize,
	PropertyImageryResult,
	StreetViewImageResult,
	StreetViewLocation,
	StreetViewMetadata,
} from "./google-street-view-service";
export { googleStreetViewService } from "./google-street-view-service";
export type {
	BusinessHours,
	TimeZoneLocation,
	TimeZoneResult,
} from "./google-timezone-service";
export { googleTimeZoneService } from "./google-timezone-service";

// ============================================
// Environmental
// ============================================

export type {
	AirQualityData,
	AirQualityIndex,
	Pollutant,
} from "./google-air-quality-service";
export { googleAirQualityService } from "./google-air-quality-service";
export type {
	PollenData,
	PollenForecast,
	PollenType,
} from "./google-pollen-service";
export { googlePollenService } from "./google-pollen-service";
export type {
	PanelConfig,
	RoofSegment,
	SolarPotential,
} from "./google-solar-service";
export { googleSolarService } from "./google-solar-service";
export type {
	HourlyForecast,
	WeatherData,
	WeatherForecast,
} from "./google-weather-service";
export { googleWeatherService } from "./google-weather-service";

// ============================================
// AI & Media
// ============================================

export type {
	ChatMessage,
	ChatResult,
	CustomerEmailPrompt,
	EmbeddingResult,
	EstimateAnalysisPrompt,
	GeminiModel,
	GenerationConfig,
	GenerationResult,
	JobDescriptionPrompt,
	SafetySetting,
} from "./google-gemini-service";
export { googleGeminiService } from "./google-gemini-service";
export type {
	SpeechRecognitionAlternative,
	TranscriptionConfig,
	TranscriptionResult,
} from "./google-speech-to-text-service";
export { googleSpeechToTextService } from "./google-speech-to-text-service";
export type {
	AudioConfig,
	SynthesisResult,
	VoiceConfig,
} from "./google-text-to-speech-service";
export { googleTextToSpeechService } from "./google-text-to-speech-service";
export type {
	DetectedLanguage,
	SupportedLanguage,
	TranslationResult,
} from "./google-translation-service";
export { googleTranslationService } from "./google-translation-service";
export type {
	ImageAnnotation,
	LabelAnnotation,
	ObjectAnnotation,
	TextAnnotation,
} from "./google-vision-service";
export { googleVisionService } from "./google-vision-service";

// ============================================
// Productivity
// ============================================

export type {
	CalendarEvent,
	EventAttendee,
	EventReminder,
} from "./google-calendar-service";
export { googleCalendarService } from "./google-calendar-service";
export type {
	SearchResponse,
	SearchResult,
} from "./google-custom-search-service";
export { googleCustomSearchService } from "./google-custom-search-service";
export type {
	GmailLabel,
	GmailMessage,
	GmailMessagePart,
	GmailThread,
	ParsedEmail,
	SearchOptions as GmailSearchOptions,
	SendEmailOptions,
	WatchOptions,
	WatchResponse,
} from "./google-gmail-service";
export { googleGmailService } from "./google-gmail-service";
export type {
	YouTubeChannel,
	YouTubeComment,
	YouTubePlaylist,
	YouTubePlaylistItem,
	YouTubeSearchOptions,
	YouTubeSearchResult,
	YouTubeVideo,
} from "./google-youtube-service";
export { googleYouTubeService } from "./google-youtube-service";

// ============================================
// Optimization
// ============================================

export type {
	AuditResult,
	CoreWebVitals,
	PerformanceOpportunity,
	PerformanceReport,
} from "./google-pagespeed-service";
export { googlePageSpeedService } from "./google-pagespeed-service";
export type {
	OptimizationJob,
	OptimizationResult,
	OptimizationTechnician,
	OptimizedRoute,
	UnassignedJob,
} from "./google-route-optimization-service";
export { googleRouteOptimizationService } from "./google-route-optimization-service";

// ============================================
// Analytics
// ============================================

export type {
	AnalyticsData,
	DateRange,
	Dimension,
	FilterExpression,
	Metric,
	OrderBy,
	PagePerformance,
	RealTimeData,
	RealTimeResponse,
	ReportRequest,
	ReportResponse,
	ReportRow,
	TrafficSource,
	WebsiteOverview,
} from "./google-analytics-service";
export { googleAnalyticsService } from "./google-analytics-service";

// ============================================
// Cloud Infrastructure (Service Account)
// ============================================

export type {
	DatasetInfo,
	InsertResult,
	QueryResult,
	TableSchema,
} from "./google-bigquery-service";
export { googleBigQueryService } from "./google-bigquery-service";
export type {
	QueueConfig,
	ScheduledTask,
	TaskConfig,
	TaskResult,
} from "./google-cloud-tasks-service";
export { googleCloudTasksService } from "./google-cloud-tasks-service";
export type {
	PublishResult,
	ReceivedMessage,
	SubscriptionConfig,
	TopicConfig,
} from "./google-pubsub-service";
export { googlePubSubService } from "./google-pubsub-service";

// ============================================
// Workspace & Collaboration (OAuth)
// ============================================

export type {
	ContactGroup,
	ContactPerson,
	ContactSearchResult,
	ContactUpdateResult,
} from "./google-contacts-service";
export { googleContactsService } from "./google-contacts-service";
export type {
	DocumentContent,
	DocumentElement,
	DocumentResult,
	TextStyle,
} from "./google-docs-service";
export { googleDocsService } from "./google-docs-service";
export type {
	DriveFile,
	DriveFolder,
	FileMetadata,
	PermissionConfig,
} from "./google-drive-service";
export { googleDriveService } from "./google-drive-service";
export type {
	CellValue,
	SheetRange,
	SpreadsheetData,
	UpdateResult,
} from "./google-sheets-service";
export { googleSheetsService } from "./google-sheets-service";

// ============================================
// Communications & Notifications
// ============================================

export type {
	FCMMessage,
	NotificationPayload,
	SendResult,
	TopicSubscription,
} from "./google-fcm-service";
export { googleFCMService } from "./google-fcm-service";

// ============================================
// Business & AI
// ============================================

export type {
	CustomerContractData,
	DocumentInput,
	EquipmentInfoExtraction,
	EquipmentWarrantyData,
	ExtractedEntity,
	PageInfo,
	PermitDocumentData,
	ProcessedDocument,
	ProcessorType,
	ReceiptData,
	VendorInvoiceData,
} from "./google-document-ai-service";
export { googleDocumentAIService } from "./google-document-ai-service";
export type {
	BusinessHoursUpdate,
	BusinessLocation,
	BusinessPost,
	BusinessReview,
} from "./google-my-business-service";
export { googleMyBusinessService } from "./google-my-business-service";
export type {
	ClassificationResult,
	EntityResult,
	SentimentResult,
	SyntaxResult,
} from "./google-natural-language-service";
export { googleNaturalLanguageService } from "./google-natural-language-service";

// ============================================
// Configuration Checker
// ============================================

/**
 * Check if all Google services are configured
 */
export function checkGoogleServicesConfig(): {
	configured: string[];
	notConfigured: string[];
	apiKeyPresent: boolean;
	serviceAccountPresent: boolean;
	oauthServicesNote: string;
} {
	const apiKey = process.env.GOOGLE_API_KEY;
	const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
	const youtubeKey = process.env.GOOGLE_YOUTUBE_API_KEY;
	const analyticsPropertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
	const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

	const services = [
		// Location & Mapping
		{ name: "Address Validation", check: () => !!apiKey },
		{ name: "Places", check: () => !!apiKey },
		{ name: "Distance Matrix", check: () => !!apiKey },
		{ name: "Geolocation", check: () => !!apiKey },
		{ name: "Street View", check: () => !!apiKey },
		{ name: "Routes", check: () => !!apiKey },
		{ name: "Geocoding", check: () => !!apiKey },
		{ name: "Time Zone", check: () => !!apiKey },
		{ name: "Elevation", check: () => !!apiKey },
		{ name: "Aerial View", check: () => !!apiKey },
		{ name: "Maps Static", check: () => !!apiKey },
		{ name: "Roads", check: () => !!apiKey },

		// Environmental
		{ name: "Weather", check: () => !!apiKey },
		{ name: "Air Quality", check: () => !!apiKey },
		{ name: "Pollen", check: () => !!apiKey },
		{ name: "Solar", check: () => !!apiKey },

		// AI & Media
		{ name: "Vision", check: () => !!apiKey },
		{ name: "Speech-to-Text", check: () => !!apiKey },
		{ name: "Text-to-Speech", check: () => !!apiKey },
		{ name: "Translation", check: () => !!apiKey },
		{ name: "Gemini", check: () => !!(geminiKey || apiKey) },

		// Productivity
		{ name: "Calendar", check: () => !!apiKey },
		{
			name: "Custom Search",
			check: () => !!apiKey && !!process.env.GOOGLE_SEARCH_ENGINE_ID,
		},
		{ name: "Gmail (OAuth)", check: () => true }, // Always "configured" as it uses OAuth
		{ name: "YouTube", check: () => !!(youtubeKey || apiKey) },

		// Optimization
		{ name: "Route Optimization", check: () => !!apiKey },
		{ name: "PageSpeed", check: () => !!apiKey },

		// Analytics
		{ name: "Analytics (OAuth)", check: () => !!analyticsPropertyId },

		// Cloud Infrastructure (Service Account)
		{ name: "Cloud Tasks", check: () => !!serviceAccountKey },
		{ name: "Pub/Sub", check: () => !!serviceAccountKey },
		{ name: "BigQuery", check: () => !!serviceAccountKey },

		// Workspace & Collaboration (OAuth)
		{ name: "Drive (OAuth)", check: () => true },
		{ name: "Sheets (OAuth)", check: () => true },
		{ name: "Docs (OAuth)", check: () => true },
		{ name: "Contacts (OAuth)", check: () => true },

		// Communications
		{ name: "FCM", check: () => !!serviceAccountKey },

		// Business & AI
		{ name: "My Business (OAuth)", check: () => true },
		{ name: "Natural Language", check: () => !!apiKey },

		// Document Processing
		{
			name: "Document AI",
			check: () => !!serviceAccountKey && !!process.env.GOOGLE_CLOUD_PROJECT_ID,
		},
	];

	const configured: string[] = [];
	const notConfigured: string[] = [];

	for (const service of services) {
		if (service.check()) {
			configured.push(service.name);
		} else {
			notConfigured.push(service.name);
		}
	}

	return {
		configured,
		notConfigured,
		apiKeyPresent: !!apiKey,
		serviceAccountPresent: !!serviceAccountKey,
		oauthServicesNote:
			"Gmail, Drive, Sheets, Docs, Contacts, My Business, and Analytics require OAuth 2.0 access tokens passed to service methods.",
	};
}

/**
 * Get a summary of all available services
 */
export function getServicesSummary(): {
	total: number;
	categories: {
		name: string;
		services: string[];
	}[];
} {
	return {
		total: 39,
		categories: [
			{
				name: "Location & Mapping",
				services: [
					"Address Validation",
					"Places",
					"Distance Matrix",
					"Geolocation",
					"Street View",
					"Routes",
					"Geocoding",
					"Time Zone",
					"Elevation",
					"Aerial View",
					"Maps Static",
					"Roads",
				],
			},
			{
				name: "Environmental",
				services: ["Weather", "Air Quality", "Pollen", "Solar"],
			},
			{
				name: "AI & Media",
				services: [
					"Vision",
					"Speech-to-Text",
					"Text-to-Speech",
					"Translation",
					"Gemini",
					"Natural Language",
				],
			},
			{
				name: "Productivity",
				services: [
					"Calendar",
					"Custom Search",
					"Gmail",
					"YouTube",
					"Drive",
					"Sheets",
					"Docs",
					"Contacts",
				],
			},
			{
				name: "Optimization",
				services: ["Route Optimization", "PageSpeed"],
			},
			{
				name: "Analytics",
				services: ["Google Analytics"],
			},
			{
				name: "Cloud Infrastructure",
				services: ["Cloud Tasks", "Pub/Sub", "BigQuery"],
			},
			{
				name: "Communications & Business",
				services: ["FCM (Push Notifications)", "My Business"],
			},
			{
				name: "Document Processing",
				services: ["Document AI"],
			},
		],
	};
}
