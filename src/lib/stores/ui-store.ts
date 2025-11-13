import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * Modal state
 */
type ModalState = {
  isOpen: boolean;
  type: string | null;
  data?: unknown;
};

/**
 * Participant type
 */
type Participant = {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
};

/**
 * Call state
 */
type CallState = {
  status: "idle" | "incoming" | "active" | "ended";
  caller: {
    number: string;
    name: string;
    avatar?: string;
  } | null;
  startTime: number | null;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";
  isLocalVideoEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  // Enhanced features
  isScreenSharing: boolean;
  connectionQuality: "excellent" | "good" | "poor";
  hasVirtualBackground: boolean;
  reactions: Array<{
    id: string;
    type: "thumbs-up" | "clap" | "heart" | "tada";
    timestamp: number;
  }>;
  chatMessages: Array<{
    id: string;
    sender: "me" | "them";
    message: string;
    timestamp: number;
  }>;
  participants: Participant[];
  meetingLink: string;
};

/**
 * UI store state
 * Note: Theme management moved to next-themes provider
 */
type UIState = {
  sidebarOpen: boolean;
  modals: Record<string, ModalState>;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }>;
  call: CallState;
};

/**
 * UI store actions
 * Note: setTheme removed - use next-themes' useTheme hook instead
 */
type UIActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: string, data?: unknown) => void;
  closeModal: (type: string) => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  // Call actions
  setIncomingCall: (caller: CallState["caller"]) => void;
  answerCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  toggleRecording: () => void;
  // Video actions
  requestVideo: () => void;
  acceptVideo: () => void;
  declineVideo: () => void;
  endVideo: () => void;
  toggleLocalVideo: () => void;
  // Enhanced features
  toggleScreenShare: () => void;
  toggleVirtualBackground: () => void;
  addReaction: (type: CallState["reactions"][0]["type"]) => void;
  clearReactions: () => void;
  sendChatMessage: (message: string) => void;
  clearChat: () => void;
  setConnectionQuality: (quality: CallState["connectionQuality"]) => void;
  reset: () => void;
};

/**
 * Complete UI store
 */
export type UIStore = UIState & UIActions;

/**
 * Initial state
 */
const initialState: UIState = {
  sidebarOpen: true,
  modals: {},
  notifications: [],
  call: {
    status: "idle",
    caller: null,
    startTime: null,
    isMuted: false,
    isOnHold: false,
    isRecording: false,
    videoStatus: "off",
    isLocalVideoEnabled: false,
    isRemoteVideoEnabled: false,
    isScreenSharing: false,
    connectionQuality: "excellent",
    hasVirtualBackground: false,
    reactions: [],
    chatMessages: [],
    participants: [],
    meetingLink: "https://meet.stratos.app/abc-defg-hij",
  },
};

