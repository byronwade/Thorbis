import { AppHeader } from "@/components/layout/app-header";
import { IncomingCallNotification } from "@/components/layout/incoming-call-notification";
import { ScheduleViewProvider } from "@/components/schedule/schedule-view-provider";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// For schedule pages, wrap with ScheduleViewProvider
	// This check will be done client-side now
	return (
		<>
			<AppHeader />
			<ScheduleViewProvider>
				<LayoutWrapper showHeader={true}>{children}</LayoutWrapper>
			</ScheduleViewProvider>
			<IncomingCallNotification />
		</>
	);
}
