import { useEffect, useState } from "react";
import { usePostsStore } from "./posts-store";
import { useUIStore } from "./ui-store";
import { useUserStore } from "./user-store";

/**
 * Hook to ensure stores are hydrated before rendering
 * Prevents hydration mismatches with persisted stores
 *
 * @example
 * ```tsx
 * function App() {
 *   const hasHydrated = useStoreHydration();
 *
 *   if (!hasHydrated) return <Loading />;
 *   return <MainApp />;
 * }
 * ```
 */
export function useStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Wait for stores to hydrate
    const unsubUser = useUserStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    const unsubUI = useUIStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Check if already hydrated
    if (
      useUserStore.persist.hasHydrated() &&
      useUIStore.persist.hasHydrated()
    ) {
      setHasHydrated(true);
    }

    return () => {
      unsubUser();
      unsubUI();
    };
  }, []);

  return hasHydrated;
}

/**
 * Hook to check if user is authenticated
 * Returns authentication status and user data
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { isAuthenticated, user, isLoading } = useAuth();
 *
 *   if (isLoading) return <Loading />;
 *   if (!isAuthenticated) return <Navigate to="/login" />;
 *   return <div>Welcome {user.name}</div>;
 * }
 * ```
 */
export function useAuth() {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);

  return { user, isAuthenticated, isLoading };
}

/**
 * Hook to manage modal state
 * Returns modal state and actions for a specific modal type
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { isOpen, open, close } = useModal("login");
 *
 *   return (
 *     <>
 *       <button onClick={open}>Login</button>
 *       <Modal isOpen={isOpen} onClose={close}>
 *         <LoginForm />
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
export function useModal(type: string) {
  const modal = useUIStore((state) => state.modals[type]);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  return {
    isOpen: modal?.isOpen ?? false,
    data: modal?.data,
    open: (data?: unknown) => openModal(type, data),
    close: () => closeModal(type),
  };
}

/**
 * Hook to manage notifications
 * Returns methods to show notifications with auto-dismiss
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { success, error } = useNotifications();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       success("Data saved successfully!");
 *     } catch (err) {
 *       error("Failed to save data");
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useNotifications() {
  const addNotification = useUIStore((state) => state.addNotification);

  return {
    success: (message: string, duration = 3000) =>
      addNotification({ type: "success", message, duration }),
    error: (message: string, duration = 5000) =>
      addNotification({ type: "error", message, duration }),
    info: (message: string, duration = 3000) =>
      addNotification({ type: "info", message, duration }),
    warning: (message: string, duration = 4000) =>
      addNotification({ type: "warning", message, duration }),
  };
}

/**
 * Hook to get published posts only
 * Useful for public pages
 *
 * @example
 * ```tsx
 * function BlogPage() {
 *   const posts = usePublishedPosts();
 *
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <PostCard key={post.id} post={post} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePublishedPosts() {
  return usePostsStore((state) =>
    state.posts.filter((p) => p.published === "true")
  );
}

/**
 * Hook to check if sidebar should be shown
 * Combines sidebar state with responsive breakpoint
 *
 * @example
 * ```tsx
 * function Layout() {
 *   const showSidebar = useShowSidebar();
 *
 *   return (
 *     <div>
 *       {showSidebar && <Sidebar />}
 *       <Main />
 *     </div>
 *   );
 * }
 * ```
 */
export function useShowSidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return sidebarOpen && !isMobile;
}
