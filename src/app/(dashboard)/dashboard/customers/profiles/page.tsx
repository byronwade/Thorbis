/**
 * Customers > Profiles Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerProfilesPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Customer Profiles</h1>
				<p className="text-muted-foreground">Detailed customer profiles with contact information and service history</p>
			</div>

			{/* Profile Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Complete Profiles</CardTitle>
						<svg
							className="size-4 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>UserCheck</title>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 4 12 14.01l-3-3" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">1,156</div>
						<p className="text-muted-foreground text-xs">93% completion rate</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Incomplete Profiles</CardTitle>
						<svg
							className="size-4 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>UserX</title>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M18 8l-6 6M6 8l6 6" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">91</div>
						<p className="text-muted-foreground text-xs">Need attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">VIP Customers</CardTitle>
						<svg
							className="size-4 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Crown</title>
							<path d="M11.562 3.266a3 3 0 0 1 4.876 0l.562.562a3 3 0 0 0 4.876 0l.562-.562a3 3 0 0 1 4.876 0l.562.562a3 3 0 0 1 0 4.876l-.562.562a3 3 0 0 0 0 4.876l.562.562a3 3 0 0 1 0 4.876l-.562.562a3 3 0 0 1-4.876 0l-.562-.562a3 3 0 0 0-4.876 0l-.562.562a3 3 0 0 1-4.876 0l-.562-.562a3 3 0 0 1 0-4.876l.562-.562a3 3 0 0 0 0-4.876l-.562-.562a3 3 0 0 1 0-4.876l.562-.562Z" />
							<path d="M12 12h.01" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">47</div>
						<p className="text-muted-foreground text-xs">High-value customers</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Profile Updates</CardTitle>
						<svg
							className="size-4 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Edit</title>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">23</div>
						<p className="text-muted-foreground text-xs">This week</p>
					</CardContent>
				</Card>
			</div>

			{/* Customer Profiles */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Customer Profiles</CardTitle>
						<CardDescription>Detailed customer information and service preferences</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{
									name: "ABC Corporation",
									contact: "John Smith",
									title: "Facilities Manager",
									email: "john@abccorp.com",
									phone: "(555) 123-4567",
									address: "123 Business Ave, City, ST 12345",
									status: "VIP",
									services: ["HVAC", "Plumbing", "Electrical"],
									lastContact: "2024-01-15",
									totalValue: "$12,450",
								},
								{
									name: "XYZ Industries",
									contact: "Sarah Johnson",
									title: "Operations Director",
									email: "sarah@xyzind.com",
									phone: "(555) 234-5678",
									address: "456 Industrial Blvd, City, ST 12345",
									status: "Active",
									services: ["HVAC", "Plumbing"],
									lastContact: "2024-01-20",
									totalValue: "$8,900",
								},
								{
									name: "TechStart Inc",
									contact: "Mike Davis",
									title: "CEO",
									email: "mike@techstart.com",
									phone: "(555) 345-6789",
									address: "789 Tech Park, City, ST 12345",
									status: "Prospect",
									services: ["HVAC"],
									lastContact: "2024-01-25",
									totalValue: "$0",
								},
								{
									name: "Global Systems",
									contact: "Lisa Wilson",
									title: "Facilities Director",
									email: "lisa@globalsys.com",
									phone: "(555) 456-7890",
									address: "321 Corporate Dr, City, ST 12345",
									status: "Active",
									services: ["HVAC", "Electrical", "Plumbing"],
									lastContact: "2024-01-18",
									totalValue: "$15,200",
								},
								{
									name: "123 Manufacturing",
									contact: "Tom Brown",
									title: "Plant Manager",
									email: "tom@123mfg.com",
									phone: "(555) 567-8901",
									address: "654 Factory St, City, ST 12345",
									status: "Inactive",
									services: ["HVAC", "Plumbing"],
									lastContact: "2023-12-10",
									totalValue: "$3,850",
								},
							].map((customer, index) => (
								<div className="flex items-center gap-4 rounded-lg border p-4" key={index}>
									<div className="flex size-12 items-center justify-center rounded-full bg-accent">
										<span className="font-medium text-sm">
											{customer.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</span>
									</div>
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<p className="font-medium text-sm leading-none">{customer.name}</p>
											<span
												className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
													customer.status === "VIP"
														? "bg-accent text-accent-foreground"
														: customer.status === "Active"
															? "bg-success text-success"
															: customer.status === "Prospect"
																? "bg-primary text-primary"
																: "bg-muted text-foreground"
												}`}
											>
												{customer.status}
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											{customer.contact} • {customer.title}
										</p>
										<p className="text-muted-foreground text-sm">
											{customer.email} • {customer.phone}
										</p>
										<p className="text-muted-foreground text-sm">Services: {customer.services.join(", ")}</p>
									</div>
									<div className="text-right">
										<p className="font-medium text-sm">{customer.totalValue}</p>
										<p className="text-muted-foreground text-xs">Last: {customer.lastContact}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Profile Insights</CardTitle>
						<CardDescription>Customer profile analytics and trends</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between rounded-lg bg-accent p-3">
								<div>
									<p className="font-medium text-sm">Profile Completion</p>
									<p className="text-muted-foreground text-xs">Overall rate</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm">93%</p>
									<p className="text-muted-foreground text-xs">+2% this month</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-accent p-3">
								<div>
									<p className="font-medium text-sm">VIP Customers</p>
									<p className="text-muted-foreground text-xs">High-value accounts</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm">47</p>
									<p className="text-muted-foreground text-xs">+3 this quarter</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-accent p-3">
								<div>
									<p className="font-medium text-sm">Service Preferences</p>
									<p className="text-muted-foreground text-xs">Most requested</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm">HVAC</p>
									<p className="text-muted-foreground text-xs">78% of customers</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-accent p-3">
								<div>
									<p className="font-medium text-sm">Contact Frequency</p>
									<p className="text-muted-foreground text-xs">Average per month</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm">2.3</p>
									<p className="text-muted-foreground text-xs">times per customer</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-accent p-3">
								<div>
									<p className="font-medium text-sm">Data Quality</p>
									<p className="text-muted-foreground text-xs">Profile accuracy</p>
								</div>
								<div className="text-right">
									<p className="font-bold text-sm">96%</p>
									<p className="text-muted-foreground text-xs">+1% from last month</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
