/**
 * Customer Appointments Widget - Progressive Loading
 */

"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { ProgressiveWidget, WidgetSkeleton } from "@/components/progressive";
import { Button } from "@/components/ui/button";
import { useCustomerAppointments } from "@/hooks/use-customer-360";
import { formatDate } from "@/lib/formatters";

type CustomerAppointmentsWidgetProps = {
	customerId: string;
	loadImmediately?: boolean;
};

export function CustomerAppointmentsWidget({
	customerId,
	loadImmediately = false,
}: CustomerAppointmentsWidgetProps) {
	return (
		<ProgressiveWidget
			title="Upcoming Appointments"
			icon={<Calendar className="h-5 w-5" />}
			loadImmediately={loadImmediately}
		>
			{({ isVisible }) => {
				const { data: appointments, isLoading, error } = useCustomerAppointments(
					customerId,
					isVisible,
				);

				if (isLoading) return <WidgetSkeleton rows={3} />;
				if (error)
					return (
						<div className="text-center text-muted-foreground text-sm">
							Failed to load appointments
						</div>
					);
				if (!appointments || appointments.length === 0)
					return (
						<div className="text-center text-muted-foreground text-sm">
							No appointments scheduled
						</div>
					);

				return (
					<div className="space-y-3">
						{appointments.map((appointment) => (
							<Link
								key={appointment.id}
								href={`/dashboard/work/appointments/${appointment.id}`}
								className="block rounded-lg border p-3 transition-colors hover:bg-accent"
							>
								<div className="space-y-1">
									<p className="font-medium text-sm">
										{formatDate(appointment.scheduled_start)}
									</p>
									{appointment.job && (
										<p className="text-muted-foreground text-xs">
											Job: {appointment.job.job_number} - {appointment.job.title}
										</p>
									)}
									{appointment.property && (
										<p className="text-muted-foreground text-xs">
											{appointment.property.address}
										</p>
									)}
								</div>
							</Link>
						))}

						{appointments.length >= 10 && (
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href={`/dashboard/work/appointments?customer=${customerId}`}>
									View All Appointments
								</Link>
							</Button>
						)}
					</div>
				);
			}}
		</ProgressiveWidget>
	);
}
