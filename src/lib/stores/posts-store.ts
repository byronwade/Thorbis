import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Post } from "@/lib/db/schema";

/**
 * Posts store state
 */
type PostsState = {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    published?: boolean;
    authorId?: string;
  };
};

/**
 * Posts store actions
 */
type PostsActions = {
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  setSelectedPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PostsState["filters"]>) => void;
  clearFilters: () => void;
  getFilteredPosts: () => Post[];
  reset: () => void;
};

/**
 * Complete posts store
 */
export type PostsStore = PostsState & PostsActions;

/**
 * Initial state
 */
const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  filters: {},
};

/**
 * Posts store - manages posts state
 *
 * @example
 * ```tsx
 * import { usePostsStore } from "@/lib/stores/posts-store";
 *
 * function PostsList() {
 *   const posts = usePostsStore((state) => state.getFilteredPosts());
 *   const setFilters = usePostsStore((state) => state.setFilters);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setFilters({ published: true })}>
 *         Published Only
 *       </button>
 *       {posts.map(post => (
 *         <PostCard key={post.id} post={post} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const usePostsStore = create<PostsStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setPosts: (posts) =>
        set(
          (state) => {
            state.posts = posts;
            state.isLoading = false;
            state.error = null;
          },
          false,
          "setPosts"
        ),

      addPost: (post) =>
        set(
          (state) => {
            state.posts.unshift(post);
          },
          false,
          "addPost"
        ),

      updatePost: (id, updates) =>
        set(
          (state) => {
            const index = state.posts.findIndex((p) => p.id === id);
            if (index !== -1) {
              state.posts[index] = { ...state.posts[index], ...updates };
            }
            if (state.selectedPost?.id === id) {
              state.selectedPost = { ...state.selectedPost, ...updates };
            }
          },
          false,
          "updatePost"
        ),

      deletePost: (id) =>
        set(
          (state) => {
            state.posts = state.posts.filter((p) => p.id !== id);
            if (state.selectedPost?.id === id) {
              state.selectedPost = null;
            }
          },
          false,
          "deletePost"
        ),

      setSelectedPost: (post) =>
        set(
          (state) => {
            state.selectedPost = post;
          },
          false,
          "setSelectedPost"
        ),

      setLoading: (loading) =>
        set(
          (state) => {
            state.isLoading = loading;
          },
          false,
          "setLoading"
        ),

      setError: (error) =>
        set(
          (state) => {
            state.error = error;
            state.isLoading = false;
          },
          false,
          "setError"
        ),

      setFilters: (filters) =>
        set(
          (state) => {
            state.filters = { ...state.filters, ...filters };
          },
          false,
          "setFilters"
        ),

      clearFilters: () =>
        set(
          (state) => {
            state.filters = {};
          },
          false,
          "clearFilters"
        ),

      getFilteredPosts: () => {
        const { posts, filters } = get();
        let filtered = [...posts];

        if (filters.published !== undefined) {
          filtered = filtered.filter(
            (p) => (p.published === "true") === filters.published
          );
        }

        if (filters.authorId) {
          filtered = filtered.filter((p) => p.authorId === filters.authorId);
        }

        return filtered;
      },

      reset: () => set(initialState, false, "reset"),
    })),
    { name: "PostsStore" }
  )
);

/**
 * Selectors for optimized component re-renders
 */
export const postsSelectors = {
  posts: (state: PostsStore) => state.posts,
  selectedPost: (state: PostsStore) => state.selectedPost,
  isLoading: (state: PostsStore) => state.isLoading,
  error: (state: PostsStore) => state.error,
  filters: (state: PostsStore) => state.filters,
  publishedPosts: (state: PostsStore) =>
    state.posts.filter((p) => p.published === "true"),
  draftPosts: (state: PostsStore) =>
    state.posts.filter((p) => p.published === "false"),
};

