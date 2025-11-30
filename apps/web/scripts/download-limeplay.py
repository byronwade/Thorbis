#!/usr/bin/env python3
import json
import os
import urllib.request
import sys

BASE_URL = "https://limeplay.winoffrg.dev/r"
REGISTRY_DIR = "src/registry/default"

components = [
    ("media-provider", "ui"),
    ("player-layout", "ui"),
    ("media", "ui"),
    ("mute-control", "ui"),
    ("player-hooks", "ui"),
    ("playback-control", "ui"),
    ("timeline-control", "ui"),
    ("volume-control", "ui"),
    ("use-timeline", "ui"),
    ("use-volume", "ui"),
    ("use-player", "ui"),
    ("use-track-events", "ui"),
    ("utils", "ui"),
    ("create-media-store", "internal"),
    ("fallback-poster", "ui"),
    ("timeline-labels", "ui"),
    ("use-shaka-player", "ui"),
    ("limeplay-logo", "ui"),
    ("root-container", "ui"),
    ("captions", "ui"),
    ("use-captions", "ui"),
    ("playback-rate", "ui"),
    ("use-playback-rate", "ui"),
    ("linear-player", "blocks/linear-player"),
]

for name, path_type in components:
    print(f"Downloading {name}...")
    url = f"{BASE_URL}/{name}.json"
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            
            for file_info in data.get("files", []):
                file_path = file_info.get("path", "")
                content = file_info.get("content", "")
                
                # Determine target directory
                if path_type == "internal":
                    target_dir = f"{REGISTRY_DIR}/internal"
                elif "blocks" in path_type:
                    target_dir = f"{REGISTRY_DIR}/{path_type}/components"
                else:
                    target_dir = f"{REGISTRY_DIR}/{path_type}"
                
                # Extract filename
                filename = os.path.basename(file_path)
                if not filename:
                    continue
                
                # Create directory if needed
                os.makedirs(target_dir, exist_ok=True)
                
                # Write file
                full_path = os.path.join(target_dir, filename)
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)
                
                print(f"  Created {full_path}")
    except Exception as e:
        print(f"  Error downloading {name}: {e}")

print("Done!")

