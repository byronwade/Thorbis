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

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Phone,
  Plus,
  Trash2,
  Edit,
  Play,
  Upload,
  Save,
  ArrowRight,
  Volume2,
  Users,
  Clock,
  MessageSquare,
  Settings,
} from "lucide-react";
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
              <Button variant="outline" size="sm" onClick={() => setTestMode(!testMode)}>
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
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-base text-blue-900 dark:text-blue-100">
              Test Mode Active
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Simulate calling your IVR menu. Press keys to navigate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-background p-4">
              <div className="mb-3 flex items-center gap-2">
                <Volume2 className="size-4" />
                <span className="text-sm">
                  "{menu.rootNode.greeting?.content}"
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {menu.rootNode.keypressOptions.map((option) => (
                  <Button key={option.key} variant="outline" size="sm">
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
            <IVRNodeCard
              node={menu.rootNode}
              isRoot={true}
              onEdit={() => editNode(menu.rootNode)}
            />

            {/* Keypress Options Flow */}
            <div className="ml-8 space-y-3 border-l-2 border-dashed pl-6">
              {menu.rootNode.keypressOptions.map((option) => (
                <div key={option.key} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      Press {option.key}
                    </Badge>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {getActionLabel(option.action)}
                        {option.destination && ` → ${option.destination}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Edit keypress option
                      }}
                    >
                      <Edit className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Timeout Action */}
              {menu.rootNode.timeout && (
                <div className="flex items-center gap-3 opacity-60">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="size-3" />
                    {menu.rootNode.timeout}s timeout
                  </Badge>
                  <ArrowRight className="size-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
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
            <div className="text-2xl font-bold">{menu.rootNode.keypressOptions.length}</div>
            <div className="text-sm text-muted-foreground">Menu Options</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{menu.rootNode.timeout}s</div>
            <div className="text-sm text-muted-foreground">Timeout</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{menu.rootNode.maxRetries}</div>
            <div className="text-sm text-muted-foreground">Max Retries</div>
          </CardContent>
        </Card>
      </div>

      {/* Node Editor Dialog */}
      {selectedNode && (
        <NodeEditorDialog
          node={selectedNode}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={updateNode}
          onAddKeypress={() => addKeypressOption(selectedNode)}
          onRemoveKeypress={(key) => removeKeypressOption(selectedNode, key)}
        />
      )}
    </div>
  );
}

function IVRNodeCard({
  node,
  isRoot,
  onEdit,
}: {
  node: IVRNode;
  isRoot?: boolean;
  onEdit: () => void;
}) {
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
              {node.description && (
                <CardDescription className="text-xs">{node.description}</CardDescription>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {node.greeting && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit IVR Node: {node.name}</DialogTitle>
          <DialogDescription>
            Configure the greeting, options, and behavior for this menu node
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-name">Node Name</Label>
              <Input
                id="node-name"
                value={editedNode.name}
                onChange={(e) => setEditedNode({ ...editedNode, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-description">Description (Optional)</Label>
              <Input
                id="node-description"
                value={editedNode.description || ""}
                onChange={(e) =>
                  setEditedNode({ ...editedNode, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Greeting */}
          <div className="space-y-4">
            <Label>Greeting</Label>

            <Select
              value={editedNode.greeting?.type}
              onValueChange={(value: "text-to-speech" | "audio-file") =>
                setEditedNode({
                  ...editedNode,
                  greeting: { ...editedNode.greeting!, type: value },
                })
              }
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
                  placeholder="Enter the greeting text..."
                  value={editedNode.greeting.content}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      greeting: { ...editedNode.greeting!, content: e.target.value },
                    })
                  }
                  rows={3}
                />

                <Select
                  value={editedNode.greeting.voice}
                  onValueChange={(value) =>
                    setEditedNode({
                      ...editedNode,
                      greeting: { ...editedNode.greeting!, voice: value },
                    })
                  }
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
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 size-4" />
                Upload Audio File (MP3, WAV)
              </Button>
            )}
          </div>

          {/* Keypress Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Keypress Options</Label>
              <Button variant="outline" size="sm" onClick={onAddKeypress}>
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
                            value={option.key}
                            onValueChange={(value) => {
                              const updated = [...editedNode.keypressOptions];
                              updated[index] = { ...option, key: value };
                              setEditedNode({ ...editedNode, keypressOptions: updated });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "#"].map(
                                (key) => (
                                  <SelectItem key={key} value={key}>
                                    {key}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={option.label}
                            onChange={(e) => {
                              const updated = [...editedNode.keypressOptions];
                              updated[index] = { ...option, label: e.target.value };
                              setEditedNode({ ...editedNode, keypressOptions: updated });
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Action</Label>
                          <Select
                            value={option.action}
                            onValueChange={(value: ActionType) => {
                              const updated = [...editedNode.keypressOptions];
                              updated[index] = { ...option, action: value };
                              setEditedNode({ ...editedNode, keypressOptions: updated });
                            }}
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
                            <Label>
                              {option.action === "transfer" ? "Phone Number" : "Submenu"}
                            </Label>
                            <Input
                              value={option.destination || ""}
                              onChange={(e) => {
                                const updated = [...editedNode.keypressOptions];
                                updated[index] = { ...option, destination: e.target.value };
                                setEditedNode({ ...editedNode, keypressOptions: updated });
                              }}
                              placeholder={
                                option.action === "transfer" ? "+1 (555) 123-4567" : "Select submenu"
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveKeypress(option.key)}
                        >
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
                  type="number"
                  min="5"
                  max="60"
                  value={editedNode.timeout}
                  onChange={(e) =>
                    setEditedNode({ ...editedNode, timeout: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRetries">Max Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  min="1"
                  max="10"
                  value={editedNode.maxRetries}
                  onChange={(e) =>
                    setEditedNode({ ...editedNode, maxRetries: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timeout Action</Label>
              <Select
                value={editedNode.timeoutAction}
                onValueChange={(value: ActionType) =>
                  setEditedNode({ ...editedNode, timeoutAction: value })
                }
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
