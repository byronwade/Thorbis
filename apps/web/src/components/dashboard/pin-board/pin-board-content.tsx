"use client";

import {
	Briefcase,
	FileText,
	Folder,
	GraduationCap,
	Megaphone,
	Pin,
	Plus,
	Search,
	Users,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PinBoardCategory, PinBoardPost } from "@/lib/queries/pin-board";
import { PinBoardEditorDialog } from "./pin-board-editor";
import { PinBoardPostCard } from "./pin-board-post-card";

// Icon mapping for categories
const CATEGORY_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	"file-text": FileText,
	users: Users,
	briefcase: Briefcase,
	megaphone: Megaphone,
	"graduation-cap": GraduationCap,
	folder: Folder,
};

// Color mapping for category badges
const CATEGORY_COLORS: Record<string, string> = {
	blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
	green:
		"bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
	purple:
		"bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20",
	orange:
		"bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20",
	cyan: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20",
	red: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
	yellow:
		"bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20",
};

interface PinBoardContentProps {
	categories: PinBoardCategory[];
	posts: PinBoardPost[];
	categoryStats: Record<string, number>;
	companyId: string;
}

export function PinBoardContent({
	categories,
	posts,
	categoryStats,
	companyId,
}: PinBoardContentProps) {
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<PinBoardPost | null>(null);

	// Filter posts by category and search
	const filteredPosts = useMemo(() => {
		let filtered = posts;

		// Filter by category
		if (activeCategory) {
			filtered = filtered.filter(
				(post) => post.category?.slug === activeCategory,
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(query) ||
					post.excerpt?.toLowerCase().includes(query) ||
					post.content?.toLowerCase().includes(query),
			);
		}

		return filtered;
	}, [posts, activeCategory, searchQuery]);

	// Separate pinned and unpinned posts
	const pinnedPosts = filteredPosts.filter((post) => post.is_pinned);
	const regularPosts = filteredPosts.filter((post) => !post.is_pinned);

	const handleNewPost = () => {
		setEditingPost(null);
		setIsEditorOpen(true);
	};

	const handleEditPost = (post: PinBoardPost) => {
		setEditingPost(post);
		setIsEditorOpen(true);
	};

	return (
		<div className="bg-card/50 border-border/50 backdrop-blur-sm rounded-xl border overflow-hidden">
			{/* Header */}
			<div className="p-6 border-b border-border/50">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Pin className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-semibold">Content Portal</h2>
							<p className="text-sm text-muted-foreground">
								SOPs, resources, and company announcements
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search posts..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 w-64"
							/>
							{searchQuery && (
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
									onClick={() => setSearchQuery("")}
								>
									<X className="h-3 w-3" />
								</Button>
							)}
						</div>
						<Button onClick={handleNewPost} size="sm">
							<Plus className="h-4 w-4 mr-1" />
							New Post
						</Button>
					</div>
				</div>

				{/* Category Tabs */}
				<div className="mt-4 -mx-2 px-2 overflow-x-auto">
					<div className="flex items-center gap-2 pb-2">
						<Button
							variant={activeCategory === null ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveCategory(null)}
							className="shrink-0"
						>
							All
							<Badge
								variant="secondary"
								className="ml-2 h-5 px-1.5 text-[10px]"
							>
								{categoryStats.all || 0}
							</Badge>
						</Button>
						{categories.map((category) => {
							const Icon = CATEGORY_ICONS[category.icon] || Folder;
							const colorClass =
								CATEGORY_COLORS[category.color] || CATEGORY_COLORS.blue;
							const count = categoryStats[category.id] || 0;

							return (
								<Button
									key={category.id}
									variant={
										activeCategory === category.slug ? "default" : "outline"
									}
									size="sm"
									onClick={() => setActiveCategory(category.slug)}
									className="shrink-0"
								>
									<Icon className="h-3.5 w-3.5 mr-1.5" />
									{category.name}
									{count > 0 && (
										<Badge
											variant="secondary"
											className={`ml-2 h-5 px-1.5 text-[10px] ${
												activeCategory === category.slug ? "" : colorClass
											}`}
										>
											{count}
										</Badge>
									)}
								</Button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-6">
				{filteredPosts.length === 0 ? (
					<div className="text-center py-12">
						<div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
							<FileText className="h-6 w-6 text-muted-foreground" />
						</div>
						<h3 className="font-medium text-muted-foreground mb-1">
							{searchQuery ? "No results found" : "No posts yet"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{searchQuery
								? "Try adjusting your search terms"
								: "Create your first post to share with your team"}
						</p>
						{!searchQuery && (
							<Button onClick={handleNewPost} className="mt-4" size="sm">
								<Plus className="h-4 w-4 mr-1" />
								Create First Post
							</Button>
						)}
					</div>
				) : (
					<div className="space-y-6">
						{/* Pinned Posts */}
						{pinnedPosts.length > 0 && (
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
									<Pin className="h-3.5 w-3.5" />
									Pinned
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{pinnedPosts.map((post) => (
										<PinBoardPostCard
											key={post.id}
											post={post}
											onEdit={() => handleEditPost(post)}
										/>
									))}
								</div>
							</div>
						)}

						{/* Regular Posts */}
						{regularPosts.length > 0 && (
							<div className="space-y-3">
								{pinnedPosts.length > 0 && (
									<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
										<FileText className="h-3.5 w-3.5" />
										Recent
									</div>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{regularPosts.map((post) => (
										<PinBoardPostCard
											key={post.id}
											post={post}
											onEdit={() => handleEditPost(post)}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Editor Dialog */}
			<PinBoardEditorDialog
				open={isEditorOpen}
				onOpenChange={setIsEditorOpen}
				post={editingPost}
				categories={categories}
			/>
		</div>
	);
}
