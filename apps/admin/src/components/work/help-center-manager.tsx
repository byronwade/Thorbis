"use client";

import { useState, useEffect } from "react";
import {
	HelpCircle,
	FileText,
	BookOpen,
	Eye,
	ThumbsUp,
	Search,
	RefreshCcw,
	Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KBArticle, KBCategory, HelpCenterStats, getKBArticles, getKBCategories, getHelpCenterStats } from "@/actions/help-center";
import { formatNumber, formatRelativeTime } from "@/lib/formatters";
import Link from "next/link";

type HelpCenterManagerProps = {
	initialArticles: KBArticle[];
	initialCategories: KBCategory[];
	initialStats: HelpCenterStats;
};

/**
 * Help Center Manager Component
 *
 * Manages knowledge base articles and categories.
 */
export function HelpCenterManager({ initialArticles, initialCategories, initialStats }: HelpCenterManagerProps) {
	const [articles, setArticles] = useState(initialArticles);
	const [categories, setCategories] = useState(initialCategories);
	const [stats, setStats] = useState(initialStats);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchData = async () => {
		setLoading(true);
		const [articlesResult, categoriesResult, statsResult] = await Promise.all([
			getKBArticles(50),
			getKBCategories(),
			getHelpCenterStats(),
		]);

		if (articlesResult.data) setArticles(articlesResult.data);
		if (categoriesResult.data) setCategories(categoriesResult.data);
		if (statsResult.data) setStats(statsResult.data);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const filteredArticles = articles.filter((article) => {
		return (
			searchQuery === "" ||
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	return (
		<div className="space-y-6">
			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Articles</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.total_articles)}</div>
						<p className="text-xs text-muted-foreground">{formatNumber(stats.published_articles)} published</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.total_views)}</div>
						<p className="text-xs text-muted-foreground">All-time views</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Categories</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.total_categories)}</div>
						<p className="text-xs text-muted-foreground">Active categories</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Published</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.published_articles)}</div>
						<p className="text-xs text-muted-foreground">Live articles</p>
					</CardContent>
				</Card>
			</div>

			{/* Categories Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Categories</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{categories.slice(0, 6).map((category) => (
							<div key={category.id} className="flex items-center justify-between p-4 rounded-lg border">
								<div>
									<p className="font-medium">{category.title}</p>
									<p className="text-sm text-muted-foreground">
										{formatNumber(category.article_count || 0)} articles
									</p>
								</div>
								{category.icon && <span className="text-2xl">{category.icon}</span>}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Articles Table */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<HelpCircle className="h-5 w-5 text-muted-foreground" /> Knowledge Base Articles
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search articles..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
							<RefreshCcw className={loading ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
							Refresh
						</Button>
						<Button size="sm">
							<Plus className="h-4 w-4 mr-2" />
							New Article
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Views</TableHead>
								<TableHead>Feedback</TableHead>
								<TableHead>Updated</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredArticles.length > 0 ? (
								filteredArticles.map((article) => (
									<TableRow key={article.id}>
										<TableCell>
											<div>
												<p className="font-medium">{article.title}</p>
												{article.excerpt && (
													<p className="text-xs text-muted-foreground max-w-md truncate">
														{article.excerpt}
													</p>
												)}
											</div>
										</TableCell>
										<TableCell className="text-sm">{article.category_name || "—"}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Badge variant={article.published ? "default" : "secondary"}>
													{article.published ? "Published" : "Draft"}
												</Badge>
												{article.featured && (
													<Badge variant="outline" className="text-xs">Featured</Badge>
												)}
											</div>
										</TableCell>
										<TableCell className="text-sm">{formatNumber(article.view_count)}</TableCell>
										<TableCell className="text-sm">
											<div className="flex items-center gap-2">
												<span className="text-green-600">
													+{formatNumber(article.helpful_count)}
												</span>
												<span className="text-red-600">
													-{formatNumber(article.not_helpful_count)}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-xs">
											{formatRelativeTime(article.updated_at)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
										No articles found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

