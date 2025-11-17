/**
 * Invoice Communications Widget - Progressive Loading
 *
 * Displays communications related to this invoice (email, SMS, calls).
 * Uses specialized query that filters by invoice_id, customer_id, and job_id.
 * Loads data only when widget becomes visible.
 */

"use client";

import { MessageSquare, Mail, Phone } from "lucide-react";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { useInvoiceCommunications } from "@/hooks/use-invoice-360";
import { formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

type InvoiceCommunicationsWidgetProps = {
	invoiceId: string;
	customerId: string | null;
	jobId: string | null;
	companyId: string;
	loadImmediately?: boolean;
};

export function InvoiceCommunicationsWidget({
	invoiceId,
	customerId,
	jobId,
	companyId,
	loadImmediately = false,
}: InvoiceCommunicationsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Communications"
			icon={<MessageSquare className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const {
					data: communications,
					isLoading,
					error,
				} = useInvoiceCommunications(invoiceId, customerId, jobId, companyId, isVisible);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-muted-foreground text-center text-sm">
							Failed to load communications
						</div>
					);
				if (!communications || communications.length === 0)
					return (
						<div className="text-muted-foreground text-center text-sm">No communications found</div>
					);

				const getCommIcon = (type: string) => {
					switch (type?.toLowerCase()) {
						case "email":
							return <Mail className="h-4 w-4" />;
						case "phone":
						case "call":
							return <Phone className="h-4 w-4" />;
						default:
							return <MessageSquare className="h-4 w-4" />;
					}
				};

				const getCommColor = (type: string) => {
					switch (type?.toLowerCase()) {
						case "email":
							return "bg-blue-100 text-blue-600";
						case "phone":
						case "call":
							return "bg-green-100 text-green-600";
						default:
							return "bg-gray-100 text-gray-600";
					}
				};

				return (
					<div className="space-y-3">
						{communications.slice(0, 10).map((comm) => (
							<div key={comm.id} className="rounded-lg border p-3">
								<div className="flex items-start gap-3">
									<div
										className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getCommColor(comm.type)}`}
									>
										{getCommIcon(comm.type)}
									</div>
									<div className="flex-1 space-y-1">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium capitalize">
												{comm.type || "Communication"}
											</span>
											<span className="text-muted-foreground text-xs">
												{formatDate(comm.created_at)}
											</span>
										</div>
										{comm.subject && <p className="text-sm font-medium">{comm.subject}</p>}
										{comm.message && (
											<p className="text-muted-foreground line-clamp-2 text-sm">{comm.message}</p>
										)}
										{comm.customer && (
											<p className="text-muted-foreground text-xs">
												To:{" "}
												{comm.customer.first_name || comm.customer.last_name
													? `${comm.customer.first_name} ${comm.customer.last_name}`.trim()
													: "Customer"}
											</p>
										)}
										{comm.status && (
											<span
												className={`inline-block rounded-full px-2 py-0.5 text-xs ${
													comm.status === "sent" || comm.status === "delivered"
														? "bg-green-100 text-green-700"
														: comm.status === "pending"
															? "bg-yellow-100 text-yellow-700"
															: comm.status === "failed"
																? "bg-red-100 text-red-700"
																: "bg-gray-100 text-gray-700"
												}`}
											>
												{comm.status}
											</span>
										)}
									</div>
								</div>
							</div>
						))}

						{communications.length > 10 && (
							<Button variant="outline" size="sm" className="w-full">
								View All Communications ({communications.length})
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
