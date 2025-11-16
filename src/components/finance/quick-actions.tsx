"use client";

/**
 * Quick Actions - Client Component
 *
 * Client-side features:
 * - Interactive modals and dialogs
 * - Form handling for fund transfers
 * - Real-time validation
 */

import { ArrowLeftRight, Building2, DollarSign, Layers, Plus, RefreshCw, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuickActions() {
	const [transferOpen, setTransferOpen] = useState(false);
	const [allocateOpen, setAllocateOpen] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Manage funds between accounts and buckets</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
					{/* Transfer Between Accounts */}
					<Dialog onOpenChange={setTransferOpen} open={transferOpen}>
						<DialogTrigger asChild>
							<Button className="h-auto flex-col gap-2 py-6" variant="outline">
								<ArrowLeftRight className="h-5 w-5" />
								<div className="text-center">
									<div className="font-semibold text-sm">Transfer Funds</div>
									<div className="text-muted-foreground text-xs">Between accounts</div>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Transfer Between Accounts</DialogTitle>
								<DialogDescription>Move money between your connected bank accounts</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="from-account">From Account</Label>
									<Select>
										<SelectTrigger id="from-account">
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="checking">Business Checking (•••• 4521)</SelectItem>
											<SelectItem value="savings">Business Savings (•••• 8832)</SelectItem>
											<SelectItem value="operating">Operating Account (•••• 2341)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="to-account">To Account</Label>
									<Select>
										<SelectTrigger id="to-account">
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="checking">Business Checking (•••• 4521)</SelectItem>
											<SelectItem value="savings">Business Savings (•••• 8832)</SelectItem>
											<SelectItem value="operating">Operating Account (•••• 2341)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="amount">Amount</Label>
									<div className="relative">
										<DollarSign className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
										<Input className="pl-9" id="amount" placeholder="0.00" type="number" />
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="memo">Memo (Optional)</Label>
									<Input id="memo" placeholder="Add a note" />
								</div>
							</div>
							<DialogFooter>
								<Button onClick={() => setTransferOpen(false)} variant="outline">
									Cancel
								</Button>
								<Button onClick={() => setTransferOpen(false)}>Transfer Funds</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Allocate to Bucket */}
					<Dialog onOpenChange={setAllocateOpen} open={allocateOpen}>
						<DialogTrigger asChild>
							<Button className="h-auto flex-col gap-2 py-6" variant="outline">
								<Layers className="h-5 w-5" />
								<div className="text-center">
									<div className="font-semibold text-sm">Allocate Funds</div>
									<div className="text-muted-foreground text-xs">To virtual bucket</div>
								</div>
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Allocate to Virtual Bucket</DialogTitle>
								<DialogDescription>Assign funds from an account to a savings bucket</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="source-account">Source Account</Label>
									<Select>
										<SelectTrigger id="source-account">
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="checking">Business Checking - $125,450</SelectItem>
											<SelectItem value="savings">Business Savings - $75,000</SelectItem>
											<SelectItem value="operating">Operating Account - $42,800</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="bucket">Virtual Bucket</Label>
									<Select>
										<SelectTrigger id="bucket">
											<SelectValue placeholder="Select bucket" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="payroll">Payroll Reserve - $85,000 / $120,000</SelectItem>
											<SelectItem value="tax">Tax Reserve - $15,000 / $25,000</SelectItem>
											<SelectItem value="marketing">Marketing Budget - $12,500 / $20,000</SelectItem>
											<SelectItem value="equipment">Equipment Reserve - $8,500 / $20,000</SelectItem>
											<SelectItem value="emergency">Emergency Fund - $45,000 / $75,000</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="allocate-amount">Amount</Label>
									<div className="relative">
										<DollarSign className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
										<Input className="pl-9" id="allocate-amount" placeholder="0.00" type="number" />
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={() => setAllocateOpen(false)} variant="outline">
									Cancel
								</Button>
								<Button onClick={() => setAllocateOpen(false)}>Allocate Funds</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Sync Accounts */}
					<Button className="h-auto flex-col gap-2 py-6" variant="outline">
						<RefreshCw className="h-5 w-5" />
						<div className="text-center">
							<div className="font-semibold text-sm">Sync Accounts</div>
							<div className="text-muted-foreground text-xs">Update balances</div>
						</div>
					</Button>

					{/* Split Payout */}
					<Button className="h-auto flex-col gap-2 py-6" variant="outline">
						<Wallet className="h-5 w-5" />
						<div className="text-center">
							<div className="font-semibold text-sm">Split Payout</div>
							<div className="text-muted-foreground text-xs">Checking & savings</div>
						</div>
					</Button>
				</div>

				{/* Quick Stats */}
				<div className="mt-6 grid gap-3 md:grid-cols-3">
					<div className="flex items-center gap-3 rounded-lg border p-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Building2 className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Unallocated</p>
							<p className="font-semibold text-sm">$76,750</p>
						</div>
					</div>

					<div className="flex items-center gap-3 rounded-lg border p-3">
						<div className="rounded-lg bg-success/10 p-2">
							<Layers className="h-4 w-4 text-success dark:text-success" />
						</div>
						<div>
							<p className="text-muted-foreground text-xs">In Buckets</p>
							<p className="font-semibold text-sm">$166,000</p>
						</div>
					</div>

					<div className="flex items-center gap-3 rounded-lg border p-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Plus className="h-4 w-4 text-primary dark:text-primary" />
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Available</p>
							<p className="font-semibold text-sm">$243,250</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
