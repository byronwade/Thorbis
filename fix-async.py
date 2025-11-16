#!/usr/bin/env python3
"""
Fix unnecessary async keywords in TypeScript files.
Only removes async from functions that:
1. Are exported
2. Only call withErrorHandling(async () => ...)
3. Have no await in the outer function body
"""

import re
import sys

def fix_unnecessary_async(content):
    """
    Fix unnecessary async keywords in export functions.
    Pattern: export async function name(...): Promise<...> { return withErrorHandling(async () => {
    Replace with: export function name(...): Promise<...> { return withErrorHandling(async () => {
    """

    # Pattern for export async function that only wraps withErrorHandling
    # This regex captures the function signature
    pattern = r'^(\s*export\s+)async(\s+function\s+\w+\s*\([^)]*\)\s*:\s*Promise<[^>]+>)\s*\{\s*return\s+withErrorHandling\(async\s+\(\)\s+=>\s+\{'

    lines = content.split('\n')
    modified = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if line matches our pattern
        match = re.match(pattern, line)
        if match:
            # Remove async keyword
            lines[i] = f"{match.group(1)}{match.group(2)} {{ return withErrorHandling(async () => {{"
            modified = True
            print(f"Fixed line {i+1}: {lines[i][:80]}...")

        i += 1

    return '\n'.join(lines), modified

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix-async.py <file>")
        sys.exit(1)

    filepath = sys.argv[1]

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        fixed_content, modified = fix_unnecessary_async(content)

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f"✅ Fixed {filepath}")
            sys.exit(0)
        else:
            print(f"ℹ️  No changes needed in {filepath}")
            sys.exit(0)

    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