/**
 * UI store - manages application UI state
 *
 * @example
 * ```tsx
 * import { useUIStore } from "@/lib/stores/ui-store";
 * import { useTheme } from "next-themes";
 *
 * function Header() {
 *   const { sidebarOpen, toggleSidebar } = useUIStore();
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <header>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *       <button onClick={() => setTheme("dark")}>Dark</button>
 *     </header>
 *   );
 * }
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        toggleSidebar: () =>
          set(
            (state) => {
              state.sidebarOpen = !state.sidebarOpen;
            },
            false,
            "toggleSidebar"
          ),

        setSidebarOpen: (open) =>
          set(
            (state) => {
              state.sidebarOpen = open;
            },
            false,
            "setSidebarOpen"
          ),

        openModal: (type, data) =>
          set(
            (state) => {
              state.modals[type] = {
                isOpen: true,
                type,
                data,
              };
            },
            false,
            "openModal"
          ),

        closeModal: (type) =>
          set(
            (state) => {
              if (state.modals[type]) {
                state.modals[type].isOpen = false;
              }
            },
            false,
            "closeModal"
          ),

        addNotification: (notification) =>
          set(
            (state) => {
              const id = crypto.randomUUID();
              state.notifications.push({ ...notification, id });

              // Auto-remove after duration
              if (notification.duration) {
                setTimeout(() => {
                  set(
                    (currentState) => {
                      currentState.notifications =
                        currentState.notifications.filter((n) => n.id !== id);
                    },
                    false,
                    "autoRemoveNotification"
                  );
                }, notification.duration);
              }
            },
            false,
            "addNotification"
          ),

        removeNotification: (id) =>
          set(
            (state) => {
              state.notifications = state.notifications.filter(
                (n) => n.id !== id
              );
            },
            false,
            "removeNotification"
          ),

        // Call actions
        setIncomingCall: (caller) =>
          set(
            (state) => {
              state.call.caller = caller;
              state.call.status = "incoming";
              state.call.startTime = Date.now();
            },
            false,
            "setIncomingCall"
          ),

        answerCall: () =>
          set(
            (state) => {
              if (state.call.status === "incoming") {
                state.call.status = "active";
                state.call.startTime = Date.now();
                // Add mock participants for testing
                state.call.participants = [
                  {
                    id: "1",
                    name: "Sarah Johnson",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: true,
                    isScreenSharing: false,
                  },
                  {
                    id: "2",
                    name: "Michael Chen",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "3",
                    name: "Emily Rodriguez",
                    isMuted: true,
                    isVideoEnabled: false,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "4",
                    name: "David Kim",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "5",
                    name: "Lisa Anderson",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "6",
                    name: "James Wilson",
                    isMuted: true,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "7",
                    name: "Maria Garcia",
                    isMuted: false,
                    isVideoEnabled: false,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "8",
                    name: "Robert Taylor",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                  {
                    id: "9",
                    name: "Jennifer Lee",
                    isMuted: false,
                    isVideoEnabled: true,
                    isSpeaking: false,
                    isScreenSharing: false,
                  },
                ];
              }
            },
            false,
            "answerCall"
          ),

        endCall: () =>
          set(
            (state) => {
              state.call.status = "ended";
              state.call.caller = null;
              state.call.startTime = null;
              state.call.isMuted = false;
              state.call.isOnHold = false;
              state.call.isRecording = false;
              state.call.videoStatus = "off";
              state.call.isLocalVideoEnabled = false;
              state.call.isRemoteVideoEnabled = false;
              state.call.isScreenSharing = false;
              state.call.connectionQuality = "excellent";
              state.call.hasVirtualBackground = false;
              state.call.reactions = [];
              state.call.chatMessages = [];
              state.call.participants = [];
            },
            false,
            "endCall"
          ),

        toggleMute: () =>
          set(
            (state) => {
              state.call.isMuted = !state.call.isMuted;
            },
            false,
            "toggleMute"
          ),

        toggleHold: () =>
          set(
            (state) => {
              state.call.isOnHold = !state.call.isOnHold;
            },
            false,
            "toggleHold"
          ),

        toggleRecording: () =>
          set(
            (state) => {
              state.call.isRecording = !state.call.isRecording;
            },
            false,
            "toggleRecording"
          ),

        // Video actions
        requestVideo: () =>
          set(
            (state) => {
              state.call.videoStatus = "requesting";
              state.call.isLocalVideoEnabled = true;
              // Simulate other party seeing the request
              setTimeout(() => {
                set(
                  (currentState) => {
                    if (currentState.call.videoStatus === "requesting") {
                      currentState.call.videoStatus = "ringing";
                    }
                  },
                  false,
                  "videoRinging"
                );
                // Auto-accept after 3 seconds for demo
                setTimeout(() => {
                  set(
                    (currentState) => {
                      if (currentState.call.videoStatus === "ringing") {
                        currentState.call.videoStatus = "connected";
                        currentState.call.isRemoteVideoEnabled = true;
                      }
                    },
                    false,
                    "videoAutoAccept"
                  );
                }, 3000);
              }, 1000);
            },
            false,
            "requestVideo"
          ),

        acceptVideo: () =>
          set(
            (state) => {
              state.call.videoStatus = "connected";
              state.call.isLocalVideoEnabled = true;
              state.call.isRemoteVideoEnabled = true;
            },
            false,
            "acceptVideo"
          ),

        declineVideo: () =>
          set(
            (state) => {
              state.call.videoStatus = "declined";
              state.call.isLocalVideoEnabled = false;
              state.call.isRemoteVideoEnabled = false;
              // Reset to off after 2 seconds
              setTimeout(() => {
                set(
                  (currentState) => {
                    currentState.call.videoStatus = "off";
                  },
                  false,
                  "videoResetAfterDecline"
                );
              }, 2000);
            },
            false,
            "declineVideo"
          ),

        endVideo: () =>
          set(
            (state) => {
              state.call.videoStatus = "off";
              state.call.isLocalVideoEnabled = false;
              state.call.isRemoteVideoEnabled = false;
            },
            false,
            "endVideo"
          ),

        toggleLocalVideo: () =>
          set(
            (state) => {
              state.call.isLocalVideoEnabled = !state.call.isLocalVideoEnabled;
            },
            false,
            "toggleLocalVideo"
          ),

        // Enhanced feature actions
        toggleScreenShare: () =>
          set(
            (state) => {
              state.call.isScreenSharing = !state.call.isScreenSharing;
            },
            false,
            "toggleScreenShare"
          ),

        toggleVirtualBackground: () =>
          set(
            (state) => {
              state.call.hasVirtualBackground =
                !state.call.hasVirtualBackground;
            },
            false,
            "toggleVirtualBackground"
          ),

        addReaction: (type) =>
          set(
            (state) => {
              const reaction = {
                id: Math.random().toString(36).slice(2, 9),
                type,
                timestamp: Date.now(),
              };
              state.call.reactions.push(reaction);
              // Auto-remove reaction after 3 seconds
              setTimeout(() => {
                set(
                  (currentState) => {
                    const index = currentState.call.reactions.findIndex(
                      (r) => r.id === reaction.id
                    );
                    if (index !== -1) {
                      currentState.call.reactions.splice(index, 1);
                    }
                  },
                  false,
                  "removeReaction"
                );
              }, 3000);
            },
            false,
            "addReaction"
          ),

        clearReactions: () =>
          set(
            (state) => {
              state.call.reactions = [];
            },
            false,
            "clearReactions"
          ),

        sendChatMessage: (message) =>
          set(
            (state) => {
              state.call.chatMessages.push({
                id: Math.random().toString(36).slice(2, 9),
                sender: "me",
                message,
                timestamp: Date.now(),
              });
            },
            false,
            "sendChatMessage"
          ),

        clearChat: () =>
          set(
            (state) => {
              state.call.chatMessages = [];
            },
            false,
            "clearChat"
          ),

        setConnectionQuality: (quality) =>
          set(
            (state) => {
              state.call.connectionQuality = quality;
            },
            false,
            "setConnectionQuality"
          ),

        reset: () => set(initialState, false, "reset"),
      })),
      {
        name: "ui-store",
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: "UIStore" }
  )
);

/**
 * Selectors for optimized component re-renders
 * Note: theme selector removed - use next-themes' useTheme hook instead
 */
export const uiSelectors = {
  sidebarOpen: (state: UIStore) => state.sidebarOpen,
  modals: (state: UIStore) => state.modals,
  notifications: (state: UIStore) => state.notifications,
  getModal: (type: string) => (state: UIStore) => state.modals[type],
  call: (state: UIStore) => state.call,
  callStatus: (state: UIStore) => state.call.status,
  caller: (state: UIStore) => state.call.caller,
};
