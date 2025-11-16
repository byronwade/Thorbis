/**
 * IVR Menu Builder
 *
 * Visual drag-and-drop builder for Interactive Voice Response menus:
 * - Visual flow diagram of menu structure
 * - Add/edit menu nodes (greetings, prompts, routing)
 * - Configure keypress options (0-9, *, #)
 * - Audio upload for custom greetings
 * - Test IVR flow
 * - Export/import menu configurations
 */

"use client";

import {
	ArrowRight,
	Clock,
	Edit,
	MessageSquare,
	Phone,
	Play,
	Plus,
	Save,
	Settings,
	Trash2,
	Upload,
	Users,
	Volume2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// IVR Node Types
type NodeType = "greeting" | "menu" | "route" | "voicemail" | "hangup" | "repeat";

// IVR Action Types
type ActionType = "transfer" | "voicemail" | "submenu" | "repeat" | "hangup";

// Keypress option configuration
type KeypressOption = {
	key: string; // 0-9, *, #
	label: string;
	action: ActionType;
	destination?: string; // Phone number, extension, or submenu ID
	description?: string;
};

// IVR Menu Node
type IVRNode = {
	id: string;
	type: NodeType;
	name: string;
	description?: string;
	greeting?: {
		type: "text-to-speech" | "audio-file";
		content: string; // Text or audio file URL
		voice?: string; // TTS voice
	};
	keypressOptions: KeypressOption[];
	timeout?: number; // Seconds before timeout action
	timeoutAction?: ActionType;
	maxRetries?: number;
};

// Full IVR Menu Configuration
type IVRMenu = {
	id: string;
	name: string;
	description: string;
	rootNode: IVRNode;
	nodes: IVRNode[];
};

// Available TTS voices
const ttsVoices = [
	{ value: "female-1", label: "Female - Professional" },
	{ value: "male-1", label: "Male - Professional" },
	{ value: "female-2", label: "Female - Friendly" },
	{ value: "male-2", label: "Male - Friendly" },
];

// Default root node
const defaultRootNode: IVRNode = {
	id: "root",
	type: "greeting",
	name: "Main Menu",
	description: "Primary IVR menu",
	greeting: {
		type: "text-to-speech",
		content: "Thank you for calling. Please listen to the following options.",
		voice: "female-1",
	},
	keypressOptions: [
		{
			key: "1",
			label: "Sales",
			action: "transfer",
			destination: "",
			description: "Route to sales team",
		},
		{
			key: "2",
			label: "Support",
			action: "transfer",
			destination: "",
			description: "Route to support team",
		},
		{
			key: "0",
			label: "Operator",
			action: "transfer",
			destination: "",
			description: "Route to operator",
		},
	],
	timeout: 10,
	timeoutAction: "repeat",
	maxRetries: 3,
};

export function IVRMenuBuilder() {
	const [menu, setMenu] = useState<IVRMenu>({
		id: "menu-1",
		name: "Main IVR Menu",
		description: "Primary customer-facing IVR menu",
		rootNode: defaultRootNode,
		nodes: [defaultRootNode],
	});

	const [selectedNode, setSelectedNode] = useState<IVRNode | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [testMode, setTestMode] = useState(false);

	// Open node editor
	const editNode = (node: IVRNode) => {
		setSelectedNode(node);
		setEditDialogOpen(true);
	};

	// Add keypress option
	const addKeypressOption = (node: IVRNode) => {
		const updatedNode = {
			...node,
			keypressOptions: [
				...node.keypressOptions,
				{
					key: getNextAvailableKey(node.keypressOptions),
					label: "New Option",
					action: "transfer" as ActionType,
					destination: "",
				},
			],
		};
		updateNode(updatedNode);
	};

	// Remove keypress option
	const removeKeypressOption = (node: IVRNode, key: string) => {
		const updatedNode = {
			...node,
			keypressOptions: node.keypressOptions.filter((opt) => opt.key !== key),
		};
		updateNode(updatedNode);
	};

	// Update node in menu
	const updateNode = (updatedNode: IVRNode) => {
		setMenu((prev) => ({
			...prev,
			nodes: prev.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)),
			rootNode: prev.rootNode.id === updatedNode.id ? updatedNode : prev.rootNode,
		}));
		setSelectedNode(updatedNode);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Phone className="size-5" />
								{menu.name}
							</CardTitle>
							<CardDescription>{menu.description}</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Button onClick={() => setTestMode(!testMode)} size="sm" variant="outline">
								<Play className="mr-2 size-3" />
								{testMode ? "Stop Test" : "Test Menu"}
							</Button>
							<Button size="sm">
								<Save className="mr-2 size-3" />
								Save Menu
							</Button>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Test Mode Panel */}
			{testMode && (
				<Card className="border-primary bg-primary dark:border-primary dark:bg-primary/20">
					<CardHeader>
						<CardTitle className="text-base text-primary dark:text-primary">Test Mode Active</CardTitle>
						<CardDescription className="text-primary dark:text-primary">
							Simulate calling your IVR menu. Press keys to navigate.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border bg-background p-4">
							<div className="mb-3 flex items-center gap-2">
								<Volume2 className="size-4" />
								<span className="text-sm">"{menu.rootNode.greeting?.content}"</span>
							</div>
							<div className="grid grid-cols-3 gap-2">
								{menu.rootNode.keypressOptions.map((option) => (
									<Button key={option.key} size="sm" variant="outline">
										{option.key} - {option.label}
									</Button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Visual Flow Diagram */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Menu Flow</CardTitle>
					<CardDescription>Visual representation of your IVR menu structure</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Root Node */}
						<IVRNodeCard isRoot={true} node={menu.rootNode} onEdit={() => editNode(menu.rootNode)} />

						{/* Keypress Options Flow */}
						<div className="ml-8 space-y-3 border-l-2 border-dashed pl-6">
							{menu.rootNode.keypressOptions.map((option) => (
								<div className="space-y-2" key={option.key}>
									<div className="flex items-center gap-3">
										<Badge className="font-mono" variant="secondary">
											Press {option.key}
										</Badge>
										<ArrowRight className="size-4 text-muted-foreground" />
										<div className="flex-1">
											<div className="font-medium">{option.label}</div>
											<div className="text-muted-foreground text-sm">
												{getActionLabel(option.action)}
												{option.destination && ` → ${option.destination}`}
											</div>
										</div>
										<Button
											onClick={() => {
												// Edit keypress option
											}}
											size="sm"
											variant="ghost"
										>
											<Edit className="size-3" />
										</Button>
									</div>
								</div>
							))}

							{/* Timeout Action */}
							{menu.rootNode.timeout && (
								<div className="flex items-center gap-3 opacity-60">
									<Badge className="gap-1" variant="outline">
										<Clock className="size-3" />
										{menu.rootNode.timeout}s timeout
									</Badge>
									<ArrowRight className="size-4 text-muted-foreground" />
									<div className="text-muted-foreground text-sm">
										{getActionLabel(menu.rootNode.timeoutAction || "repeat")}
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="font-bold text-2xl">{menu.rootNode.keypressOptions.length}</div>
						<div className="text-muted-foreground text-sm">Menu Options</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="font-bold text-2xl">{menu.rootNode.timeout}s</div>
						<div className="text-muted-foreground text-sm">Timeout</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="font-bold text-2xl">{menu.rootNode.maxRetries}</div>
						<div className="text-muted-foreground text-sm">Max Retries</div>
					</CardContent>
				</Card>
			</div>

			{/* Node Editor Dialog */}
			{selectedNode && (
				<NodeEditorDialog
					node={selectedNode}
					onAddKeypress={() => addKeypressOption(selectedNode)}
					onOpenChange={setEditDialogOpen}
					onRemoveKeypress={(key) => removeKeypressOption(selectedNode, key)}
					onUpdate={updateNode}
					open={editDialogOpen}
				/>
			)}
		</div>
	);
}

function IVRNodeCard({ node, isRoot, onEdit }: { node: IVRNode; isRoot?: boolean; onEdit: () => void }) {
	const getNodeIcon = () => {
		switch (node.type) {
			case "greeting":
				return <Volume2 className="size-4" />;
			case "menu":
				return <Phone className="size-4" />;
			case "route":
				return <Users className="size-4" />;
			case "voicemail":
				return <MessageSquare className="size-4" />;
			default:
				return <Settings className="size-4" />;
		}
	};

	return (
		<Card className={cn(isRoot && "border-primary")}>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="rounded-lg border bg-muted p-2">{getNodeIcon()}</div>
						<div>
							<CardTitle className="text-base">{node.name}</CardTitle>
							{node.description && <CardDescription className="text-xs">{node.description}</CardDescription>}
						</div>
					</div>
					<Button onClick={onEdit} size="icon" variant="ghost">
						<Edit className="size-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{node.greeting && (
					<div className="rounded-lg bg-muted/50 p-3 text-sm">
						<div className="mb-1 flex items-center gap-2 text-muted-foreground text-xs">
							<Volume2 className="size-3" />
							{node.greeting.type === "text-to-speech" ? "Text-to-Speech" : "Audio File"}
						</div>
						<div className="line-clamp-2">{node.greeting.content}</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function NodeEditorDialog({
	node,
	open,
	onOpenChange,
	onUpdate,
	onAddKeypress,
	onRemoveKeypress,
}: {
	node: IVRNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate: (node: IVRNode) => void;
	onAddKeypress: () => void;
	onRemoveKeypress: (key: string) => void;
}) {
	const [editedNode, setEditedNode] = useState(node);

	const handleSave = () => {
		onUpdate(editedNode);
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit IVR Node: {node.name}</DialogTitle>
					<DialogDescription>Configure the greeting, options, and behavior for this menu node</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Info */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="node-name">Node Name</Label>
							<Input
								id="node-name"
								onChange={(e) => setEditedNode({ ...editedNode, name: e.target.value })}
								value={editedNode.name}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="node-description">Description (Optional)</Label>
							<Input
								id="node-description"
								onChange={(e) => setEditedNode({ ...editedNode, description: e.target.value })}
								value={editedNode.description || ""}
							/>
						</div>
					</div>

					{/* Greeting */}
					<div className="space-y-4">
						<Label>Greeting</Label>

						<Select
							onValueChange={(value: "text-to-speech" | "audio-file") =>
								setEditedNode({
									...editedNode,
									greeting: { ...editedNode.greeting!, type: value },
								})
							}
							value={editedNode.greeting?.type}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="text-to-speech">Text-to-Speech</SelectItem>
								<SelectItem value="audio-file">Upload Audio File</SelectItem>
							</SelectContent>
						</Select>

						{editedNode.greeting?.type === "text-to-speech" ? (
							<>
								<Textarea
									onChange={(e) =>
										setEditedNode({
											...editedNode,
											greeting: {
												...editedNode.greeting!,
												content: e.target.value,
											},
										})
									}
									placeholder="Enter the greeting text..."
									rows={3}
									value={editedNode.greeting.content}
								/>

								<Select
									onValueChange={(value) =>
										setEditedNode({
											...editedNode,
											greeting: { ...editedNode.greeting!, voice: value },
										})
									}
									value={editedNode.greeting.voice}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select voice" />
									</SelectTrigger>
									<SelectContent>
										{ttsVoices.map((voice) => (
											<SelectItem key={voice.value} value={voice.value}>
												{voice.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</>
						) : (
							<Button className="w-full" variant="outline">
								<Upload className="mr-2 size-4" />
								Upload Audio File (MP3, WAV)
							</Button>
						)}
					</div>

					{/* Keypress Options */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Keypress Options</Label>
							<Button onClick={onAddKeypress} size="sm" variant="outline">
								<Plus className="mr-2 size-3" />
								Add Option
							</Button>
						</div>

						<div className="space-y-3">
							{editedNode.keypressOptions.map((option, index) => (
								<Card key={option.key}>
									<CardContent className="pt-4">
										<div className="grid gap-3">
											<div className="grid grid-cols-3 gap-3">
												<div className="space-y-2">
													<Label>Key</Label>
													<Select
														onValueChange={(value) => {
															const updated = [...editedNode.keypressOptions];
															updated[index] = { ...option, key: value };
															setEditedNode({
																...editedNode,
																keypressOptions: updated,
															});
														}}
														value={option.key}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "#"].map((key) => (
																<SelectItem key={key} value={key}>
																	{key}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="col-span-2 space-y-2">
													<Label>Label</Label>
													<Input
														onChange={(e) => {
															const updated = [...editedNode.keypressOptions];
															updated[index] = {
																...option,
																label: e.target.value,
															};
															setEditedNode({
																...editedNode,
																keypressOptions: updated,
															});
														}}
														value={option.label}
													/>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div className="space-y-2">
													<Label>Action</Label>
													<Select
														onValueChange={(value: ActionType) => {
															const updated = [...editedNode.keypressOptions];
															updated[index] = { ...option, action: value };
															setEditedNode({
																...editedNode,
																keypressOptions: updated,
															});
														}}
														value={option.action}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="transfer">Transfer to Number</SelectItem>
															<SelectItem value="voicemail">Send to Voicemail</SelectItem>
															<SelectItem value="submenu">Go to Submenu</SelectItem>
															<SelectItem value="repeat">Repeat Menu</SelectItem>
															<SelectItem value="hangup">Hang Up</SelectItem>
														</SelectContent>
													</Select>
												</div>

												{(option.action === "transfer" || option.action === "submenu") && (
													<div className="space-y-2">
														<Label>{option.action === "transfer" ? "Phone Number" : "Submenu"}</Label>
														<Input
															onChange={(e) => {
																const updated = [...editedNode.keypressOptions];
																updated[index] = {
																	...option,
																	destination: e.target.value,
																};
																setEditedNode({
																	...editedNode,
																	keypressOptions: updated,
																});
															}}
															placeholder={option.action === "transfer" ? "+1 (555) 123-4567" : "Select submenu"}
															value={option.destination || ""}
														/>
													</div>
												)}
											</div>

											<div className="flex justify-end">
												<Button onClick={() => onRemoveKeypress(option.key)} size="sm" variant="ghost">
													<Trash2 className="mr-2 size-3" />
													Remove
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Advanced Settings */}
					<div className="space-y-4">
						<Label>Advanced Settings</Label>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="timeout">Timeout (seconds)</Label>
								<Input
									id="timeout"
									max="60"
									min="5"
									onChange={(e) =>
										setEditedNode({
											...editedNode,
											timeout: Number.parseInt(e.target.value, 10),
										})
									}
									type="number"
									value={editedNode.timeout}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="maxRetries">Max Retries</Label>
								<Input
									id="maxRetries"
									max="10"
									min="1"
									onChange={(e) =>
										setEditedNode({
											...editedNode,
											maxRetries: Number.parseInt(e.target.value, 10),
										})
									}
									type="number"
									value={editedNode.maxRetries}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Timeout Action</Label>
							<Select
								onValueChange={(value: ActionType) => setEditedNode({ ...editedNode, timeoutAction: value })}
								value={editedNode.timeoutAction}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="repeat">Repeat Menu</SelectItem>
									<SelectItem value="voicemail">Send to Voicemail</SelectItem>
									<SelectItem value="transfer">Transfer to Operator</SelectItem>
									<SelectItem value="hangup">Hang Up</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Helper functions

function getNextAvailableKey(options: KeypressOption[]): string {
	const usedKeys = new Set(options.map((opt) => opt.key));
	const availableKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"];
	return availableKeys.find((key) => !usedKeys.has(key)) || "1";
}

function getActionLabel(action: ActionType): string {
	switch (action) {
		case "transfer":
			return "Transfer Call";
		case "voicemail":
			return "Voicemail";
		case "submenu":
			return "Submenu";
		case "repeat":
			return "Repeat Menu";
		case "hangup":
			return "Hang Up";
		default:
			return action;
	}
}
