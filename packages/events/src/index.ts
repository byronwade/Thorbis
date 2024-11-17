export { default as Thorbis } from "./components/Thorbis";
export { analytics, trackEvent, getEvents, debugEvents, storage, dataService, getSessionBehaviorData, mergeSessionData, getDB } from "./lib/analytics/core";

// Export types
export type { AnalyticsConfig, BehaviorData, TrackingEvent, UserSession, SessionData, EventData, UserProfile, AnalyticsDBSchema, EnhancedBehaviorData } from "./lib/analytics/types/index";

// Export constants
export { DB_NAME, DB_VERSION, MAX_CACHE_SIZE, CLEANUP_INTERVAL, SESSION_TIMEOUT, EVENT_TYPES, PERFORMANCE_THRESHOLDS } from "./lib/analytics/utils/constants";

// Export utilities
export { logger } from "./lib/analytics/utils/logger";
