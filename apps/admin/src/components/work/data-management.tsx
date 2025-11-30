import { Database, AlertTriangle, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatabaseHealthReport } from "@/actions/data-management";
import { formatNumber, formatRelativeTime } from "@/lib/formatters";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DataManagementProps = {
	health: DatabaseHealthReport;
};

/**
 * Data Management Component
 *
 * Displays database health, orphaned data detection, and cleanup tools.
 */
export function DataManagement({ health }: DataManagementProps) {
	return (
		<div className="space-y-6">
			{/* Database Health Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Database Status</CardTitle>
						<Database className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<span className="text-2xl font-bold">Healthy</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">All systems operational</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Orphaned Records</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(health.orphaned_data.total_orphaned_records)}
						</div>
						<p className="text-xs text-muted-foreground">
							{health.orphaned_data.by_type.length} type{health.orphaned_data.by_type.length !== 1 ? "s" : ""} affected
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Recent Migrations</CardTitle>
						<RefreshCw className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{health.recent_migrations.length}</div>
						<p className="text-xs text-muted-foreground">Applied in last 30 days</p>
					</CardContent>
				</Card>
			</div>

			{/* Orphaned Data Report */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Orphaned Data Detection</CardTitle>
						{health.orphaned_data.total_orphaned_records > 0 && (
							<Badge variant="destructive">
								{formatNumber(health.orphaned_data.total_orphaned_records)} issues found
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{health.orphaned_data.by_type.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
							<p>No orphaned data detected. Database is clean!</p>
						</div>
					) : (
						<div className="space-y-4">
							{health.orphaned_data.by_type.map((item) => (
								<div
									key={item.type}
									className="flex items-center justify-between p-4 rounded-lg border"
								>
									<div>
										<p className="font-medium capitalize">{item.type}</p>
										<p className="text-sm text-muted-foreground">{item.description}</p>
									</div>
									<div className="flex items-center gap-4">
										<div className="text-right">
											<p className="text-2xl font-bold">{formatNumber(item.count)}</p>
											<p className="text-xs text-muted-foreground">records</p>
										</div>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="destructive" size="sm">
													<Trash2 className="h-4 w-4 mr-2" />
													Clean Up
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Clean Up Orphaned {item.type}?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete {formatNumber(item.count)} orphaned{" "}
														{item.type} records. This action cannot be undone. Are you sure you
														want to continue?
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Records</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Recent Migrations */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Migrations</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{health.recent_migrations.map((migration) => (
							<div
								key={migration.name}
								className="flex items-center justify-between p-3 rounded-lg border"
							>
								<div>
									<p className="font-medium text-sm">{migration.name}</p>
									<p className="text-xs text-muted-foreground">
										Applied {formatRelativeTime(migration.applied_at)}
									</p>
								</div>
								<Badge variant={migration.status === "applied" ? "default" : "secondary"}>
									{migration.status}
								</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

