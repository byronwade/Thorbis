export { analytics, trackEvent, getEvents, debugEvents, initAnalytics } from "./analytics";
export { getDB } from "./db";
export { storage } from "../services/storage";
export { dataService } from "../services/data";
export { getSessionBehaviorData } from "../services/recommendations";
export { mergeSessionData } from "../services/data";

// Event tracking
export { trackUserIdentify, trackFormInteraction, trackNavigation, trackError } from "../events";

// Export all types
export type { EventData, UserProfile, BehaviorData, AnalyticsConfig, TrackingEvent, UserSession, EnhancedBehaviorData, AnalyticsDBSchema, SessionData } from "../types";

// Constants
export { DB_NAME, DB_VERSION, MAX_CACHE_SIZE, CLEANUP_INTERVAL, SESSION_TIMEOUT, EVENT_TYPES, PERFORMANCE_THRESHOLDS } from "../utils/constants";
