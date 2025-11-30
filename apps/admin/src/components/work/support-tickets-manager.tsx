"use client";

import { useState, useEffect } from "react";
import {
	LifeBuoy,
	Search,
	RefreshCcw,
	Clock,
	AlertCircle,
	CheckCircle,
	User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SupportTicket, SupportTicketStats, getSupportTickets, getSupportTicketStats } from "@/actions/support-tickets";
import { formatRelativeTime, formatNumber } from "@/lib/formatters";

type SupportTicketsManagerProps = {
	initialTickets: SupportTicket[];
	initialStats: SupportTicketStats;
};

/**
 * Support Tickets Manager Component
 *
 * Displays and manages support tickets with filtering and statistics.
 */
export function SupportTicketsManager({ initialTickets, initialStats }: SupportTicketsManagerProps) {
	const [tickets, setTickets] = useState(initialTickets);
	const [stats, setStats] = useState(initialStats);
	const [loading, setLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	const fetchTickets = async () => {
		setLoading(true);
		const [ticketsResult, statsResult] = await Promise.all([
			getSupportTickets(50, 0, statusFilter !== "all" ? statusFilter : undefined, priorityFilter !== "all" ? priorityFilter : undefined),
			getSupportTicketStats(),
		]);

		if (ticketsResult.data) setTickets(ticketsResult.data);
		if (statsResult.data) setStats(statsResult.data);
		setLoading(false);
	};

	useEffect(() => {
		fetchTickets();
	}, [statusFilter, priorityFilter]);

	const filteredTickets = tickets.filter((ticket) => {
		const matchesSearch =
			searchQuery === "" ||
			ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.requester_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.ticket_number?.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	const getStatusBadgeVariant = (status: SupportTicket["status"]) => {
		switch (status) {
			case "open":
				return "default";
			case "in_progress":
				return "secondary";
			case "waiting_on_customer":
			case "waiting_on_us":
				return "outline";
			case "resolved":
				return "default";
			case "closed":
				return "secondary";
			default:
				return "outline";
		}
	};

	const getPriorityBadgeVariant = (priority: SupportTicket["priority"]) => {
		switch (priority) {
			case "urgent":
				return "destructive";
			case "high":
				return "warning";
			case "normal":
				return "default";
			case "low":
				return "secondary";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.open_tickets)}</div>
						<p className="text-xs text-muted-foreground">Requiring attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">In Progress</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.in_progress)}</div>
						<p className="text-xs text-muted-foreground">Currently being worked on</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.resolved_today)}</div>
						<p className="text-xs text-muted-foreground">Completed today</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(stats.avg_response_time_minutes)} min</div>
						<p className="text-xs text-muted-foreground">First response</p>
					</CardContent>
				</Card>
			</div>

			{/* Tickets Table */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<LifeBuoy className="h-5 w-5 text-muted-foreground" /> Support Tickets
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="open">Open</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="waiting_on_customer">Waiting on Customer</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
							</SelectContent>
						</Select>
						<Select value={priorityFilter} onValueChange={setPriorityFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Priority</SelectItem>
								<SelectItem value="urgent">Urgent</SelectItem>
								<SelectItem value="high">High</SelectItem>
								<SelectItem value="normal">Normal</SelectItem>
								<SelectItem value="low">Low</SelectItem>
							</SelectContent>
						</Select>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search tickets..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading}>
							<RefreshCcw className={loading ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ticket</TableHead>
								<TableHead>Requester</TableHead>
								<TableHead>Company</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Priority</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Assigned To</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredTickets.length > 0 ? (
								filteredTickets.map((ticket) => (
									<TableRow key={ticket.id}>
										<TableCell>
											<div>
												<p className="font-medium">{ticket.ticket_number}</p>
												<p className="text-sm text-muted-foreground max-w-xs truncate">
													{ticket.subject}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className="text-sm">{ticket.requester_name || "—"}</p>
												<p className="text-xs text-muted-foreground">{ticket.requester_email}</p>
											</div>
										</TableCell>
										<TableCell className="text-sm">{ticket.company_name || "—"}</TableCell>
										<TableCell>
											<Badge variant={getStatusBadgeVariant(ticket.status)}>
												{ticket.status.replace(/_/g, " ")}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={getPriorityBadgeVariant(ticket.priority)}>
												{ticket.priority}
											</Badge>
										</TableCell>
										<TableCell className="text-xs">
											{formatRelativeTime(ticket.created_at)}
										</TableCell>
										<TableCell className="text-sm">{ticket.assigned_to_name || "Unassigned"}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
										No support tickets found.
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

