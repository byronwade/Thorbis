"use client";

import { Check, Clock, Globe, HelpCircle, Layout, Monitor, Moon, Palette, Sun } from "lucide-react";
import { getUserPreferences, updateUserPreferences } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
	DEFAULT_PREFERENCE_SETTINGS,
	mapPreferencesFromDb,
	type PreferenceSettings,
	type ThemeOption,
} from "./preferences-config";

type PreferencesClientProps = {
	initialSettings: PreferenceSettings;
};

export function PreferencesClient({ initialSettings }: PreferencesClientProps) {
	const { settings, isLoading, isPending, hasUnsavedChanges, updateSetting, saveSettings, reload } =
		useSettings<PreferenceSettings>({
			getter: getUserPreferences,
			setter: updateUserPreferences,
			initialState: DEFAULT_PREFERENCE_SETTINGS,
			settingsName: "preferences",
			prefetchedData: initialSettings,
			transformLoad: (data) => mapPreferencesFromDb(data),
			transformSave: (currentSettings) => {
				const formData = new FormData();
				formData.append("theme", currentSettings.theme);
				formData.append("language", currentSettings.language);
				formData.append("timezone", currentSettings.timezone);
				formData.append("dateFormat", currentSettings.dateFormat);
				formData.append("timeFormat", currentSettings.timeFormat);
				formData.append("defaultPageSize", currentSettings.tableView === "compact" ? "10" : "25");
				return formData;
			},
		});

	const handleSave = () => saveSettings();
	const handleCancel = () => {
		reload();
	};

	return (
		<TooltipProvider>
			<SettingsPageLayout
				description="Customize your interface and application experience"
				hasChanges={hasUnsavedChanges}
				helpText="These preferences control your personal view of Thorbis without impacting other teammates."
				isLoading={isLoading}
				isPending={isPending}
				onCancel={handleCancel}
				onSave={handleSave}
				saveButtonText="Save preferences"
				title="Preferences"
			>
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Palette className="size-4" />
								Interface Theme
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">
											Choose between light, dark, or system theme that follows your device settings
										</p>
									</TooltipContent>
								</Tooltip>
							</CardTitle>
							<CardDescription>Select your preferred interface theme</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-3">
								{(["light", "dark", "system"] as ThemeOption[]).map((option) => {
									const isActive = settings.theme === option;
									const Icon = option === "light" ? Sun : option === "dark" ? Moon : Monitor;
									const label = option === "light" ? "Light" : option === "dark" ? "Dark" : "System";
									return (
										<button
											className={`relative cursor-pointer rounded-lg border-2 p-4 text-left transition-colors ${
												isActive ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/50"
											}`}
											key={option}
											onClick={() => updateSetting("theme", option)}
											type="button"
										>
											<div className="mb-2 flex items-center gap-2">
												<Icon
													className={`h-5 w-5 ${
														option === "light"
															? "text-warning"
															: option === "dark"
																? "text-primary"
																: "text-accent-foreground"
													}`}
												/>
												<span className="font-medium">{label}</span>
												{isActive && <Check className="ml-auto h-4 w-4 text-primary" />}
											</div>
											<p className="text-muted-foreground text-sm">
												{option === "light"
													? "Clean and bright interface"
													: option === "dark"
														? "Easy on the eyes"
														: "Follows device settings"}
											</p>
										</button>
									);
								})}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Globe className="size-4" />
								Language & Region
								<Tooltip>
									<TooltipTrigger>
										<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">
											Configure language, timezone, and regional formats for dates and currency
										</p>
									</TooltipContent>
								</Tooltip>
							</CardTitle>
							<CardDescription>Set your language, timezone, and regional preferences</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Language
										<Tooltip>
											<TooltipTrigger>
												<HelpCircle className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">Set the language for all interface text and labels</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<Select onValueChange={(value) => updateSetting("language", value)} value={settings.language}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en-US">English (US)</SelectItem>
											<SelectItem value="en-GB">English (UK)</SelectItem>
											<SelectItem value="es-ES">Español</SelectItem>
											<SelectItem value="fr-FR">Français</SelectItem>
											<SelectItem value="de-DE">Deutsch</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Timezone
										<Tooltip>
											<TooltipTrigger>
												<HelpCircle className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">All times will be displayed in your selected timezone</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<Select onValueChange={(value) => updateSetting("timezone", value)} value={settings.timezone}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
											<SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
											<SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
											<SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
											<SelectItem value="Europe/London">London (GMT)</SelectItem>
											<SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Date Format
										<Tooltip>
											<TooltipTrigger>
												<HelpCircle className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">Choose how dates are displayed throughout the application</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<Select onValueChange={(value) => updateSetting("dateFormat", value)} value={settings.dateFormat}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="MM/dd/yyyy">MM/DD/YYYY (US)</SelectItem>
											<SelectItem value="dd/MM/yyyy">DD/MM/YYYY (European)</SelectItem>
											<SelectItem value="yyyy-MM-dd">YYYY-MM-DD (ISO)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										Time Format
										<Tooltip>
											<TooltipTrigger>
												<HelpCircle className="h-3 w-3 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-xs">Choose between 12-hour (AM/PM) or 24-hour time format</p>
											</TooltipContent>
										</Tooltip>
									</Label>
									<Select
										onValueChange={(value) => updateSetting("timeFormat", value as "12h" | "24h")}
										value={settings.timeFormat}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="12h">
												<div className="flex items-center gap-2">
													<Clock className="h-3.5 w-3.5" />
													12-hour (3:00 PM)
												</div>
											</SelectItem>
											<SelectItem value="24h">
												<div className="flex items-center gap-2">
													<Clock className="h-3.5 w-3.5" />
													24-hour (15:00)
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Layout className="size-4" />
								Interface Density
							</CardTitle>
							<CardDescription>Control layout density and animation preferences</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<div className="font-medium">Compact mode</div>
									<div className="text-muted-foreground text-sm">Reduce padding and whitespace</div>
								</div>
								<Switch
									checked={settings.compactMode}
									onCheckedChange={(checked) => updateSetting("compactMode", checked)}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<div className="font-medium">Show animations</div>
									<div className="text-muted-foreground text-sm">
										Enable interface transitions and micro-interactions
									</div>
								</div>
								<Switch
									checked={settings.showAnimations}
									onCheckedChange={(checked) => updateSetting("showAnimations", checked)}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<div className="font-medium">Auto-save forms</div>
									<div className="text-muted-foreground text-sm">Automatically save drafts while typing</div>
								</div>
								<Switch
									checked={settings.autoSaveForms}
									onCheckedChange={(checked) => updateSetting("autoSaveForms", checked)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Layout className="size-4" />
								Layout Preferences
							</CardTitle>
							<CardDescription>Sidebar position and table density settings</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<Label className="mb-2 block font-medium text-sm">Sidebar Position</Label>
								<div className="grid gap-4 sm:grid-cols-2">
									{(["left", "right"] as Array<"left" | "right">).map((position) => (
										<button
											className={`rounded-lg border p-4 text-left transition-colors ${
												settings.sidebarPosition === position
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/40"
											}`}
											key={position}
											onClick={() => updateSetting("sidebarPosition", position)}
											type="button"
										>
											<div className="flex items-center justify-between">
												<span className="font-medium">{position === "left" ? "Left" : "Right"} sidebar</span>
												{settings.sidebarPosition === position && <Check className="h-4 w-4 text-primary" />}
											</div>
											<p className="text-muted-foreground text-sm">Navigation appears on the {position}</p>
										</button>
									))}
								</div>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<div className="font-medium">Table density</div>
									<div className="text-muted-foreground text-sm">Default rows per table</div>
								</div>
								<Select
									onValueChange={(value) => updateSetting("tableView", value as "default" | "compact")}
									value={settings.tableView}
								>
									<SelectTrigger className="w-32">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="default">Default (25 rows)</SelectItem>
										<SelectItem value="compact">Compact (10 rows)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-6">
						<div>
							<h3 className="font-semibold text-sm">Reset preferences to defaults</h3>
							<p className="text-muted-foreground text-xs">Restores the recommended Thorbis interface defaults</p>
						</div>
						<Button
							onClick={() => {
								updateSetting("theme", DEFAULT_PREFERENCE_SETTINGS.theme);
								updateSetting("language", DEFAULT_PREFERENCE_SETTINGS.language);
								updateSetting("timezone", DEFAULT_PREFERENCE_SETTINGS.timezone);
								updateSetting("dateFormat", DEFAULT_PREFERENCE_SETTINGS.dateFormat);
								updateSetting("timeFormat", DEFAULT_PREFERENCE_SETTINGS.timeFormat);
								updateSetting("currency", DEFAULT_PREFERENCE_SETTINGS.currency);
								updateSetting("compactMode", DEFAULT_PREFERENCE_SETTINGS.compactMode);
								updateSetting("showAnimations", DEFAULT_PREFERENCE_SETTINGS.showAnimations);
								updateSetting("autoSaveForms", DEFAULT_PREFERENCE_SETTINGS.autoSaveForms);
								updateSetting("sidebarPosition", DEFAULT_PREFERENCE_SETTINGS.sidebarPosition);
								updateSetting("tableView", DEFAULT_PREFERENCE_SETTINGS.tableView);
							}}
							type="button"
							variant="outline"
						>
							Reset to defaults
						</Button>
					</div>
				</div>
			</SettingsPageLayout>
		</TooltipProvider>
	);
}

export default PreferencesClient;
