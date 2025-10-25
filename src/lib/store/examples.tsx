/**
 * Example components demonstrating Zustand store usage
 * These are reference implementations - copy patterns to your components
 */

"use client";

import { useAuth, useModal, useNotifications } from "./hooks";
import { usePostsStore, useUIStore, useUserStore } from "./index";

/**
 * Example: Authentication Status
 */
export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}

/**
 * Example: Theme Switcher
 */
export function ThemeSwitcher() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  return (
    <div>
      <button
        disabled={theme === "light"}
        onClick={() => setTheme("light")}
        type="button"
      >
        Light
      </button>
      <button
        disabled={theme === "dark"}
        onClick={() => setTheme("dark")}
        type="button"
      >
        Dark
      </button>
      <button
        disabled={theme === "system"}
        onClick={() => setTheme("system")}
        type="button"
      >
        System
      </button>
    </div>
  );
}

/**
 * Example: Modal Management
 */
export function LoginModal() {
  const { isOpen, open, close } = useModal("login");

  return (
    <>
      <button onClick={() => open({ source: "header" })} type="button">
        Login
      </button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Login</h2>
            <button onClick={close} type="button">
              Close
            </button>
            {/* Your login form here */}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Example: Notifications
 */
export function SaveButton() {
  const { success, error } = useNotifications();

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success("Data saved successfully!");
    } catch (_err) {
      error("Failed to save data");
    }
  };

  return (
    <button onClick={handleSave} type="button">
      Save
    </button>
  );
}

/**
 * Example: Posts List with Filters
 */
export function PostsList() {
  const posts = usePostsStore((state) => state.getFilteredPosts());
  const filters = usePostsStore((state) => state.filters);
  const setFilters = usePostsStore((state) => state.setFilters);
  const clearFilters = usePostsStore((state) => state.clearFilters);

  return (
    <div>
      <div>
        <button
          disabled={filters.published === true}
          onClick={() => setFilters({ published: true })}
          type="button"
        >
          Published
        </button>
        <button
          disabled={filters.published === false}
          onClick={() => setFilters({ published: false })}
          type="button"
        >
          Drafts
        </button>
        <button onClick={clearFilters} type="button">
          All
        </button>
      </div>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <span>{post.published === "true" ? "Published" : "Draft"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example: Optimized Component (Only re-renders when userName changes)
 */
export function UserGreeting() {
  // Only subscribes to user.name, not entire user object
  const userName = useUserStore((state) => state.user?.name);

  return <h1>Hello, {userName || "Guest"}!</h1>;
}

/**
 * Example: Sidebar Toggle
 */
export function SidebarToggle() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <button onClick={toggleSidebar} type="button">
      {sidebarOpen ? "Close" : "Open"} Sidebar
    </button>
  );
}

/**
 * Example: Post Editor with Optimistic Updates
 */
export function PostEditor({ postId }: { postId: string }) {
  const post = usePostsStore((state) =>
    state.posts.find((p) => p.id === postId)
  );
  const updatePost = usePostsStore((state) => state.updatePost);
  const { success, error } = useNotifications();

  const handleSave = async (title: string, content: string) => {
    // Optimistic update
    updatePost(postId, { title, content });

    try {
      // API call
      await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content }),
      });
      success("Post updated!");
    } catch (_err) {
      // Revert on error
      updatePost(postId, { title: post?.title, content: post?.content });
      error("Failed to update post");
    }
  };

  if (!post) {
    return null;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSave(
          formData.get("title") as string,
          formData.get("content") as string
        );
      }}
    >
      <input defaultValue={post.title} name="title" type="text" />
      <textarea defaultValue={post.content} name="content" />
      <button type="submit">Save</button>
    </form>
  );
}

/**
 * Example: Batch Updates
 */
export function BatchUpdateExample() {
  const { success } = useNotifications();

  const handleBatchUpdate = () => {
    // Single state update instead of multiple
    useUserStore.setState({
      user: { id: "1", name: "John", email: "john@example.com" } as any,
      isAuthenticated: true,
      isLoading: false,
    });

    success("Profile updated!");
  };

  return (
    <button onClick={handleBatchUpdate} type="button">
      Update Profile
    </button>
  );
}

/**
 * Example: Using Store Outside Components
 */
export async function exampleAPICall() {
  // You can access stores outside React components
  const { setLoading, setUser } = useUserStore.getState();

  setLoading(true);

  try {
    const response = await fetch("/api/user");
    const user = await response.json();

    setUser(user);
  } catch (_err) {
    // Handle error
    setUser(null);
  } finally {
    setLoading(false);
  }
}
