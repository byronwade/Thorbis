module.exports = [
"[project]/apps/web/src/lib/stores/dialer-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDialerStore",
    ()=>useDialerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const initialState = {
    isOpen: false,
    phoneNumber: "",
    customerId: null,
    customerName: null
};
const useDialerStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        ...initialState,
        openDialer: (phoneNumber = "", customerId = null, customerName = null)=>set({
                isOpen: true,
                phoneNumber,
                customerId,
                customerName
            }),
        closeDialer: ()=>set({
                isOpen: false
            }),
        setPhoneNumber: (phoneNumber)=>set({
                phoneNumber
            }),
        reset: ()=>set(initialState)
    }));
}),
"[project]/apps/web/src/lib/stores/notification-events.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMMUNICATION_MARK_AS_READ_EVENT",
    ()=>COMMUNICATION_MARK_AS_READ_EVENT
]);
const COMMUNICATION_MARK_AS_READ_EVENT = "communication:mark-as-read";
}),
"[project]/apps/web/src/lib/stores/notifications-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Notifications Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand (no provider wrapper)
 * - Selective subscriptions prevent unnecessary re-renders
 * - Real-time updates via Supabase Realtime
 * - Optimistic updates for better UX
 * - Organized in /src/lib/stores/ directory
 *
 * Usage in components:
 * ```typescript
 * const notifications = useNotificationsStore((state) => state.notifications);
 * const unreadCount = useNotificationsStore((state) => state.unreadCount);
 * const markAsRead = useNotificationsStore((state) => state.markAsRead);
 * ```
 */ __turbopack_context__.s([
    "useNotificationsStore",
    ()=>useNotificationsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$notification$2d$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/notification-events.ts [app-ssr] (ecmascript)");
;
;
;
;
// Initial state
const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isSubscribed: false,
    error: null,
    realtimeChannel: null,
    subscriptionPromise: null
};
const useNotificationsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        ...initialState,
        // ===============================================================================
        // Basic State Setters
        // ===============================================================================
        setNotifications: (notifications)=>{
            const unreadCount = notifications.filter((n)=>!n.read).length;
            set({
                notifications,
                unreadCount
            });
        },
        addNotification: (notification)=>set((state)=>{
                const exists = state.notifications.some((n)=>n.id === notification.id);
                if (exists) {
                    return state;
                }
                const newNotifications = [
                    notification,
                    ...state.notifications
                ];
                const unreadCount = newNotifications.filter((n)=>!n.read).length;
                return {
                    notifications: newNotifications,
                    unreadCount
                };
            }),
        updateNotification: (id, updates)=>set((state)=>{
                const notifications = state.notifications.map((n)=>n.id === id ? {
                        ...n,
                        ...updates
                    } : n);
                const unreadCount = notifications.filter((n)=>!n.read).length;
                return {
                    notifications,
                    unreadCount
                };
            }),
        removeNotification: (id)=>set((state)=>{
                const notifications = state.notifications.filter((n)=>n.id !== id);
                const unreadCount = notifications.filter((n)=>!n.read).length;
                return {
                    notifications,
                    unreadCount
                };
            }),
        setUnreadCount: (unreadCount)=>set({
                unreadCount
            }),
        setLoading: (isLoading)=>set({
                isLoading
            }),
        setError: (error)=>set({
                error
            }),
        // ===============================================================================
        // Optimistic Updates
        // ===============================================================================
        optimisticMarkAsRead: (id)=>set((state)=>{
                const notifications = state.notifications.map((n)=>n.id === id ? {
                        ...n,
                        read: true,
                        read_at: new Date().toISOString()
                    } : n);
                const unreadCount = notifications.filter((n)=>!n.read).length;
                return {
                    notifications,
                    unreadCount
                };
            }),
        optimisticMarkAsUnread: (id)=>set((state)=>{
                const notifications = state.notifications.map((n)=>n.id === id ? {
                        ...n,
                        read: false,
                        read_at: null
                    } : n);
                const unreadCount = notifications.filter((n)=>!n.read).length;
                return {
                    notifications,
                    unreadCount
                };
            }),
        optimisticMarkAllAsRead: ()=>set((state)=>{
                const notifications = state.notifications.map((n)=>({
                        ...n,
                        read: true,
                        read_at: n.read_at || new Date().toISOString()
                    }));
                return {
                    notifications,
                    unreadCount: 0
                };
            }),
        optimisticDelete: (id)=>set((state)=>{
                const notifications = state.notifications.filter((n)=>n.id !== id);
                const unreadCount = notifications.filter((n)=>!n.read).length;
                return {
                    notifications,
                    unreadCount
                };
            }),
        // ===============================================================================
        // Realtime Subscription Management
        // ===============================================================================
        subscribe: async (userId)=>{
            try {
                const state = get();
                // CRITICAL: Return existing promise if subscription is in progress
                if (state.subscriptionPromise) {
                    return state.subscriptionPromise;
                }
                // Don't subscribe if already subscribed
                if (state.isSubscribed || state.realtimeChannel) {
                    return Promise.resolve();
                }
                // Create subscription promise BEFORE any async operations
                const subscriptionPromise = (async ()=>{
                    // CRITICAL FIX: Set flag immediately to prevent race condition
                    set({
                        isSubscribed: true
                    });
                    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
                    if (!supabase) {
                        set({
                            isSubscribed: false
                        });
                        return;
                    }
                    // Create realtime channel for notifications
                    const channel = supabase.channel("notifications-changes").on("postgres_changes", {
                        event: "INSERT",
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${userId}`
                    }, (payload)=>{
                        // New notification received
                        if (payload.new) {
                            const notification = payload.new;
                            get().addNotification(notification);
                            // Show toast notification for communication events
                            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                            ;
                        }
                    }).on("postgres_changes", {
                        event: "UPDATE",
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${userId}`
                    }, (payload)=>{
                        // Notification updated
                        if (payload.new) {
                            const notification = payload.new;
                            get().updateNotification(notification.id, notification);
                        }
                    }).on("postgres_changes", {
                        event: "DELETE",
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${userId}`
                    }, (payload)=>{
                        // Notification deleted
                        if (payload.old) {
                            get().removeNotification(payload.old.id);
                        }
                    }).subscribe((status, _err)=>{
                        if (status === "SUBSCRIBED") {
                            set({
                                error: null
                            }); // Clear any previous errors
                        } else if (status === "CHANNEL_ERROR") {
                            // Don't set error state to avoid breaking the UI
                            set({
                                isSubscribed: false,
                                realtimeChannel: null
                            });
                        } else if (status === "TIMED_OUT") {
                            set({
                                isSubscribed: false,
                                realtimeChannel: null
                            });
                        } else if (status === "CLOSED") {
                            set({
                                isSubscribed: false,
                                realtimeChannel: null
                            });
                        }
                    });
                    set({
                        realtimeChannel: channel,
                        subscriptionPromise: null
                    });
                })(); // End of async IIFE
                // Set the promise immediately to prevent concurrent calls
                set({
                    subscriptionPromise
                });
                return subscriptionPromise;
            } catch (_error) {
                // App will still work without realtime, so don't set error state
                set({
                    isSubscribed: false,
                    realtimeChannel: null,
                    subscriptionPromise: null
                });
            }
        },
        unsubscribe: ()=>{
            const state = get();
            if (state.realtimeChannel) {
                state.realtimeChannel.unsubscribe();
                set({
                    realtimeChannel: null,
                    isSubscribed: false
                });
            }
        },
        // ===============================================================================
        // Utility
        // ===============================================================================
        reset: ()=>set(initialState)
    }), {
    name: "NotificationsStore"
}));
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
// =====================================================================================
// Selectors (for optimized re-renders)
// =====================================================================================
/**
 * Get only unread notifications
 */ const selectUnreadNotifications = (state)=>state.notifications.filter((n)=>!n.read);
/**
 * Get notifications by type
 */ const selectNotificationsByType = (type)=>(state)=>state.notifications.filter((n)=>n.type === type);
/**
 * Get notifications by priority
 */ const selectNotificationsByPriority = (priority)=>(state)=>state.notifications.filter((n)=>n.priority === priority);
/**
 * Get urgent unread notifications
 */ const selectUrgentUnreadNotifications = (state)=>state.notifications.filter((n)=>!n.read && n.priority === "urgent");
}),
"[project]/apps/web/src/lib/stores/sync-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sync Store - Global state management for sync operations
 *
 * Manages:
 * - Active sync operations (bulk send, data sync, etc.)
 * - Offline queue
 * - Real-time progress tracking
 * - Operation history
 */ __turbopack_context__.s([
    "useSyncStore",
    ()=>useSyncStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const useSyncStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        operations: [],
        offlineQueue: [],
        isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
        isPanelOpen: false,
        startOperation: (operation)=>{
            const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const newOperation = {
                ...operation,
                id,
                status: "in_progress",
                progress: 0,
                startedAt: new Date()
            };
            set((state)=>({
                    operations: [
                        ...state.operations,
                        newOperation
                    ]
                }));
            return id;
        },
        updateOperation: (id, updates)=>{
            set((state)=>({
                    operations: state.operations.map((op)=>op.id === id ? {
                            ...op,
                            ...updates
                        } : op)
                }));
        },
        completeOperation: (id, success, error)=>{
            set((state)=>({
                    operations: state.operations.map((op)=>op.id === id ? {
                            ...op,
                            status: success ? "completed" : "failed",
                            progress: success ? 100 : op.progress,
                            completedAt: new Date(),
                            error
                        } : op)
                }));
            // Auto-remove completed operations after 10 seconds
            if (success) {
                setTimeout(()=>{
                    get().removeOperation(id);
                }, 10_000);
            }
        },
        removeOperation: (id)=>{
            set((state)=>({
                    operations: state.operations.filter((op)=>op.id !== id)
                }));
        },
        clearCompleted: ()=>{
            set((state)=>({
                    operations: state.operations.filter((op)=>op.status !== "completed" && op.status !== "failed")
                }));
        },
        queueOperation: (operation)=>{
            const id = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const queuedOp = {
                ...operation,
                id,
                createdAt: new Date(),
                retryCount: 0
            };
            set((state)=>({
                    offlineQueue: [
                        ...state.offlineQueue,
                        queuedOp
                    ]
                }));
        },
        removeFromQueue: (id)=>{
            set((state)=>({
                    offlineQueue: state.offlineQueue.filter((op)=>op.id !== id)
                }));
        },
        clearQueue: ()=>{
            set({
                offlineQueue: []
            });
        },
        setOnlineStatus: (isOnline)=>{
            set({
                isOnline
            });
        },
        togglePanel: ()=>{
            set((state)=>({
                    isPanelOpen: !state.isPanelOpen
                }));
        },
        openPanel: ()=>{
            set({
                isPanelOpen: true
            });
        },
        closePanel: ()=>{
            set({
                isPanelOpen: false
            });
        }
    }), {
    name: "thorbis-sync-store",
    skipHydration: true,
    partialize: (state)=>({
            offlineQueue: state.offlineQueue
        })
}));
// Hook to get active operations count
const useActiveOperationsCount = ()=>useSyncStore((state)=>state.operations.filter((op)=>op.status === "in_progress").length);
// Hook to get queued operations count
const useQueuedOperationsCount = ()=>useSyncStore((state)=>state.offlineQueue.length);
// Hook to get if syncing
const useIsSyncing = ()=>useSyncStore((state)=>state.operations.some((op)=>op.status === "in_progress"));
}),
"[project]/apps/web/src/lib/telnyx/web-credentials-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchWebRTCCredentialsOnce",
    ()=>fetchWebRTCCredentialsOnce,
    "resetWebRTCCredentialsCache",
    ()=>resetWebRTCCredentialsCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$d7d068__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/actions/data:d7d068 [app-ssr] (ecmascript) <text/javascript>");
"use client";
;
const STORAGE_KEY = "telnyx-webrtc-credential";
// Refresh 5 minutes before expiration (Telnyx recommended buffer)
// This prevents credential expiry during active calls
const EXPIRY_BUFFER_MS = 5 * 60 * 1000;
let credentialsPromise = null;
function getExpiresAtMs(expiresAt) {
    if (typeof expiresAt === "number") {
        return expiresAt;
    }
    if (typeof expiresAt === "string") {
        const parsed = Date.parse(expiresAt);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
}
function loadFromStorage() {
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
}
function persistCredential(credential) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function createPromise() {
    const cached = loadFromStorage();
    if (cached) {
        console.log("🔑 Using cached WebRTC credentials:", {
            username: cached.username,
            expiresAt: new Date(cached.expires_at).toISOString(),
            isExpired: cached.expires_at <= Date.now()
        });
        const cachedResult = {
            success: true,
            credential: cached
        };
        const promise = Promise.resolve(cachedResult);
        credentialsPromise = promise;
        return promise;
    }
    console.log("🔑 Fetching WebRTC credentials from server...");
    const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$d7d068__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getWebRTCCredentials"])().then((result)=>{
        console.log("🔑 WebRTC credentials response:", result);
        if (result?.success && result.credential) {
            console.log("🔑 Persisting new credentials to localStorage");
            persistCredential(result.credential);
        } else {
            console.warn("🔑 Failed to get credentials, clearing cache");
            credentialsPromise = null;
        }
        return result;
    }).catch((error)=>{
        console.error("🔑 WebRTC credentials fetch error:", error);
        credentialsPromise = null;
        throw error;
    });
    credentialsPromise = promise;
    return promise;
}
function fetchWebRTCCredentialsOnce() {
    return credentialsPromise ?? createPromise();
}
function resetWebRTCCredentialsCache() {
    credentialsPromise = null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
}),
"[project]/apps/web/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.4.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$4$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/apps/web/src/lib/stores/communication-notifications-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Communication Notifications Store - Zustand State Management
 *
 * Handles real-time toast notifications for:
 * - Phone calls (incoming, missed, completed)
 * - Voicemails (new messages)
 * - Text messages/SMS (incoming)
 * - Emails (incoming)
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - Automatic toast display on new communications
 * - Integrated with existing notifications system
 * - Sound and desktop notification support
 */ __turbopack_context__.s([
    "useCommunicationNotificationsStore",
    ()=>useCommunicationNotificationsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$notification$2d$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/notification-events.ts [app-ssr] (ecmascript)");
;
;
;
;
// Initial state (load from localStorage if available)
const loadSettings = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            soundEnabled: true,
            desktopNotificationsEnabled: true,
            toastDuration: 5000
        };
    }
    //TURBOPACK unreachable
    ;
};
const useCommunicationNotificationsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        ...loadSettings(),
        toastQueue: [],
        // ===============================================================================
        // Toast Display
        // ===============================================================================
        showCommunicationToast: (notification, options = {})=>{
            const { metadata } = notification;
            const communicationType = metadata?.communication_type;
            // Determine toast appearance based on communication type
            let icon = "📩"; // Default
            let _toastType = "info";
            switch(communicationType){
                case "call":
                    icon = "📞";
                    if (notification.priority === "high") {
                        icon = "📵"; // Missed call
                        _toastType = "error";
                    }
                    break;
                case "sms":
                    icon = "💬";
                    break;
                case "email":
                    icon = "📧";
                    break;
                case "voicemail":
                    icon = "🎙️";
                    if (notification.priority === "urgent") {
                        _toastType = "error";
                    }
                    break;
            }
            // Play sound if enabled
            const { soundEnabled } = get();
            if (soundEnabled) {
                get().playNotificationSound();
            }
            // Show desktop notification if enabled
            const { desktopNotificationsEnabled } = get();
            if (desktopNotificationsEnabled) {
                get().showDesktopNotification(notification.title, notification.message, metadata ?? undefined);
            }
            // Create toast with custom styling
            const toastId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(notification.title, {
                description: notification.message,
                duration: options.duration || get().toastDuration,
                icon,
                closeButton: options.closeButton ?? true,
                dismissible: options.dismissible ?? true,
                action: notification.action_url ? {
                    label: notification.action_label || "View",
                    onClick: ()=>{
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                        if (notification.action_url) {
                            window.location.href = notification.action_url;
                        }
                    }
                } : options.action,
                className: notification.priority === "urgent" ? "border-destructive bg-destructive/10" : ""
            });
            // Track toast ID
            set((state)=>({
                    toastQueue: [
                        ...state.toastQueue,
                        String(toastId)
                    ]
                }));
            return toastId;
        },
        showCallToast: (customerName, phoneNumber, status, metadata = {})=>{
            let title = "";
            let message = "";
            let _priority = "medium";
            let icon = "📞";
            switch(status){
                case "incoming":
                    title = `Incoming call from ${customerName}`;
                    message = phoneNumber;
                    _priority = "high";
                    icon = "📞";
                    break;
                case "missed":
                    title = `Missed call from ${customerName}`;
                    message = phoneNumber;
                    _priority = "high";
                    icon = "📵";
                    break;
                case "completed":
                    title = `Call with ${customerName}`;
                    message = `Duration: ${metadata.duration || "Unknown"}`;
                    _priority = "low";
                    icon = "✅";
                    break;
            }
            const toastId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(title, {
                description: message,
                icon,
                duration: get().toastDuration,
                closeButton: true,
                action: {
                    label: "View",
                    onClick: ()=>{
                        window.location.href = "/dashboard/customers/communication?filter=calls";
                    }
                },
                className: status === "missed" ? "border-destructive" : ""
            });
            if (get().soundEnabled) {
                get().playNotificationSound();
            }
            if (get().desktopNotificationsEnabled) {
                get().showDesktopNotification(title, message, {
                    status,
                    ...metadata
                });
            }
            return toastId;
        },
        showVoicemailToast: (customerName, phoneNumber, duration)=>{
            const title = `New voicemail from ${customerName}`;
            const message = duration ? `${phoneNumber} • ${duration}s` : phoneNumber;
            const toastId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(title, {
                description: message,
                icon: "🎙️",
                duration: get().toastDuration,
                closeButton: true,
                action: {
                    label: "Listen",
                    onClick: ()=>{
                        window.location.href = "/dashboard/customers/communication?filter=voicemails";
                    }
                }
            });
            if (get().soundEnabled) {
                get().playNotificationSound();
            }
            if (get().desktopNotificationsEnabled) {
                get().showDesktopNotification(title, message, {
                    type: "voicemail",
                    duration
                });
            }
            return toastId;
        },
        showSMSToast: (customerName, phoneNumber, message)=>{
            const title = `Text from ${customerName}`;
            const preview = message.length > 100 ? `${message.substring(0, 100)}...` : message;
            const toastId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(title, {
                description: preview,
                icon: "💬",
                duration: get().toastDuration,
                closeButton: true,
                action: {
                    label: "Reply",
                    onClick: ()=>{
                        window.location.href = "/dashboard/customers/communication?filter=sms";
                    }
                }
            });
            if (get().soundEnabled) {
                get().playNotificationSound();
            }
            if (get().desktopNotificationsEnabled) {
                get().showDesktopNotification(title, preview, {
                    type: "sms",
                    from: phoneNumber
                });
            }
            return toastId;
        },
        showEmailToast: (customerName, fromAddress, subject)=>{
            const title = `Email from ${customerName}`;
            const message = subject || "No subject";
            const toastId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(title, {
                description: message,
                icon: "📧",
                duration: get().toastDuration,
                closeButton: true,
                action: {
                    label: "View",
                    onClick: ()=>{
                        window.location.href = "/dashboard/customers/communication?filter=emails";
                    }
                }
            });
            if (get().soundEnabled) {
                get().playNotificationSound();
            }
            if (get().desktopNotificationsEnabled) {
                get().showDesktopNotification(title, message, {
                    type: "email",
                    from: fromAddress
                });
            }
            return toastId;
        },
        dismissToast: (id)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(id);
            set((state)=>({
                    toastQueue: state.toastQueue.filter((toastId)=>toastId !== String(id))
                }));
        },
        dismissAllToasts: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss();
            set({
                toastQueue: []
            });
        },
        // ===============================================================================
        // Settings
        // ===============================================================================
        setSoundEnabled: (enabled)=>{
            set({
                soundEnabled: enabled
            });
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        },
        setDesktopNotificationsEnabled: (enabled)=>{
            set({
                desktopNotificationsEnabled: enabled
            });
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // Request permission if enabling
            if (enabled) {
                get().requestDesktopNotificationPermission();
            }
        },
        setToastDuration: (duration)=>{
            set({
                toastDuration: duration
            });
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        },
        // ===============================================================================
        // Utility
        // ===============================================================================
        playNotificationSound: ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
        },
        requestDesktopNotificationPermission: async ()=>{
            if (("TURBOPACK compile-time value", "undefined") === "undefined" || !("Notification" in window)) {
                return false;
            }
            //TURBOPACK unreachable
            ;
        },
        showDesktopNotification: (title, body, data = {})=>{
            if (("TURBOPACK compile-time value", "undefined") === "undefined" || !("Notification" in window)) {
                return;
            }
            //TURBOPACK unreachable
            ;
        }
    }), {
    name: "CommunicationNotificationsStore"
}));
}),
"[project]/apps/web/src/hooks/use-dialer-shortcut.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDialerShortcut",
    ()=>useDialerShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$dialer$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/dialer-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useDialerShortcut() {
    const openDialer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$dialer$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDialerStore"])((state)=>state.openDialer);
    const closeDialer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$dialer$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDialerStore"])((state)=>state.closeDialer);
    const isOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$dialer$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDialerStore"])((state)=>state.isOpen);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (event)=>{
            // Check for Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (Mac)
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "D") {
                event.preventDefault();
                // Toggle dialer
                if (isOpen) {
                    closeDialer();
                } else {
                    openDialer();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        openDialer,
        closeDialer,
        isOpen
    ]);
}
}),
"[project]/apps/web/src/hooks/use-dialer-customers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Dialer Customers Hook - Client-Side Lazy Loading
 *
 * PERFORMANCE CRITICAL:
 * Previously, AppHeader fetched ALL customers on EVERY page load (~400-800ms).
 * Now customers are only fetched when the dialer is opened.
 *
 * Features:
 * - Lazy load on first dialer open
 * - 5-minute cache in memory
 * - No server-side overhead on page loads
 *
 * Expected savings: 400-800ms per page load
 */ __turbopack_context__.s([
    "useDialerCustomers",
    ()=>useDialerCustomers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
// In-memory cache with 5-minute TTL
let cachedCustomers = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
function useDialerCustomers(shouldFetch = false) {
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only fetch if explicitly requested (e.g., dialer opened)
        if (!shouldFetch) {
            return;
        }
        // Serve from cache when available
        const now = Date.now();
        if (cachedCustomers && now - cacheTimestamp < CACHE_TTL) {
            setCustomers(cachedCustomers);
            return;
        }
        const controller = new AbortController();
        const fetchCustomers = async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/dialer/customers", {
                    signal: controller.signal,
                    cache: "no-store"
                });
                if (!response.ok) {
                    const payload = await response.json().catch(()=>({}));
                    throw new Error(payload.error || "Failed to load customers");
                }
                const payload = await response.json();
                cachedCustomers = payload.customers;
                cacheTimestamp = Date.now();
                setCustomers(payload.customers);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }
                setError(err instanceof Error ? err.message : "Failed to load customers");
            } finally{
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };
        fetchCustomers();
        return ()=>{
            controller.abort();
        };
    }, [
        shouldFetch
    ]);
    return {
        customers,
        isLoading,
        error
    };
}
// Helper to invalidate cache (call after creating/updating customers)
function invalidateDialerCustomersCache() {
    cachedCustomers = null;
    cacheTimestamp = 0;
}
}),
"[project]/apps/web/src/hooks/use-telnyx-webrtc.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx WebRTC Hook
 *
 * Provides WebRTC calling functionality using the Telnyx WebRTC SDK.
 * Compatible with both web browsers and React Native.
 *
 * Features:
 * - Make and receive calls
 * - Call controls (mute, hold, end)
 * - Real-time call state management
 * - Audio device selection
 * - Connection status monitoring
 * - Auto-reconnection with exponential backoff
 */ __turbopack_context__.s([
    "useTelnyxWebRTC",
    ()=>useTelnyxWebRTC
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$telnyx$2b$webrtc$40$2$2e$25$2e$2$2f$node_modules$2f40$telnyx$2f$webrtc$2f$lib$2f$bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@telnyx+webrtc@2.25.2/node_modules/@telnyx/webrtc/lib/bundle.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
// =============================================================================
// AUTO-RECONNECTION CONFIGURATION
// =============================================================================
const RECONNECT_CONFIG = {
    // Maximum number of reconnection attempts
    maxAttempts: 5,
    // Base delay in milliseconds (doubles with each attempt)
    baseDelayMs: 1000,
    // Maximum delay between attempts
    maxDelayMs: 30000,
    // Jitter factor (0-1) to add randomness
    jitterFactor: 0.3
};
function useTelnyxWebRTC(options) {
    // Connection state
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReconnecting, setIsReconnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connectionError, setConnectionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reconnectAttempts, setReconnectAttempts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Call state
    const [currentCall, setCurrentCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Audio devices
    const [audioDevices, setAudioDevices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Refs
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeCallRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const optionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(options);
    const reconnectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const shouldReconnectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    // Keep options ref up to date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        optionsRef.current = options;
    }, [
        options
    ]);
    /**
	 * Calculate reconnection delay with exponential backoff and jitter
	 */ const calculateReconnectDelay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((attempt)=>{
        // Exponential backoff: baseDelay * 2^attempt
        const exponentialDelay = RECONNECT_CONFIG.baseDelayMs * Math.pow(2, attempt);
        // Cap at maxDelay
        const cappedDelay = Math.min(exponentialDelay, RECONNECT_CONFIG.maxDelayMs);
        // Add jitter to prevent thundering herd
        const jitter = cappedDelay * RECONNECT_CONFIG.jitterFactor * Math.random();
        return Math.round(cappedDelay + jitter);
    }, []);
    /**
	 * Schedule a reconnection attempt
	 */ const scheduleReconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Clear any existing timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        setReconnectAttempts((prev)=>{
            const nextAttempt = prev + 1;
            if (nextAttempt > RECONNECT_CONFIG.maxAttempts) {
                console.error(`❌ WebRTC: Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) reached`);
                setIsReconnecting(false);
                setConnectionError(`Connection lost. Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) exceeded.`);
                return prev;
            }
            const delay = calculateReconnectDelay(nextAttempt - 1);
            console.log(`🔄 WebRTC: Scheduling reconnection attempt ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts} in ${delay}ms`);
            setIsReconnecting(true);
            reconnectTimeoutRef.current = setTimeout(async ()=>{
                console.log(`🔄 WebRTC: Attempting reconnection ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts}`);
                // Clear the old client before reconnecting
                if (clientRef.current) {
                    try {
                        clientRef.current.disconnect();
                    } catch  {
                    // Ignore disconnect errors
                    }
                    clientRef.current = null;
                }
                // Attempt to reconnect
                try {
                    const currentOptions = optionsRef.current;
                    if (currentOptions.username && currentOptions.password) {
                        // Create new client and connect
                        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$telnyx$2b$webrtc$40$2$2e$25$2e$2$2f$node_modules$2f40$telnyx$2f$webrtc$2f$lib$2f$bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TelnyxRTC"]({
                            login: currentOptions.username,
                            password: currentOptions.password,
                            debug: currentOptions.debug
                        });
                        // Re-setup event handlers
                        client.on("telnyx.ready", ()=>{
                            console.log("🎉 WebRTC: Reconnection successful!");
                            setIsConnected(true);
                            setIsConnecting(false);
                            setIsReconnecting(false);
                            setConnectionError(null);
                            setReconnectAttempts(0);
                        });
                        client.on("telnyx.error", (error)=>{
                            console.error("❌ WebRTC: Reconnection error:", error);
                            scheduleReconnect();
                        });
                        client.on("telnyx.socket.error", ()=>{
                            if (shouldReconnectRef.current) {
                                scheduleReconnect();
                            }
                        });
                        client.on("telnyx.socket.close", ()=>{
                            setIsConnected(false);
                            if (shouldReconnectRef.current) {
                                scheduleReconnect();
                            }
                        });
                        clientRef.current = client;
                        await client.connect();
                    }
                } catch (error) {
                    console.error("❌ WebRTC: Reconnection attempt failed:", error);
                // Will be retried by the socket close handler
                }
            }, delay);
            return nextAttempt;
        });
    }, [
        calculateReconnectDelay
    ]);
    /**
	 * Manual reconnect function
	 */ const reconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        console.log("🔄 WebRTC: Manual reconnection requested");
        setReconnectAttempts(0);
        shouldReconnectRef.current = true;
        // Clear existing client
        if (clientRef.current) {
            try {
                clientRef.current.disconnect();
            } catch  {
            // Ignore disconnect errors
            }
            clientRef.current = null;
        }
        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        setIsReconnecting(false);
        // Use the normal connect flow
        const currentOptions = optionsRef.current;
        if (currentOptions.username && currentOptions.password) {
            setIsConnecting(true);
            setConnectionError(null);
            try {
                const client = initializeClient();
                if (client) {
                    await client.connect();
                }
            } catch (error) {
                console.error("❌ WebRTC: Manual reconnection failed:", error);
                setConnectionError(error instanceof Error ? error.message : "Reconnection failed");
                setIsConnecting(false);
            }
        }
    }, []);
    /**
	 * Initialize WebRTC client
	 * Uses ref to avoid circular dependencies
	 */ const initializeClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (clientRef.current) {
            console.log("🔧 WebRTC: Reusing existing client instance");
            return clientRef.current;
        }
        const currentOptions = optionsRef.current;
        const hasCredentials = Boolean(currentOptions.username) && Boolean(currentOptions.password);
        console.log("🔧 WebRTC: Initializing client with credentials:", {
            hasUsername: Boolean(currentOptions.username),
            hasPassword: Boolean(currentOptions.password),
            username: currentOptions.username,
            debug: currentOptions.debug
        });
        if (!hasCredentials) {
            console.error("❌ WebRTC: Missing credentials, cannot initialize");
            // Don't initialize if credentials are missing
            return null;
        }
        console.log("🔧 WebRTC: Creating new TelnyxRTC instance...");
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$telnyx$2b$webrtc$40$2$2e$25$2e$2$2f$node_modules$2f40$telnyx$2f$webrtc$2f$lib$2f$bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TelnyxRTC"]({
            login: currentOptions.username,
            password: currentOptions.password,
            ringtoneFile: undefined,
            ringbackFile: undefined,
            debug: currentOptions.debug
        });
        console.log("🔧 WebRTC: TelnyxRTC instance created, SDK version:", client.version || "unknown");
        // Handle ready event
        client.on("telnyx.ready", ()=>{
            console.log("🎉 WebRTC: telnyx.ready event - Connection successful!");
            setIsConnected(true);
            setIsConnecting(false);
            setIsReconnecting(false);
            setConnectionError(null);
            setReconnectAttempts(0); // Reset on successful connection
        });
        // Handle error event
        client.on("telnyx.error", (error)=>{
            console.error("❌ WebRTC: telnyx.error event:", error);
            const errorMessage = error?.error?.message || error?.message || error?.description || "Connection error";
            console.error("❌ WebRTC: Error message:", errorMessage);
            setConnectionError(errorMessage);
            setIsConnecting(false);
        });
        // Handle socket error - trigger reconnection
        client.on("telnyx.socket.error", (socketError)=>{
            console.error("❌ WebRTC: telnyx.socket.error event:", socketError);
            setConnectionError("Socket connection failed");
            setIsConnecting(false);
            setIsConnected(false);
            // Trigger auto-reconnection
            if (shouldReconnectRef.current) {
                scheduleReconnect();
            }
        });
        // Handle socket close - trigger reconnection
        client.on("telnyx.socket.close", (closeEvent)=>{
            console.warn("⚠️ WebRTC: telnyx.socket.close event:", closeEvent);
            setIsConnected(false);
            // Trigger auto-reconnection (unless manually disconnected)
            if (shouldReconnectRef.current) {
                scheduleReconnect();
            }
        });
        // Handle incoming call
        client.on("telnyx.notification", (notification)=>{
            console.log("📨 WebRTC notification:", notification.type);
            if (notification.type !== "callUpdate") {
                return;
            }
            const call = notification.call;
            if (!call) {
                // Guard against undefined call object
                console.warn("⚠️ WebRTC: callUpdate notification with undefined call");
                return;
            }
            console.log("📨 WebRTC callUpdate:", {
                callId: call.id,
                state: call.state,
                direction: call.direction,
                cause: call.cause,
                sipCode: call.sipCode
            });
            // Update call state
            const callState = mapTelnyxCallState(call.state);
            const callInfo = {
                id: call.id || "unknown",
                state: callState,
                direction: call.direction === "inbound" ? "inbound" : "outbound",
                remoteNumber: call.remoteNumber || call.to || "Unknown",
                remoteName: call.remoteName,
                localNumber: call.localNumber || "",
                startTime: callState === "active" ? new Date() : undefined,
                duration: 0,
                isMuted: false,
                isHeld: call.state === "held",
                isRecording: false
            };
            setCurrentCall(callInfo);
            activeCallRef.current = call;
            // Notify parent component
            if (call.direction === "inbound" && call.state === "ringing") {
                optionsRef.current.onIncomingCall?.(callInfo);
            }
            // Handle call ended
            if (call.state === "destroy" || call.state === "hangup") {
                optionsRef.current.onCallEnded?.(callInfo);
                setCurrentCall(null);
                activeCallRef.current = null;
            }
        });
        clientRef.current = client;
        return client;
    }, []); // ✅ No dependencies - uses ref
    /**
	 * Connect to Telnyx
	 */ const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            console.log("🔌 WebRTC: Starting connection...");
            setIsConnecting(true);
            setConnectionError(null);
            const client = initializeClient();
            // If client is null (no credentials), silently fail
            if (!client) {
                console.warn("⚠️ WebRTC: No credentials available, aborting connection");
                setIsConnecting(false);
                return;
            }
            console.log("🔌 WebRTC: Client initialized, calling connect()...");
            await client.connect();
            console.log("🔌 WebRTC: client.connect() completed");
        } catch (error) {
            console.error("❌ WebRTC: Connection error in connect():", error);
            setConnectionError(error instanceof Error ? error.message : "Connection failed");
            setIsConnecting(false);
        }
    }, [
        initializeClient
    ]);
    /**
	 * Disconnect from Telnyx
	 */ const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Disable auto-reconnection
        shouldReconnectRef.current = false;
        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (clientRef.current) {
            clientRef.current.disconnect();
            clientRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
        setIsReconnecting(false);
        setReconnectAttempts(0);
        setCurrentCall(null);
        activeCallRef.current = null;
    }, []);
    /**
	 * Make an outbound call
	 */ const makeCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (destination, callerIdNumber)=>{
        // Normalize phone numbers to E.164 format
        const normalizeToE164 = (phone)=>{
            const digits = phone.replace(/\D/g, "");
            if (digits.length === 10) {
                return `+1${digits}`;
            }
            if (digits.length === 11 && digits.startsWith("1")) {
                return `+${digits}`;
            }
            if (digits.length > 10 && !phone.startsWith("+")) {
                return `+${digits}`;
            }
            return phone.startsWith("+") ? phone : `+${digits}`;
        };
        const normalizedDestination = normalizeToE164(destination);
        const normalizedCallerId = callerIdNumber ? normalizeToE164(callerIdNumber) : undefined;
        console.log("📞 WebRTC makeCall:", {
            destination,
            normalizedDestination,
            callerIdNumber,
            normalizedCallerId,
            isConnected,
            hasClient: !!clientRef.current
        });
        if (!(clientRef.current && isConnected)) {
            console.error("❌ WebRTC makeCall: Not connected to Telnyx");
            throw new Error("Not connected to Telnyx");
        }
        try {
            console.log("📞 WebRTC: Calling newCall()...");
            const call = await clientRef.current.newCall({
                destinationNumber: normalizedDestination,
                callerNumber: normalizedCallerId
            });
            console.log("📞 WebRTC: newCall() returned:", {
                callId: call?.id,
                callState: call?.state
            });
            activeCallRef.current = call;
            // Set initial call state immediately
            const callInfo = {
                id: call.id,
                state: "connecting",
                direction: "outbound",
                remoteNumber: destination,
                localNumber: callerIdNumber || "",
                duration: 0,
                isMuted: false,
                isHeld: false,
                isRecording: false
            };
            setCurrentCall(callInfo);
            return call;
        } catch (error) {
            console.error("❌ WebRTC makeCall error:", error);
            throw error;
        }
    }, [
        isConnected
    ]);
    /**
	 * Answer incoming call
	 */ const answerCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to answer");
        }
        await activeCallRef.current.answer();
    }, []);
    /**
	 * End active call
	 */ const endCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to end");
        }
        await activeCallRef.current.hangup();
        setCurrentCall(null);
        activeCallRef.current = null;
    }, []);
    /**
	 * Mute call
	 */ const muteCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to mute");
        }
        await activeCallRef.current.muteAudio();
        setCurrentCall((prev)=>prev ? {
                ...prev,
                isMuted: true
            } : null);
    }, []);
    /**
	 * Unmute call
	 */ const unmuteCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to unmute");
        }
        await activeCallRef.current.unmuteAudio();
        setCurrentCall((prev)=>prev ? {
                ...prev,
                isMuted: false
            } : null);
    }, []);
    /**
	 * Hold call
	 */ const holdCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to hold");
        }
        await activeCallRef.current.hold();
        setCurrentCall((prev)=>prev ? {
                ...prev,
                isHeld: true
            } : null);
    }, []);
    /**
	 * Unhold call
	 */ const unholdCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!activeCallRef.current) {
            throw new Error("No active call to unhold");
        }
        await activeCallRef.current.unhold();
        setCurrentCall((prev)=>prev ? {
                ...prev,
                isHeld: false
            } : null);
    }, []);
    /**
	 * Send DTMF tone
	 */ const sendDTMF = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (digit)=>{
        if (!activeCallRef.current) {
            throw new Error("No active call");
        }
        await activeCallRef.current.dtmf(digit);
    }, []);
    /**
	 * Set audio output device
	 */ const setAudioDevice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (deviceId)=>{
        if (!activeCallRef.current) {
            throw new Error("No active call");
        }
        await activeCallRef.current.setAudioOutDevice(deviceId);
    }, []);
    /**
	 * Load audio devices
	 */ const loadAudioDevices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Check if MediaDevices API is available
        if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return;
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioOutputDevices = devices.filter((d)=>d.kind === "audiooutput");
            setAudioDevices(audioOutputDevices);
        } catch  {
        // Ignore audio device loading errors
        }
    }, []);
    /**
	 * Auto-connect on mount if enabled
	 * Uses ref pattern to prevent infinite loop from dependency chain
	 */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if MediaDevices API is available
        if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return ()=>{
            // No-op cleanup when MediaDevices API is not available
            };
        }
        // Load audio devices on mount
        loadAudioDevices();
        // Listen for device changes
        const deviceChangeHandler = ()=>{
            loadAudioDevices();
        };
        navigator.mediaDevices.addEventListener("devicechange", deviceChangeHandler);
        return ()=>{
            if (navigator.mediaDevices) {
                navigator.mediaDevices.removeEventListener("devicechange", deviceChangeHandler);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // Load audio devices on mount
        loadAudioDevices
    ]); // ✅ Runs once on mount only - loadAudioDevices is stable (useCallback with no deps)
    /**
	 * Separate effect for auto-connect to prevent dependency loop
	 */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (optionsRef.current.autoConnect) {
            connect();
        }
        return ()=>{
            // Cleanup on unmount
            disconnect();
        };
    }, [
        connect,
        disconnect
    ]); // ✅ Runs once - uses ref for options
    return {
        // Connection state
        isConnected,
        isConnecting,
        isReconnecting,
        connectionError,
        reconnectAttempts,
        // Current call
        currentCall,
        // Call actions
        makeCall,
        answerCall,
        endCall,
        muteCall,
        unmuteCall,
        holdCall,
        unholdCall,
        sendDTMF,
        // Connection actions
        connect,
        disconnect,
        reconnect,
        // Audio devices
        audioDevices,
        setAudioDevice
    };
}
/**
 * Map Telnyx call state to our call state
 */ function mapTelnyxCallState(telnyxState) {
    switch(telnyxState){
        case "new":
        case "requesting":
            return "connecting";
        case "trying":
        case "recovering":
        case "ringing":
            return "ringing";
        case "active":
            return "active";
        case "held":
            return "held";
        case "hangup":
        case "destroy":
            return "ended";
        default:
            return "idle";
    }
}
}),
"[project]/apps/web/src/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Toast Hook - Wrapper around Sonner
 *
 * Provides a consistent interface for displaying toast notifications
 * across the application with success, error, loading, and promise states.
 *
 * @example
 * const { toast } = useToast();
 *
 * // Success
 * toast.success("Customer created successfully!");
 *
 * // Error
 * toast.error("Failed to save changes");
 *
 * // Loading
 * const id = toast.loading("Saving...");
 * toast.success("Saved!", { id });
 *
 * // Promise
 * toast.promise(createCustomer(data), {
 *   loading: "Creating customer...",
 *   success: "Customer created!",
 *   error: "Failed to create customer"
 * });
 */ __turbopack_context__.s([
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
function useToast() {
    return {
        toast: {
            success: (message, options)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, {
                    duration: 3000,
                    ...options
                }),
            error: (message, options)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message, {
                    duration: 5000,
                    ...options
                }),
            loading: (message, options)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(message, options),
            info: (message, options)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(message, {
                    duration: 3000,
                    ...options
                }),
            warning: (message, options)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warning(message, {
                    duration: 4000,
                    ...options
                }),
            promise: (promise, messages)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].promise(promise, messages),
            dismiss: (id)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].dismiss(id);
            },
            // Shorthand for Server Action responses
            fromActionResult: (result)=>{
                if (result.success) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(result.message || "Operation completed successfully");
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(result.error || "Operation failed");
                }
            }
        }
    };
}
}),
];

//# sourceMappingURL=apps_web_src_e34c88c8._.js.map