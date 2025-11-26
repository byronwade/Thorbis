/**
 * Team Leaderboard Report - Async Server Component
 *
 * Displays team performance rankings with comprehensive metrics
 * including jobs completed, revenue, ratings, and efficiency.
 */

import {
	CheckCircle,
	Clock,
	DollarSign,
	Medal,
	Star,
	Trophy,
	Users,
} from "lucide-react";
import { ExportButton } from "@/components/reports/export-button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getTeamLeaderboard } from "@/lib/queries/analytics";

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

function formatDuration(minutes: number): string {
	if (minutes < 60) return `${Math.round(minutes)}m`;
	const hours = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export async function TechniciansData() {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">
					Please select a company to view reports
				</p>
			</div>
		);
	}

	const data = await getTeamLeaderboard(companyId, 30);

	if (data.technicians.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
				<Users className="text-muted-foreground size-16" />
				<h3 className="text-lg font-semibold">No Technician Data</h3>
				<p className="text-muted-foreground text-center max-w-md">
					Complete some jobs with assigned technicians to see team performance
					metrics.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Export */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Team Leaderboard
					</h2>
					<p className="text-muted-foreground">
						Performance rankings and metrics
					</p>
				</div>
				<ExportButton reportType="team" days={30} />
			</div>

			{/* Top Performer Highlight */}
			{data.topPerformer && (
				<Card className="border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="bg-yellow-500/20 p-3 rounded-full">
								<Trophy className="size-6 text-yellow-500" />
							</div>
							<div>
								<CardTitle className="text-lg">Top Performer</CardTitle>
								<CardDescription>Last 30 days</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">{data.topPerformer.name}</p>
								<p className="text-muted-foreground">
									{data.topPerformer.highlight}
								</p>
							</div>
							<Badge className="bg-yellow-500 text-white">#1</Badge>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Team Averages */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<SummaryCard
					title="Avg Jobs/Tech"
					value={data.teamAverages.jobsPerTech.toFixed(1)}
					icon={<Users className="size-4 text-blue-500" />}
				/>
				<SummaryCard
					title="Avg Revenue/Tech"
					value={formatCurrency(data.teamAverages.revenuePerTech)}
					icon={<DollarSign className="size-4 text-green-500" />}
				/>
				<SummaryCard
					title="Team Avg Rating"
					value={data.teamAverages.avgRating.toFixed(1)}
					icon={<Star className="size-4 text-yellow-500" />}
				/>
				<SummaryCard
					title="Team FTF Rate"
					value={formatPercent(data.teamAverages.firstTimeFixRate)}
					icon={<CheckCircle className="size-4 text-emerald-500" />}
				/>
			</div>

			{/* Leaderboard Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Medal className="size-5" />
						Team Leaderboard
					</CardTitle>
					<CardDescription>Ranked by overall performance score</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16">Rank</TableHead>
								<TableHead>Technician</TableHead>
								<TableHead className="text-right">Jobs</TableHead>
								<TableHead className="text-right">Revenue</TableHead>
								<TableHead className="text-right">Avg Time</TableHead>
								<TableHead className="text-right">FTF Rate</TableHead>
								<TableHead className="text-right">Rating</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.technicians.map((tech) => (
								<TableRow
									key={tech.id}
									className={tech.rank <= 3 ? "bg-yellow-500/5" : ""}
								>
									<TableCell>
										<RankBadge rank={tech.rank} />
									</TableCell>
									<TableCell className="font-medium">{tech.name}</TableCell>
									<TableCell className="text-right">
										{tech.jobsCompleted}
									</TableCell>
									<TableCell className="text-right">
										{formatCurrency(tech.revenue)}
									</TableCell>
									<TableCell className="text-right">
										{formatDuration(tech.avgJobDuration)}
									</TableCell>
									<TableCell className="text-right">
										<Badge
											variant={
												tech.firstTimeFixRate >= 90
													? "default"
													: tech.firstTimeFixRate >= 75
														? "secondary"
														: "destructive"
											}
										>
											{formatPercent(tech.firstTimeFixRate)}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-1">
											<Star className="size-3 fill-yellow-400 text-yellow-400" />
											{tech.avgRating.toFixed(1)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Performance Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				{data.technicians.slice(0, 3).map((tech, index) => (
					<TechnicianCard key={tech.id} tech={tech} highlight={index === 0} />
				))}
			</div>
		</div>
	);
}

function SummaryCard({
	title,
	value,
	icon,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}

function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) {
		return (
			<div className="bg-yellow-500/20 text-yellow-600 size-8 rounded-full flex items-center justify-center font-bold">
				1
			</div>
		);
	}
	if (rank === 2) {
		return (
			<div className="bg-gray-300/30 text-gray-600 size-8 rounded-full flex items-center justify-center font-bold">
				2
			</div>
		);
	}
	if (rank === 3) {
		return (
			<div className="bg-orange-500/20 text-orange-600 size-8 rounded-full flex items-center justify-center font-bold">
				3
			</div>
		);
	}
	return (
		<div className="text-muted-foreground size-8 flex items-center justify-center">
			{rank}
		</div>
	);
}

function TechnicianCard({
	tech,
	highlight,
}: {
	tech: {
		id: string;
		name: string;
		rank: number;
		jobsCompleted: number;
		revenue: number;
		avgRating: number;
		firstTimeFixRate: number;
		avgJobDuration: number;
	};
	highlight: boolean;
}) {
	return (
		<Card
			className={
				highlight
					? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
					: ""
			}
		>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-primary/10 size-10 rounded-full flex items-center justify-center text-sm font-bold">
							{tech.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.substring(0, 2)}
						</div>
						<div>
							<CardTitle className="text-base">{tech.name}</CardTitle>
							<CardDescription>Rank #{tech.rank}</CardDescription>
						</div>
					</div>
					{highlight && <Trophy className="size-5 text-yellow-500" />}
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-muted-foreground">Jobs</p>
						<p className="font-semibold">{tech.jobsCompleted}</p>
					</div>
					<div>
						<p className="text-muted-foreground">Revenue</p>
						<p className="font-semibold">{formatCurrency(tech.revenue)}</p>
					</div>
					<div>
						<p className="text-muted-foreground">FTF Rate</p>
						<p className="font-semibold">
							{formatPercent(tech.firstTimeFixRate)}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Rating</p>
						<p className="font-semibold flex items-center gap-1">
							<Star className="size-3 fill-yellow-400 text-yellow-400" />
							{tech.avgRating.toFixed(1)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
