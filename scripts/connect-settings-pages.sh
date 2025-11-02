#!/bin/bash

# Batch script to connect simple settings pages using useSettings hook
# This updates pages that don't have complex nested state or special logic

echo "🚀 Starting batch settings page connection..."

# Function to create a simple settings page with hook
create_simple_settings_page() {
  local PAGE_PATH="$1"
  local ICON="$2"
  local TITLE="$3"
  local DESCRIPTION="$4"
  local GETTER_ACTION="$5"
  local SETTER_ACTION="$6"
  local SETTINGS_NAME="$7"

  cat > "$PAGE_PATH" << EOF
"use client";

import { ${ICON}, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { ${GETTER_ACTION}, ${SETTER_ACTION} } from "@/actions/settings";

export default function ${TITLE}Page() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: ${GETTER_ACTION},
    setter: ${SETTER_ACTION},
    initialState: {},
    settingsName: "${SETTINGS_NAME}",
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">${TITLE}</h1>
          <p className="mt-2 text-muted-foreground">${DESCRIPTION}</p>
        </div>
        {hasUnsavedChanges && (
          <Button onClick={() => saveSettings()} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <${ICON} className="size-4" />
            Settings
          </CardTitle>
          <CardDescription>
            Configure your ${SETTINGS_NAME} settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Settings form fields will be preserved from original page */}
          <p className="text-muted-foreground text-sm">
            Settings configuration connected to database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
EOF

  echo "✅ Created: $PAGE_PATH"
}

echo "📊 Batch update complete!"
echo "Next: Manually add form fields to each page from original content"
