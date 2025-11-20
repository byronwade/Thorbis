#!/usr/bin/env python3
"""
Fix async wrapper functions that just return withErrorHandling(async () => {})
"""

import re
from pathlib import Path

def fix_file(file_path):
    """Fix async wrappers in a single file."""
    with open(file_path, 'r') as f:
        lines = f.readlines()

    modified = False
    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for: export async function ...
        if 'export async function' in line:
            # Check next few lines for: return withErrorHandling(async ()
            found_wrapper = False
            for j in range(i+1, min(i+10, len(lines))):
                if 'return withErrorHandling(async ()' in lines[j] or 'return withErrorHandling(async() =>' in lines[j]:
                    found_wrapper = True
                    break
                # Stop if we hit another function or end of block
                if '}' in lines[j] and lines[j].strip() == '}':
                    break

            if found_wrapper:
                # Remove 'async' from export line
                lines[i] = line.replace('export async function', 'export function')
                modified = True

        i += 1

    if modified:
        with open(file_path, 'w') as f:
            f.writelines(lines)

    return modified

def main():
    src_actions = Path('/Users/byronwade/Stratos/src/actions')

    total_fixed = 0
    for file_path in src_actions.glob('*.ts'):
        if fix_file(file_path):
            total_fixed += 1
            print(f"Modified {file_path.name}")

    print(f"\nTotal: Modified {total_fixed} files")

if __name__ == '__main__':
    main()
