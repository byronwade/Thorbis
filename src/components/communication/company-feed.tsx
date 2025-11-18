"use client";

import {
	Bookmark,
	Calendar,
	Edit,
	FileText,
	Filter,
	Flag,
	Hash,
	Heart,
	Image as ImageIcon,
	MessageCircle,
	MoreHorizontal,
	Pin,
	Search,
	Send,
	Share2,
	Smile,
	Trash2,
	TrendingUp,
	Video,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type PostType = "announcement" | "discussion" | "poll" | "event" | "content";
type ReactionType = "like" | "celebrate" | "support" | "insightful";

type Post = {
	id: string;
	author: {
		name: string;
		avatar?: string;
		role: string;
	};
	content: string;
	type: PostType;
	timestamp: Date;
	isPinned?: boolean;
	category?: string;
	tags?: string[];
	attachments?: {
		type: "image" | "video" | "document";
		name: string;
		url: string;
	}[];
	reactions: {
		type: ReactionType;
		count: number;
		userReacted: boolean;
	}[];
	comments: number;
	shares: number;
	views: number;
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const CATEGORIES = [
	"All Posts",
	"Announcements",
	"Company News",
	"Training",
	"Best Practices",
	"Team",
	"Events",
];

type CompanyFeedProps = {
	channel?: string;
	channelType?: "channel" | "dm";
	posts?: Post[];
};

export function CompanyFeed({
	channel = "company-feed",
	channelType = "channel",
	posts: initialPosts = [],
}: CompanyFeedProps = {}) {
	const [posts] = useState<Post[]>(initialPosts);
	const [newPostContent, setNewPostContent] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Posts");
	const [searchQuery, setSearchQuery] = useState("");
	const [showComments, setShowComments] = useState<string | null>(null);

	const filteredPosts = posts.filter((post) => {
		const categoryMatch =
			selectedCategory === "All Posts" || post.category === selectedCategory;
		const searchMatch =
			searchQuery === "" ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.tags?.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		return categoryMatch && searchMatch;
	});

	const pinnedPosts = filteredPosts.filter((post) => post.isPinned);
	const regularPosts = filteredPosts.filter((post) => !post.isPinned);

	const formatTimestamp = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / MS_PER_MINUTE);
		const hours = Math.floor(minutes / MINUTES_PER_HOUR);
		const days = Math.floor(hours / HOURS_PER_DAY);

		if (minutes < MINUTES_PER_HOUR) {
			return `${minutes}m ago`;
		}
		if (hours < HOURS_PER_DAY) {
			return `${hours}h ago`;
		}
		if (days < 7) {
			return `${days}d ago`;
		}
		return date.toLocaleDateString();
	};

	const getReactionIcon = (type: ReactionType) => {
		switch (type) {
			case "like":
				return "👍";
			case "celebrate":
				return "🎉";
			case "support":
				return "❤️";
			case "insightful":
				return "💡";
			default:
				return "👍";
		}
	};

	const getPostTypeIcon = (type: PostType) => {
		switch (type) {
			case "announcement":
				return <Hash className="h-4 w-4" />;
			case "poll":
				return <TrendingUp className="h-4 w-4" />;
			case "event":
				return <Calendar className="h-4 w-4" />;
			case "content":
				return <FileText className="h-4 w-4" />;
			default:
				return <MessageCircle className="h-4 w-4" />;
		}
	};

	const PostCard = ({ post }: { post: Post }) => {
		const totalReactions = post.reactions.reduce(
			(sum, reaction) => sum + reaction.count,
			0,
		);

		return (
			<Card>
				<CardHeader className="space-y-4">
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3">
							<Avatar className="h-10 w-10">
								<AvatarImage src={post.author.avatar} />
								<AvatarFallback>
									{post.author.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<p className="text-sm font-semibold">{post.author.name}</p>
									{post.isPinned && (
										<Pin className="text-primary h-3.5 w-3.5" />
									)}
								</div>
								<div className="text-muted-foreground flex items-center gap-2 text-xs">
									<span>{post.author.role}</span>
									<span>•</span>
									<span>{formatTimestamp(post.timestamp)}</span>
									{post.category && (
										<>
											<span>•</span>
											<Badge className="text-xs" variant="secondary">
												{getPostTypeIcon(post.type)}
												<span className="ml-1">{post.category}</span>
											</Badge>
										</>
									)}
								</div>
							</div>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="ghost">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<Bookmark className="mr-2 h-4 w-4" />
									Save post
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Flag className="mr-2 h-4 w-4" />
									Report post
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Edit post
								</DropdownMenuItem>
								<DropdownMenuItem className="text-destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete post
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

					{post.attachments && post.attachments.length > 0 && (
						<div className="space-y-2">
							{post.attachments.map((attachment, index) => (
								<div
									className="flex items-center gap-3 rounded-lg border p-3"
									key={index}
								>
									<div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
										{attachment.type === "image" && (
											<ImageIcon className="h-5 w-5" />
										)}
										{attachment.type === "video" && (
											<Video className="h-5 w-5" />
										)}
										{attachment.type === "document" && (
											<FileText className="h-5 w-5" />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{attachment.name}
										</p>
										<p className="text-muted-foreground text-xs">
											{attachment.type}
										</p>
									</div>
									<Button size="sm" variant="ghost">
										View
									</Button>
								</div>
							))}
						</div>
					)}

					{post.tags && post.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<Badge className="text-xs" key={tag} variant="outline">
									#{tag}
								</Badge>
							))}
						</div>
					)}
				</CardContent>

				<CardFooter className="flex-col space-y-3">
					<Separator />

					<div className="text-muted-foreground flex w-full items-center justify-between text-sm">
						<div className="flex items-center gap-4">
							{totalReactions > 0 && (
								<button
									className="hover:text-foreground flex items-center gap-1"
									type="button"
								>
									<div className="flex -space-x-1">
										{post.reactions.map((reaction, index) => (
											<span
												className="bg-muted flex h-5 w-5 items-center justify-center rounded-full text-xs"
												key={index}
											>
												{getReactionIcon(reaction.type)}
											</span>
										))}
									</div>
									<span>{totalReactions}</span>
								</button>
							)}
						</div>

						<div className="flex items-center gap-4 text-xs">
							<span>{post.comments} comments</span>
							<span>{post.shares} shares</span>
							<span>{post.views} views</span>
						</div>
					</div>

					<Separator />

					<div className="grid w-full grid-cols-4 gap-2">
						<Button className="gap-2" size="sm" variant="ghost">
							<Heart className="h-4 w-4" />
							Like
						</Button>
						<Button
							className="gap-2"
							onClick={() =>
								setShowComments(showComments === post.id ? null : post.id)
							}
							size="sm"
							variant="ghost"
						>
							<MessageCircle className="h-4 w-4" />
							Comment
						</Button>
						<Button className="gap-2" size="sm" variant="ghost">
							<Share2 className="h-4 w-4" />
							Share
						</Button>
						<Button className="gap-2" size="sm" variant="ghost">
							<Bookmark className="h-4 w-4" />
							Save
						</Button>
					</div>

					{showComments === post.id && (
						<>
							<Separator />
							<div className="w-full space-y-3">
								<div className="flex gap-2">
									<Avatar className="h-8 w-8">
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<Textarea
											className="min-h-[60px] resize-none"
											placeholder="Write a comment..."
										/>
										<div className="mt-2 flex justify-between">
											<Button size="sm" variant="ghost">
												<Smile className="mr-2 h-4 w-4" />
												Emoji
											</Button>
											<Button size="sm">
												<Send className="mr-2 h-4 w-4" />
												Post
											</Button>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</CardFooter>
			</Card>
		);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Header with filters */}
			<div className="bg-background border-b p-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-1 items-center gap-3">
						<div className="relative max-w-md flex-1">
							<Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
							<Input
								className="pl-8"
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search posts, people, or topics..."
								value={searchQuery}
							/>
						</div>

						<Select
							onValueChange={setSelectedCategory}
							value={selectedCategory}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button size="icon" variant="outline">
							<Filter className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Main feed */}
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 overflow-y-auto p-6">
					<div className="mx-auto max-w-3xl space-y-6">
						{/* Create post card */}
						<Card>
							<CardContent className="p-4">
								<div className="flex gap-3">
									<Avatar className="h-10 w-10">
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-3">
										<Textarea
											onChange={(e) => setNewPostContent(e.target.value)}
											placeholder="Share an update with your team..."
											rows={3}
											value={newPostContent}
										/>
										<div className="flex items-center justify-between">
											<div className="flex gap-1">
												<Button size="sm" variant="ghost">
													<ImageIcon className="mr-2 h-4 w-4" />
													Photo
												</Button>
												<Button size="sm" variant="ghost">
													<Video className="mr-2 h-4 w-4" />
													Video
												</Button>
												<Button size="sm" variant="ghost">
													<FileText className="mr-2 h-4 w-4" />
													Document
												</Button>
												<Button size="sm" variant="ghost">
													<TrendingUp className="mr-2 h-4 w-4" />
													Poll
												</Button>
												<Button size="sm" variant="ghost">
													<Calendar className="mr-2 h-4 w-4" />
													Event
												</Button>
											</div>
											<Button disabled={!newPostContent.trim()}>
												<Send className="mr-2 h-4 w-4" />
												Post
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Pinned posts */}
						{pinnedPosts.length > 0 && (
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Pin className="text-primary h-4 w-4" />
									<h3 className="text-sm font-semibold">Pinned Posts</h3>
								</div>
								{pinnedPosts.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
								<Separator />
							</div>
						)}

						{/* Regular posts */}
						<div className="space-y-4">
							{regularPosts.length === 0 ? (
								<Card>
									<CardContent className="flex flex-col items-center justify-center p-12 text-center">
										<MessageCircle className="text-muted-foreground mb-4 h-12 w-12" />
										<h3 className="mb-2 text-lg font-semibold">
											No posts found
										</h3>
										<p className="text-muted-foreground text-sm">
											Try adjusting your filters or be the first to post
											something!
										</p>
									</CardContent>
								</Card>
							) : (
								regularPosts.map((post) => (
									<PostCard key={post.id} post={post} />
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
