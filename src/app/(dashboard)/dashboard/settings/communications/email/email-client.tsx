"use client";

import {
	Copy,
	Globe,
	HelpCircle,
	Loader2,
	Mail,
	RefreshCcw,
	Server,
	Settings as SettingsIcon,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import {
	ensureInboundRoute,
	provisionEmailDomain,
	refreshEmailDomain,
	verifyEmailDomain,
} from "@/actions/email-domains";
import { getEmailSettings, updateEmailSettings } from "@/actions/settings";
import { getEmailInfrastructure } from "@/actions/settings/communications";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import {
	DEFAULT_EMAIL_SETTINGS,
	type EmailSettingsState,
	mapEmailSettings,
} from "./email-config";

type EmailSettingsClientProps = {
	initialSettings: Partial<EmailSettingsState> | null;
	initialInfrastructure?: {
		domain: Record<string, unknown> | null;
		inboundRoute: Record<string, unknown> | null;
	};
};

const MAX_SIGNATURE_LENGTH = 300;

export function EmailSettingsClient({
	initialSettings,
	initialInfrastructure,
}: EmailSettingsClientProps) {
	const {
		settings,
		isLoading,
		isPending,
		hasUnsavedChanges,
		updateSetting,
		saveSettings,
		reload,
	} = useSettings<EmailSettingsState>({
		getter: getEmailSettings,
		setter: updateEmailSettings,
		initialState: DEFAULT_EMAIL_SETTINGS,
		settingsName: "email",
		prefetchedData: initialSettings ?? undefined,
		transformLoad: (data) => mapEmailSettings(data),
		transformSave: (state) => {
			const formData = new FormData();
			formData.append("smtpEnabled", state.smtpEnabled.toString());
			formData.append("smtpHost", state.smtpHost);
			formData.append("smtpPort", state.smtpPort);
			formData.append("smtpUsername", state.smtpUsername);
			if (state.smtpPassword) {
				formData.append("smtpPassword", state.smtpPassword);
			}
			formData.append("smtpFromEmail", state.smtpFromEmail);
			formData.append("smtpFromName", state.smtpFromName);
			formData.append("smtpUseTls", state.smtpUseTls.toString());
			formData.append("defaultSignature", state.defaultSignature);
			formData.append("autoCcEnabled", state.autoCcEnabled.toString());
			formData.append("autoCcEmail", state.autoCcEmail);
			formData.append("trackOpens", state.trackOpens.toString());
			formData.append("trackClicks", state.trackClicks.toString());
			formData.append("emailLogoUrl", state.emailLogoUrl);
			formData.append("primaryColor", state.primaryColor);
			return formData;
		},
	});
	const { toast } = useToast();
	const [infra, setInfra] = useState<{
		domain: Record<string, any> | null;
		inboundRoute: Record<string, any> | null;
	}>(initialInfrastructure ?? { domain: null, inboundRoute: null });
	const [infraLoading, setInfraLoading] = useState(false);
	const [domainInput, setDomainInput] = useState<string>(
		(initialInfrastructure?.domain as any)?.domain || "",
	);
	const [isProvisioningDomain, startProvisionDomain] = useTransition();
	const [isSyncingDomain, startSyncDomain] = useTransition();
	const [isEnsuringInbound, startEnsureInbound] = useTransition();

	const handleSave = useCallback(() => {
		void saveSettings();
	}, [saveSettings]);

	const handleCancel = useCallback(() => {
		void reload();
	}, [reload]);

	const refreshInfrastructure = useCallback(async () => {
		setInfraLoading(true);
		const result = await getEmailInfrastructure();
		if (result.success && result.data) {
			setInfra(result.data);
			if (!domainInput && result.data.domain?.domain) {
				setDomainInput((result.data.domain.domain as string) || "");
			}
		}
		setInfraLoading(false);
	}, [domainInput]);

	const handleProvisionDomain = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const trimmed = domainInput.trim();
			if (!trimmed) {
				toast.error("Enter a domain name to continue");
				return;
			}

			const formData = new FormData();
			formData.append("domain", trimmed);

			startProvisionDomain(async () => {
				const result = await provisionEmailDomain(formData);
				if (result.success) {
					toast.success("Domain provisioning started");
					setDomainInput("");
					await refreshInfrastructure();
				} else {
					toast.error(result.error || "Failed to provision domain");
				}
			});
		},
		[domainInput, refreshInfrastructure, toast],
	);

	const handleRefreshDomain = useCallback(() => {
		if (!infra.domain?.id) {
			return;
		}
		startSyncDomain(async () => {
			const result = await refreshEmailDomain(infra.domain?.id);
			if (result.success) {
				toast.success("Domain status refreshed");
				await refreshInfrastructure();
			} else {
				toast.error(result.error || "Failed to refresh domain");
			}
		});
	}, [infra.domain, refreshInfrastructure, toast]);

	const handleVerifyDomain = useCallback(() => {
		if (!infra.domain?.id) {
			return;
		}
		startSyncDomain(async () => {
			const result = await verifyEmailDomain(infra.domain?.id);
			if (result.success) {
				toast.success("Verification requested");
			} else {
				toast.error(result.error || "Failed to trigger verification");
			}
		});
	}, [infra.domain, toast]);

	const handleEnsureInbound = useCallback(() => {
		startEnsureInbound(async () => {
			const result = await ensureInboundRoute();
			if (result.success) {
				toast.success("Inbound routing enabled");
				await refreshInfrastructure();
			} else {
				toast.error(result.error || "Failed to enable inbound routing");
			}
		});
	}, [refreshInfrastructure, toast]);

	const handleCopy = useCallback(
		async (value: string) => {
			try {
				await navigator.clipboard.writeText(value);
				toast.success("Copied to clipboard");
			} catch {
				toast.error("Failed to copy");
			}
		},
		[toast],
	);

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Configure outbound email identity, SMTP connection, and tracking."
				hasChanges={hasUnsavedChanges}
				helpText="Settings apply to all customer-facing emails from Thorbis."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save email settings"
				title="Email"
			>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings">Settings</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/dashboard/settings/communications">
										Communications
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Email</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button asChild variant="ghost">
						<Link href="/dashboard/settings/communications">
							<SettingsIcon className="mr-2 size-4" />
							Back to communications
						</Link>
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="size-4" />
							Sending Domain
							{infra.domain && (
								<Badge className="text-xs capitalize" variant="outline">
									{infra.domain?.status || ""}
								</Badge>
							)}
						</CardTitle>
						<CardDescription>
							Thorbis provisions a dedicated Resend domain per company to
							maximize deliverability.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{infraLoading ? (
							<p className="text-muted-foreground text-sm">
								Loading domain status...
							</p>
						) : infra.domain ? (
							<div className="space-y-4">
								<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
									<div>
										<p className="font-semibold">
											{(infra.domain as any)?.domain || ""}
										</p>
										<p className="text-muted-foreground text-xs">
											Last synced at{" "}
											{(infra.domain as any)?.last_synced_at
												? new Date(
														(infra.domain as any).last_synced_at,
													).toLocaleString()
												: "pending"}
										</p>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button
											disabled={isSyncingDomain}
											onClick={handleRefreshDomain}
											size="sm"
											type="button"
											variant="outline"
										>
											{isSyncingDomain ? (
												<Loader2 className="mr-2 size-4 animate-spin" />
											) : (
												<RefreshCcw className="mr-2 size-4" />
											)}
											Refresh
										</Button>
										<Button
											disabled={isSyncingDomain}
											onClick={handleVerifyDomain}
											size="sm"
											type="button"
										>
											Trigger Verification
										</Button>
									</div>
								</div>
								<Separator />
								<div className="space-y-3">
									<p className="font-medium text-sm">DNS Records</p>
									{Array.isArray((infra.domain as any)?.dns_records) &&
									(infra.domain as any)?.dns_records.length > 0 ? (
										((infra.domain as any).dns_records as any[]).map(
											(
												record: {
													type?: string;
													name?: string;
													host?: string;
													value?: string;
												},
												index: number,
											) => (
												<div
													className="rounded-lg border bg-muted/40 p-3"
													key={`${record.type}-${record.name}-${index}`}
												>
													<div className="flex items-center justify-between">
														<div>
															<p className="font-semibold text-sm">
																{record.type || "Record"}
															</p>
															<p className="text-muted-foreground text-xs">
																{record.name || record.host || "Host"}
															</p>
														</div>
														<Badge variant="secondary">
															{record.type || "TXT"}
														</Badge>
													</div>
													{record.value && (
														<div className="mt-2 flex items-center justify-between rounded bg-background px-3 py-2 font-mono text-xs">
															<span className="mr-4 flex-1 truncate">
																{record.value}
															</span>
															<Button
																onClick={() => handleCopy(record.value!)}
																size="sm"
																type="button"
																variant="ghost"
															>
																<Copy className="mr-1 size-3" />
																Copy
															</Button>
														</div>
													)}
												</div>
											),
										)
									) : (
										<p className="text-muted-foreground text-xs">
											DNS records will appear here once generated by Resend.
										</p>
									)}
								</div>
							</div>
						) : (
							<form className="space-y-3" onSubmit={handleProvisionDomain}>
								<div>
									<Label>Domain name</Label>
									<Input
										className="mt-2"
										onChange={(event) => setDomainInput(event.target.value)}
										placeholder="acme.com"
										value={domainInput}
									/>
									<p className="mt-1 text-muted-foreground text-xs">
										We’ll walk you through DNS verification once created.
									</p>
								</div>
								<Button disabled={isProvisioningDomain} type="submit">
									{isProvisioningDomain ? (
										<>
											<Loader2 className="mr-2 size-4 animate-spin" />
											Provisioning...
										</>
									) : (
										"Provision Domain"
									)}
								</Button>
							</form>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShieldCheck className="size-4" />
							Inbound Automation
						</CardTitle>
						<CardDescription>
							Capture customer replies via Resend inbound routing.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{infraLoading ? (
							<p className="text-muted-foreground text-sm">
								Loading inbound configuration...
							</p>
						) : infra.inboundRoute ? (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold text-sm">
											{infra.inboundRoute?.route_address || ""}
										</p>
										<p className="text-muted-foreground text-xs">
											Forwards to {infra.inboundRoute?.destination_url || ""}
										</p>
									</div>
									<Badge className="text-xs capitalize" variant="outline">
										{infra.inboundRoute?.status || ""}
									</Badge>
								</div>
								<div className="rounded-lg bg-muted/40 px-3 py-2 font-mono text-xs">
									<div className="flex items-center justify-between gap-3">
										<span className="truncate">
											{infra.inboundRoute?.route_address || ""}
										</span>
										<Button
											onClick={() =>
												handleCopy(
													(infra.inboundRoute?.route_address as string) || "",
												)
											}
											size="sm"
											type="button"
											variant="ghost"
										>
											<Copy className="mr-1 size-3" />
											Copy
										</Button>
									</div>
								</div>
								{infra.inboundRoute.signing_secret && (
									<div className="rounded-lg bg-muted/40 px-3 py-2 font-mono text-xs">
										<div className="flex items-center justify-between gap-3">
											<span className="truncate">
												{infra.inboundRoute?.signing_secret || ""}
											</span>
											<Button
												onClick={() =>
													handleCopy(
														(infra.inboundRoute?.signing_secret as string) ||
															"",
													)
												}
												size="sm"
												type="button"
												variant="ghost"
											>
												<Copy className="mr-1 size-3" />
												Copy secret
											</Button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="space-y-3">
								<p className="text-muted-foreground text-sm">
									Enable inbound routing to automatically capture replies and
									direct emails sent to your support address.
								</p>
								<Button
									disabled={isEnsuringInbound}
									onClick={handleEnsureInbound}
									type="button"
								>
									{isEnsuringInbound ? (
										<>
											<Loader2 className="mr-2 size-4 animate-spin" />
											Enabling...
										</>
									) : (
										"Enable Inbound Routing"
									)}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="size-4" />
							Email Identity
						</CardTitle>
						<CardDescription>
							Addresses and names customers see in their inbox
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label className="flex items-center gap-2 font-medium text-sm">
									From email address
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="size-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											Address shown to customers; must be verified.
										</TooltipContent>
									</Tooltip>
								</Label>
								<Input
									className="mt-2"
									onChange={(event) =>
										updateSetting("smtpFromEmail", event.target.value)
									}
									placeholder="info@yourcompany.com"
									type="email"
									value={settings.smtpFromEmail}
								/>
								<p className="mt-1 text-muted-foreground text-xs">
									Appears in the From field for all outbound emails.
								</p>
							</div>
							<div>
								<Label className="flex items-center gap-2 font-medium text-sm">
									From name
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="size-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											Usually your company name or team name.
										</TooltipContent>
									</Tooltip>
								</Label>
								<Input
									className="mt-2"
									onChange={(event) =>
										updateSetting("smtpFromName", event.target.value)
									}
									placeholder="Thorbis Field Services"
									value={settings.smtpFromName}
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<div className="flex items-center justify-between">
									<div>
										<Label className="flex items-center gap-2 font-medium text-sm">
											Auto CC teammates
										</Label>
										<p className="text-muted-foreground text-xs">
											Copy another address on all outbound emails.
										</p>
									</div>
									<Switch
										checked={settings.autoCcEnabled}
										onCheckedChange={(checked) =>
											updateSetting("autoCcEnabled", checked)
										}
									/>
								</div>
								{settings.autoCcEnabled && (
									<Input
										className="mt-2"
										onChange={(event) =>
											updateSetting("autoCcEmail", event.target.value)
										}
										placeholder="support@yourcompany.com"
										type="email"
										value={settings.autoCcEmail}
									/>
								)}
							</div>
							<div>
								<Label className="flex items-center gap-2 font-medium text-sm">
									Brand color
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="size-3 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											Used for buttons and highlights in emails.
										</TooltipContent>
									</Tooltip>
								</Label>
								<div className="mt-2 flex items-center gap-2">
									<Input
										className="w-20"
										onChange={(event) =>
											updateSetting("primaryColor", event.target.value)
										}
										type="color"
										value={settings.primaryColor}
									/>
									<Input disabled value={settings.primaryColor} />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Server className="size-4" />
							SMTP Connection
						</CardTitle>
						<CardDescription>
							Use your own mail server or Thorbis default
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="font-medium text-sm">Custom SMTP</p>
								<p className="text-muted-foreground text-xs">
									Route mail through your provider (Google, Microsoft, etc.)
								</p>
							</div>
							<Switch
								checked={settings.smtpEnabled}
								onCheckedChange={(checked) =>
									updateSetting("smtpEnabled", checked)
								}
							/>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label className="font-medium text-sm">SMTP host</Label>
								<Input
									className="mt-2"
									disabled={!settings.smtpEnabled}
									onChange={(event) =>
										updateSetting("smtpHost", event.target.value)
									}
									placeholder="smtp.gmail.com"
									value={settings.smtpHost}
								/>
							</div>
							<div>
								<Label className="font-medium text-sm">SMTP port</Label>
								<Input
									className="mt-2"
									disabled={!settings.smtpEnabled}
									onChange={(event) =>
										updateSetting("smtpPort", event.target.value)
									}
									placeholder="587"
									type="number"
									value={settings.smtpPort}
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label className="font-medium text-sm">Username</Label>
								<Input
									className="mt-2"
									disabled={!settings.smtpEnabled}
									onChange={(event) =>
										updateSetting("smtpUsername", event.target.value)
									}
									placeholder="you@yourcompany.com"
									value={settings.smtpUsername}
								/>
							</div>
							<div>
								<Label className="font-medium text-sm">
									Password{" "}
									<span className="text-muted-foreground text-xs">
										(leave blank to keep existing)
									</span>
								</Label>
								<Input
									className="mt-2"
									disabled={!settings.smtpEnabled}
									onChange={(event) =>
										updateSetting("smtpPassword", event.target.value)
									}
									placeholder="••••••••"
									type="password"
									value={settings.smtpPassword}
								/>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-sm">Use TLS (recommended)</p>
								<p className="text-muted-foreground text-xs">
									Encrypts traffic between Thorbis and your SMTP provider.
								</p>
							</div>
							<Switch
								checked={settings.smtpUseTls}
								disabled={!settings.smtpEnabled}
								onCheckedChange={(checked) =>
									updateSetting("smtpUseTls", checked)
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Signature & Branding</CardTitle>
						<CardDescription>
							Content appended to all outbound emails
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label className="flex items-center gap-2 font-medium text-sm">
								Signature
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="size-3 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										Plain text signature shown below every message.
									</TooltipContent>
								</Tooltip>
							</Label>
							<Textarea
								className="mt-2 min-h-[140px] resize-none"
								maxLength={MAX_SIGNATURE_LENGTH}
								onChange={(event) =>
									updateSetting("defaultSignature", event.target.value)
								}
								placeholder="Thanks for choosing Thorbis..."
								value={settings.defaultSignature}
							/>
							<p className="mt-1 text-muted-foreground text-xs">
								{settings.defaultSignature.length} / {MAX_SIGNATURE_LENGTH}{" "}
								characters
							</p>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-sm">Include company logo</p>
								<p className="text-muted-foreground text-xs">
									Adds your logo to the email header.
								</p>
							</div>
							<Switch
								checked={Boolean(settings.emailLogoUrl)}
								onCheckedChange={(checked) =>
									updateSetting("emailLogoUrl", checked ? "default" : "")
								}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Engagement Tracking</CardTitle>
						<CardDescription>
							Monitor how customers interact with your emails
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-sm">Track opens</p>
								<p className="text-muted-foreground text-xs">
									Inserts an invisible pixel to detect when an email is read.
								</p>
							</div>
							<Switch
								checked={settings.trackOpens}
								onCheckedChange={(checked) =>
									updateSetting("trackOpens", checked)
								}
							/>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-sm">Track link clicks</p>
								<p className="text-muted-foreground text-xs">
									Rewrites links to measure engagement.
								</p>
							</div>
							<Switch
								checked={settings.trackClicks}
								onCheckedChange={(checked) =>
									updateSetting("trackClicks", checked)
								}
							/>
						</div>
					</CardContent>
				</Card>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default EmailSettingsClient;
