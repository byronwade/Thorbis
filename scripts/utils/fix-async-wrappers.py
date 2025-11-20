#!/usr/bin/env python3
"""
Fix async wrapper functions that just return withErrorHandling(async () => {})
These don't need the outer async keyword.
"""

import re
import sys
from pathlib import Path

def fix_async_wrappers(file_path):
    """Remove async from wrapper functions that return withErrorHandling."""
    with open(file_path, 'r') as f:
        content = f.read()

    # Pattern: export async function name(...): Promise<...> {
    #   return withErrorHandling(async () => {
    # Replace with: export function name(...): Promise<...> {
    pattern = r'(export) async (function [a-zA-Z_][a-zA-Z0-9_]*\([^)]*\): Promise<[^>]+>\s*\{\s*return withErrorHandling\(async \(\))'

    # Count matches before
    matches_before = len(re.findall(pattern, content))

    if matches_before == 0:
        return 0

    # Replace
    new_content = re.sub(pattern, r'\1 \2', content)

    # Write back
    with open(file_path, 'w') as f:
        f.write(new_content)

    return matches_before

def main():
    src_actions = Path('/Users/byronwade/Stratos/src/actions')

    total_fixed = 0
    files_modified = []

    for file_path in src_actions.glob('*.ts'):
        fixed = fix_async_wrappers(file_path)
        if fixed > 0:
            total_fixed += fixed
            files_modified.append((file_path.name, fixed))
            print(f"Fixed {fixed} functions in {file_path.name}")

    print(f"\nTotal: Fixed {total_fixed} async wrapper functions in {len(files_modified)} files")

    return 0

if __name__ == '__main__':
    sys.exit(main())
