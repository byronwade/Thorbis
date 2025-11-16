/**
 * Cost Breakdown Table - Server Component
 *
 * Displays detailed cost breakdown by service type and phone number
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Costs = {
	callCost: number;
	smsCost: number;
	voicemailTranscriptionCost: number;
	phoneNumberCost: number;
	totalCost: number;
};

type PhoneNumber = {
	id: string;
	phone_number: string;
	formatted_number: string;
	number_type: string;
	features: string[];
};

export function CostBreakdownTable({ costs, phoneNumbers }: { costs: Costs; phoneNumbers: PhoneNumber[] }) {
	const serviceRows = [
		{
			service: "Voice Calls",
			description: "Inbound and outbound calls",
			rate: "$0.012/minute",
			cost: costs.callCost,
			percentage: (costs.callCost / costs.totalCost) * 100,
		},
		{
			service: "SMS Messages",
			description: "Outbound SMS (inbound free)",
			rate: "$0.0075/message",
			cost: costs.smsCost,
			percentage: (costs.smsCost / costs.totalCost) * 100,
		},
		{
			service: "Voicemail Transcription",
			description: "Automatic transcription",
			rate: "$0.05/transcription",
			cost: costs.voicemailTranscriptionCost,
			percentage: (costs.voicemailTranscriptionCost / costs.totalCost) * 100,
		},
		{
			service: "Phone Numbers",
			description: `${phoneNumbers.length} active numbers`,
			rate: "$1.00/number/month",
			cost: costs.phoneNumberCost,
			percentage: (costs.phoneNumberCost / costs.totalCost) * 100,
		},
	];

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			{/* Service Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>Cost by Service</CardTitle>
					<CardDescription>Breakdown of costs by service type</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Service</TableHead>
								<TableHead>Rate</TableHead>
								<TableHead className="text-right">Cost</TableHead>
								<TableHead className="text-right">% of Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{serviceRows.map((row) => (
								<TableRow key={row.service}>
									<TableCell>
										<div>
											<div className="font-medium">{row.service}</div>
											<div className="text-muted-foreground text-xs">{row.description}</div>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground text-xs">{row.rate}</TableCell>
									<TableCell className="text-right font-medium">${row.cost.toFixed(2)}</TableCell>
									<TableCell className="text-right">
										<Badge variant="outline">{row.percentage.toFixed(1)}%</Badge>
									</TableCell>
								</TableRow>
							))}
							<TableRow className="border-t-2">
								<TableCell className="font-bold" colSpan={2}>
									Total
								</TableCell>
								<TableCell className="text-right font-bold">${costs.totalCost.toFixed(2)}</TableCell>
								<TableCell className="text-right">
									<Badge>100%</Badge>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Phone Number Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>Cost by Phone Number</CardTitle>
					<CardDescription>Monthly cost for each phone number</CardDescription>
				</CardHeader>
				<CardContent>
					{phoneNumbers.length === 0 ? (
						<div className="flex h-[200px] items-center justify-center text-muted-foreground">
							No phone numbers configured
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Phone Number</TableHead>
									<TableHead>Type</TableHead>
									<TableHead className="text-right">Monthly Cost</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{phoneNumbers.map((number) => (
									<TableRow key={number.id}>
										<TableCell className="font-medium">{number.formatted_number || number.phone_number}</TableCell>
										<TableCell>
											<Badge className="capitalize" variant="secondary">
												{number.number_type}
											</Badge>
										</TableCell>
										<TableCell className="text-right">$1.00</TableCell>
									</TableRow>
								))}
								<TableRow className="border-t-2">
									<TableCell className="font-bold" colSpan={2}>
										Total ({phoneNumbers.length} numbers)
									</TableCell>
									<TableCell className="text-right font-bold">${costs.phoneNumberCost.toFixed(2)}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
