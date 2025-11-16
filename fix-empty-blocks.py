#!/usr/bin/env python3
"""
Fix empty blocks in TypeScript files by adding console.error statements
"""

import re
import sys
from pathlib import Path

def fix_empty_catch_blocks(content):
    """Fix empty catch blocks"""
    # Match: } catch (_error) {}
    pattern = r'}\s*catch\s*\(([^)]+)\)\s*\{\s*\}'
    replacement = r'} catch (\1) {\n\t\tconsole.error("Error:", \1);\n\t}'
    return re.sub(pattern, replacement, content)

def fix_empty_if_blocks(content):
    """Fix empty if blocks"""
    # Match: if (condition) {\n}
    pattern = r'if\s*\(([^)]+)\)\s*\{\s*\n\s*\}'
    replacement = r'if (\1) {\n\t\t// TODO: Handle error case\n\t}'
    return re.sub(pattern, replacement, content)

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_empty_catch_blocks(content)
        content = fix_empty_if_blocks(content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False

def main():
    src_path = Path("src")
    fixed_count = 0

    for ts_file in src_path.rglob("*.ts"):
        if fix_file(ts_file):
            fixed_count += 1

    for tsx_file in src_path.rglob("*.tsx"):
        if fix_file(tsx_file):
            fixed_count += 1

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == "__main__":
    main()
