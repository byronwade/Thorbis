/**
 * Support Activity Page
 *
 * Shows customers a complete audit trail of all support sessions and actions.
 * Transparency for what support has viewed/changed.
 */

import { AlertCircle, Clock, Edit, Eye, Shield, User } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

interface SupportSessionWithActions {
	id: string;
	admin_user_id: string;
	ticket_id: string | null;
	status: string;
	reason: string;
	requested_at: string;
	approved_at: string | null;
	ended_at: string | null;
	expires_at: string | null;
	actions: SupportAction[];
}

interface SupportAction {
	id: string;
	action: string;
	resource_type: string;
	resource_id: string;
	reason: string | null;
	created_at: string;
	before_data: any;
	after_data: any;
}

async function SupportActivityData() {
	const supabase = await createClient();

	// Handle prerendering case
	if (!supabase) {
		return (
			<div className="p-6 text-center text-muted-foreground">Loading...</div>
		);
	}

	// Get current user's company
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user's company_id
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", user.id)
		.single();

	if (!teamMember) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				No company found
			</div>
		);
	}

	// Fetch support sessions from admin database
	// TODO: Cross-database access pattern needed
	// Options:
	// 1. Service role client with admin DB connection string
	// 2. Admin app API endpoint that web app calls
	// 3. Supabase RPC function with foreign data wrapper

	// For now, use web DB client (will need service role in production)
	let sessions: SupportSessionWithActions[] = [];

	try {
		// Query support_sessions for this company
		const { data: sessionsData, error: sessionsError } = await supabase
			.from("support_sessions")
			.select(
				`
				id,
				admin_user_id,
				ticket_id,
				status,
				reason,
				requested_at,
				approved_at,
				ended_at,
				expires_at
			`,
			)
			.eq("company_id", teamMember.company_id)
			.order("requested_at", { ascending: false })
			.limit(50);

		if (sessionsError) {
			console.error("Error fetching support sessions:", sessionsError);
		} else if (sessionsData) {
			// For each session, fetch its actions
			sessions = await Promise.all(
				sessionsData.map(async (session) => {
					const { data: actionsData } = await supabase
						.from("support_session_actions")
						.select(
							"id, action, resource_type, resource_id, reason, created_at, before_data, after_data",
						)
						.eq("session_id", session.id)
						.order("created_at", { ascending: true });

					return {
						...session,
						actions: actionsData || [],
					};
				}),
			);
		}
	} catch (error) {
		console.error("Error fetching audit log:", error);
		// Fall back to empty array if cross-database access not set up yet
	}

	const mockSessions = sessions; // Rename for backwards compatibility

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Sessions
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{mockSessions.length}</div>
						<p className="text-xs text-muted-foreground">All time</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Actions Taken</CardTitle>
						<Edit className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{mockSessions.reduce((acc, s) => acc + s.actions.length, 0)}
						</div>
						<p className="text-xs text-muted-foreground">Total modifications</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Last Access</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{mockSessions.length > 0 ? "Recently" : "Never"}
						</div>
						<p className="text-xs text-muted-foreground">
							{mockSessions.length > 0
								? new Date(mockSessions[0].requested_at).toLocaleDateString()
								: "No support access"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Sessions Timeline */}
			<Card>
				<CardHeader>
					<CardTitle>Support Access History</CardTitle>
					<CardDescription>
						Complete timeline of all support sessions and actions taken on your
						account
					</CardDescription>
				</CardHeader>
				<CardContent>
					{mockSessions.length === 0 ? (
						<div className="text-center py-12 space-y-4">
							<div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto">
								<Shield className="h-8 w-8 text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<h3 className="font-medium">No Support Access History</h3>
								<p className="text-sm text-muted-foreground">
									No support team member has accessed your account yet.
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-6">
							{mockSessions.map((session) => (
								<div
									key={session.id}
									className="border rounded-lg p-4 space-y-4"
								>
									{/* Session Header */}
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<User className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">Support Team</span>
												{session.ticket_id && (
													<Badge variant="outline" className="ml-2">
														Ticket: {session.ticket_id}
													</Badge>
												)}
											</div>
											<p className="text-sm text-muted-foreground">
												{session.reason}
											</p>
										</div>
										<div className="text-right space-y-1">
											<Badge
												variant={
													session.status === "active"
														? "default"
														: session.status === "ended"
															? "secondary"
															: "outline"
												}
											>
												{session.status}
											</Badge>
											<p className="text-xs text-muted-foreground">
												{new Date(session.requested_at).toLocaleString()}
											</p>
										</div>
									</div>

									{/* Session Duration */}
									<div className="flex items-center gap-4 text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<Clock className="h-3.5 w-3.5" />
											<span>
												Started:{" "}
												{session.approved_at
													? new Date(session.approved_at).toLocaleString()
													: "Pending"}
											</span>
										</div>
										{session.ended_at && (
											<div className="flex items-center gap-1">
												<span>
													Ended: {new Date(session.ended_at).toLocaleString()}
												</span>
											</div>
										)}
									</div>

									{/* Actions Taken */}
									{session.actions.length > 0 && (
										<div className="space-y-2">
											<h4 className="text-sm font-medium flex items-center gap-2">
												<Edit className="h-3.5 w-3.5" />
												Actions Taken ({session.actions.length})
											</h4>
											<div className="rounded-md border">
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Action</TableHead>
															<TableHead>Resource</TableHead>
															<TableHead>Reason</TableHead>
															<TableHead>Time</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{session.actions.map((action) => (
															<TableRow key={action.id}>
																<TableCell className="font-medium">
																	{action.action.replace(/_/g, " ")}
																</TableCell>
																<TableCell>
																	{action.resource_type} -{" "}
																	{action.resource_id.slice(0, 8)}...
																</TableCell>
																<TableCell className="text-sm text-muted-foreground">
																	{action.reason || "—"}
																</TableCell>
																<TableCell className="text-sm">
																	{new Date(
																		action.created_at,
																	).toLocaleTimeString()}
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</div>
										</div>
									)}

									{/* View Only Session */}
									{session.actions.length === 0 && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground rounded-md bg-muted/50 p-3">
											<Eye className="h-4 w-4" />
											<span>View only - no changes made</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Security Notice */}
			<Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
						<AlertCircle className="h-5 w-5" />
						About Support Access
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
					<p>• Support access must be approved by you before it's granted</p>
					<p>• All sessions automatically expire after the approved duration</p>
					<p>• Every action taken by support is logged and visible here</p>
					<p>• You can end any active support session at any time</p>
					<p>
						• Your data is never shared with anyone outside our support team
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

function SupportActivitySkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-3">
				{[...Array(3)].map((_, i) => (
					<Skeleton key={i} className="h-32" />
				))}
			</div>
			<Skeleton className="h-96" />
		</div>
	);
}

export default function SupportActivityPage() {
	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Support Activity</h1>
				<p className="text-sm text-muted-foreground">
					View all support access sessions and actions taken on your account
				</p>
			</div>

			<Suspense fallback={<SupportActivitySkeleton />}>
				<SupportActivityData />
			</Suspense>
		</div>
	);
}
