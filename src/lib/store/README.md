# Zustand State Management

This project uses **Zustand** for lightweight, flexible state management.

## Features

- 🪶 **Lightweight** - Minimal bundle size (< 1KB)
- 🔥 **Fast** - No unnecessary re-renders
- 🎯 **TypeScript** - Full type safety
- 💾 **Persistence** - Auto-save to localStorage
- 🛠 **DevTools** - Redux DevTools integration
- 🧊 **Immer** - Immutable updates made easy

## Available Stores

### User Store
Manages authentication and user data.

```typescript
import { useUserStore } from "@/lib/store";

function Profile() {
  const { user, isAuthenticated } = useUserStore();
  const { setUser, logout } = useUserStore();

  return <div>Hello {user?.name}</div>;
}
```

**State:**
- `user` - Current user object
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state

**Actions:**
- `setUser(user)` - Set current user
- `updateUser(updates)` - Update user fields
- `logout()` - Clear user and logout
- `setLoading(bool)` - Set loading state
- `reset()` - Reset to initial state

### UI Store
Manages UI state (theme, modals, notifications, sidebar).

```typescript
import { useUIStore } from "@/lib/store";

function Header() {
  const { theme, sidebarOpen } = useUIStore();
  const { setTheme, toggleSidebar } = useUIStore();

  return (
    <header>
      <button onClick={toggleSidebar}>Menu</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </header>
  );
}
```

**State:**
- `theme` - Current theme (light/dark/system)
- `sidebarOpen` - Sidebar visibility
- `modals` - Modal states by type
- `notifications` - Active notifications

**Actions:**
- `setTheme(theme)` - Change theme
- `toggleSidebar()` - Toggle sidebar
- `setSidebarOpen(bool)` - Set sidebar state
- `openModal(type, data)` - Open modal with data
- `closeModal(type)` - Close modal
- `addNotification(notif)` - Show notification
- `removeNotification(id)` - Dismiss notification
- `reset()` - Reset to initial state

### Posts Store
Manages posts data and filtering.

```typescript
import { usePostsStore } from "@/lib/store";

function BlogList() {
  const posts = usePostsStore((state) => state.getFilteredPosts());
  const { setFilters, updatePost } = usePostsStore();

  return (
    <div>
      <button onClick={() => setFilters({ published: true })}>
        Published Only
      </button>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**State:**
- `posts` - All posts array
- `selectedPost` - Currently selected post
- `isLoading` - Loading state
- `error` - Error message
- `filters` - Current filters

**Actions:**
- `setPosts(posts)` - Set all posts
- `addPost(post)` - Add new post
- `updatePost(id, updates)` - Update post
- `deletePost(id)` - Delete post
- `setSelectedPost(post)` - Select post
- `setFilters(filters)` - Apply filters
- `clearFilters()` - Clear all filters
- `getFilteredPosts()` - Get filtered posts
- `reset()` - Reset to initial state

## Custom Hooks

### useAuth()
Check authentication status.

```typescript
function ProtectedPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Dashboard user={user} />;
}
```

### useModal(type)
Manage modal state.

```typescript
function LoginButton() {
  const { isOpen, open, close, data } = useModal("login");

  return (
    <>
      <button onClick={() => open({ email: "pre@filled.com" })}>
        Login
      </button>
      <Modal isOpen={isOpen} onClose={close}>
        <LoginForm initialData={data} />
      </Modal>
    </>
  );
}
```

### useNotifications()
Show toast notifications.

```typescript
function SaveButton() {
  const { success, error, info, warning } = useNotifications();

  const handleSave = async () => {
    try {
      await saveData();
      success("Saved successfully!");
    } catch (err) {
      error("Failed to save");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### useStoreHydration()
Wait for persisted stores to load.

```typescript
function App() {
  const hasHydrated = useStoreHydration();

  if (!hasHydrated) return <SplashScreen />;
  return <MainApp />;
}
```

### usePublishedPosts()
Get only published posts.

```typescript
function PublicBlog() {
  const posts = usePublishedPosts();

  return (
    <div>
      {posts.map(post => (
        <Article key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Use Selectors for Performance
Only subscribe to what you need to avoid re-renders.

```typescript
// ❌ Bad - component re-renders when ANY store value changes
const store = useUserStore();

// ✅ Good - only re-renders when user.name changes
const userName = useUserStore((state) => state.user?.name);
```

### 2. Use Provided Selectors
Pre-defined selectors are optimized and type-safe.

```typescript
import { useUserStore, userSelectors } from "@/lib/store";

// ✅ Use provided selectors
const user = useUserStore(userSelectors.user);
const isAuth = useUserStore(userSelectors.isAuthenticated);
```

### 3. Batch Actions
Combine multiple updates to minimize re-renders.

```typescript
// ❌ Bad - triggers 2 re-renders
setUser(newUser);
setLoading(false);

// ✅ Good - single re-render
useUserStore.setState({
  user: newUser,
  isLoading: false
});
```

### 4. Use Immer for Complex Updates
Immer is already configured, so mutate drafts freely.

```typescript
updatePost: (id, updates) =>
  set((state) => {
    // Mutate the draft state directly
    const post = state.posts.find(p => p.id === id);
    if (post) {
      post.title = updates.title;
      post.content = updates.content;
    }
  }, false, "updatePost"),
```

### 5. Reset State on Logout
Clear sensitive data when user logs out.

```typescript
import { resetAllStores } from "@/lib/store";

function logout() {
  // Clear all stores
  resetAllStores();

  // Redirect to login
  router.push("/login");
}
```

## Creating New Stores

### 1. Define Types

```typescript
interface MyState {
  data: string[];
  isLoading: boolean;
}

interface MyActions {
  setData: (data: string[]) => void;
  reset: () => void;
}

export type MyStore = MyState & MyActions;
```

### 2. Create Store

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState: MyState = {
  data: [],
  isLoading: false,
};

export const useMyStore = create<MyStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setData: (data) =>
          set(
            (state) => {
              state.data = data;
              state.isLoading = false;
            },
            false,
            "setData"
          ),

        reset: () => set(initialState, false, "reset"),
      })),
      {
        name: "my-store",
        partialize: (state) => ({ data: state.data }),
      }
    ),
    { name: "MyStore" }
  )
);
```

### 3. Add Selectors

```typescript
export const mySelectors = {
  data: (state: MyStore) => state.data,
  isLoading: (state: MyStore) => state.isLoading,
};
```

### 4. Export from Index

```typescript
// lib/store/index.ts
export { useMyStore, mySelectors } from "./my-store";
export type { MyStore } from "./my-store";
```

## Debugging

### Redux DevTools
Open Redux DevTools in your browser to:
- Inspect current state
- View action history
- Time-travel debug
- Export/import state

### Console Logging

```typescript
// Log state changes
useUserStore.subscribe((state) => {
  console.log("User state changed:", state);
});

// Get current state
console.log(useUserStore.getState());
```

### Reset State

```typescript
// Reset individual store
useUserStore.getState().reset();

// Reset all stores
import { resetAllStores } from "@/lib/store";
resetAllStores();
```

## Persistence

Stores with `persist` middleware auto-save to localStorage.

**Configured stores:**
- `user-store` - Saves user and auth state
- `ui-store` - Saves theme and sidebar preferences

**Non-persisted stores:**
- `posts-store` - Reloads from API on mount

### Clear Persisted Data

```typescript
// Clear specific store
useUserStore.persist.clearStorage();

// Clear all localStorage
localStorage.clear();
```

## Resources

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Immer Docs](https://immerjs.github.io/immer/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
