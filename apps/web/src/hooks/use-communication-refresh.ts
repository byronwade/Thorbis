import { useCallback, useEffect, useRef } from "react";

/**
 * Communication event types that trigger refresh
 */
export type CommunicationEventType =
	| "email-received"
	| "email-sent"
	| "email-read"
	| "email-archived"
	| "email-spam-toggled"
	| "sms-read"
	| "sms-sent"
	| "communication-updated";

/**
 * Default events to listen for
 */
const DEFAULT_EVENTS: CommunicationEventType[] = [
	"email-received",
	"email-sent",
	"email-read",
	"email-archived",
	"sms-read",
	"communication-updated",
];

interface UseCommunicationRefreshOptions {
	/**
	 * Auto-refresh interval in milliseconds. Set to 0 to disable.
	 * @default 30000 (30 seconds)
	 */
	interval?: number;
	/**
	 * Debounce delay for event-triggered refreshes in milliseconds.
	 * @default 1000
	 */
	debounceDelay?: number;
	/**
	 * Events to listen for that trigger refresh.
	 * @default ["email-received", "email-sent", "email-read", "email-archived", "sms-read", "communication-updated"]
	 */
	events?: CommunicationEventType[];
	/**
	 * Whether the refresh is currently disabled (e.g., when composing).
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Whether to skip the initial fetch (component handles its own initial load).
	 * @default true
	 */
	skipInitial?: boolean;
}

/**
 * useCommunicationRefresh - Auto-refresh hook for communication components
 *
 * Provides automatic periodic refresh and event-based refresh for communication
 * data. Listens for window events dispatched when communications are updated,
 * and periodically refreshes data at configurable intervals.
 *
 * @param fetchFn - The function to call to refresh data
 * @param options - Configuration options
 *
 * @example
 * const fetchCommunications = useCallback(async () => {
 *   const result = await getCommunicationsAction({ ... });
 *   if (result.success) setCommunications(result.data);
 * }, []);
 *
 * const { refreshing, manualRefresh } = useCommunicationRefresh(fetchCommunications, {
 *   interval: 30000, // Refresh every 30 seconds
 *   disabled: composeMode, // Don't refresh while composing
 * });
 */
export function useCommunicationRefresh(
	fetchFn: () => Promise<void> | void,
	options: UseCommunicationRefreshOptions = {}
) {
	const {
		interval = 30000,
		debounceDelay = 1000,
		events = DEFAULT_EVENTS,
		disabled = false,
		skipInitial = true,
	} = options;

	// Track if refresh is in progress to prevent concurrent calls
	const refreshingRef = useRef(false);
	const initialRef = useRef(true);
	
	// Store fetchFn in a ref to avoid re-creating callbacks when it changes
	const fetchFnRef = useRef(fetchFn);
	fetchFnRef.current = fetchFn;

	// Wrapped fetch function that tracks refresh state (stable reference)
	const doRefresh = useCallback(async () => {
		if (refreshingRef.current || disabled) return;

		refreshingRef.current = true;
		try {
			await fetchFnRef.current();
		} finally {
			refreshingRef.current = false;
		}
	}, [disabled]);

	// Manual refresh function for user-triggered refreshes
	const manualRefresh = useCallback(() => {
		return doRefresh();
	}, [doRefresh]);

	// Initial fetch (if not skipped)
	useEffect(() => {
		if (initialRef.current && !skipInitial) {
			initialRef.current = false;
			doRefresh();
		}
	}, [doRefresh, skipInitial]);

	// Auto-refresh interval
	useEffect(() => {
		if (interval <= 0 || disabled) return;

		const intervalId = setInterval(() => {
			if (!refreshingRef.current) {
				doRefresh();
			}
		}, interval);

		return () => clearInterval(intervalId);
	}, [interval, disabled, doRefresh]);

	// Event-based refresh
	useEffect(() => {
		if (events.length === 0) return;

		let debounceTimeout: NodeJS.Timeout;
		const handleRefresh = () => {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(() => {
				if (!refreshingRef.current) {
					doRefresh();
				}
			}, debounceDelay);
		};

		// Add event listeners
		events.forEach((event) => {
			window.addEventListener(event, handleRefresh);
		});

		return () => {
			clearTimeout(debounceTimeout);
			events.forEach((event) => {
				window.removeEventListener(event, handleRefresh);
			});
		};
	}, [events, debounceDelay, doRefresh]);

	return {
		/** Whether a refresh is currently in progress */
		refreshing: refreshingRef.current,
		/** Trigger a manual refresh */
		manualRefresh,
	};
}

/**
 * Dispatch a communication event to trigger refresh across all listening components
 *
 * @example
 * // After sending an email:
 * dispatchCommunicationEvent("email-sent");
 *
 * // After marking as read:
 * dispatchCommunicationEvent("communication-updated");
 */
function dispatchCommunicationEvent(eventType: CommunicationEventType) {
	window.dispatchEvent(new CustomEvent(eventType));
}
