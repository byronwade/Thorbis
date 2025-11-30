#!/bin/bash

# Download all limeplay components
BASE_URL="https://limeplay.winoffrg.dev/r"
REGISTRY_DIR="src/registry/default"

# Components to download
declare -a COMPONENTS=(
  "media-provider:ui"
  "player-layout:ui"
  "media:ui"
  "mute-control:ui"
  "player-hooks:ui"
  "playback-control:ui"
  "timeline-control:ui"
  "volume-control:ui"
  "use-timeline:ui"
  "use-volume:ui"
  "use-player:ui"
  "use-track-events:ui"
  "utils:ui"
  "create-media-store:ui"
  "fallback-poster:ui"
  "timeline-labels:ui"
  "use-shaka-player:ui"
  "limeplay-logo:ui"
  "root-container:ui"
  "captions:ui"
  "use-captions:ui"
  "playback-rate:ui"
  "use-playback-rate:ui"
  "linear-player:blocks/linear-player"
)

for component in "${COMPONENTS[@]}"; do
  IFS=':' read -r name path <<< "$component"
  echo "Downloading $name..."
  
  if [[ "$path" == *"blocks"* ]]; then
    COMPONENT_DIR="$REGISTRY_DIR/blocks/linear-player/components"
  else
    COMPONENT_DIR="$REGISTRY_DIR/ui"
  fi
  
  mkdir -p "$COMPONENT_DIR"
  
  curl -s "$BASE_URL/$name.json" | jq -r '.files[] | "\(.path)|\(.content)"' | while IFS='|' read -r filepath content; do
    # Extract just the filename
    filename=$(basename "$filepath")
    # Determine if it's in components subdirectory
    if [[ "$filepath" == *"components"* ]]; then
      full_path="$COMPONENT_DIR/$filename"
    else
      full_path="$COMPONENT_DIR/$filename"
    fi
    
    echo "$content" > "$full_path"
    echo "  Created $full_path"
  done
done

echo "Done!"

