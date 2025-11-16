"use client";

/**
 * Call Flow Designer - Visual call routing flow builder
 *
 * Features:
 * - Drag-and-drop flow builder
 * - Multiple flow types (IVR, routing, voicemail)
 * - Visual representation of call paths
 * - Test and simulate call flows
 * - Save and publish flows
 */

import { Phone, Play, Plus, Workflow, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CallFlowDesigner() {
  const [flows, _setFlows] = useState([
    {
      id: "1",
      name: "Main Reception",
      type: "ivr",
      status: "active",
      steps: 5,
    },
    {
      id: "2",
      name: "After Hours",
      type: "voicemail",
      status: "active",
      steps: 2,
    },
    {
      id: "3",
      name: "Sales Team",
      type: "routing",
      status: "draft",
      steps: 3,
    },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="size-5" />
                Call Flows
              </CardTitle>
              <CardDescription>
                Design and manage visual call routing flows
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 size-4" />
              Create Flow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flows.map((flow) => (
              <Card key={flow.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{flow.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Badge className="text-xs" variant="outline">
                          {flow.type}
                        </Badge>
                        <span className="text-xs">{flow.steps} steps</span>
                      </CardDescription>
                    </div>
                    {flow.status === "active" ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" size="sm" variant="outline">
                    <Zap className="mr-2 size-4" />
                    Edit Flow
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <Play className="mr-2 size-4" />
                    Test Flow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Workflow className="mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">Visual Flow Builder</h3>
          <p className="mb-6 max-w-sm text-muted-foreground text-sm">
            Design complex call routing with our drag-and-drop flow builder.
            Create IVR menus, conditional routing, and multi-step workflows.
          </p>
          <Button>
            <Plus className="mr-2 size-4" />
            Create Your First Flow
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="font-medium text-primary text-sm dark:text-primary">
              Flow Design Best Practices
            </p>
            <p className="text-muted-foreground text-sm">
              Keep IVR menus simple with 3-4 options maximum. Always provide an
              option to reach a live person. Test your flows before publishing.
              Use clear, concise voice prompts. Consider peak hours when
              designing call capacity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
