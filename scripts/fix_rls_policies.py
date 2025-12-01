#!/usr/bin/env python3
"""
Fix RLS policies in setup_database_from_scratch.sql by wrapping auth functions
in SELECT subqueries to optimize performance.

Replaces:
- auth.uid() → (select auth.uid())
- auth.role() → (select auth.role())
- auth.jwt() → (select auth.jwt())

This prevents re-evaluation of auth functions for each row, improving query performance.
"""

import re
import sys
from pathlib import Path

def fix_auth_functions(content: str) -> str:
    """
    Replace auth function calls with wrapped versions in RLS policies.
    
    Pattern: auth.uid() → (select auth.uid())
    Only replaces if not already wrapped in (select ...)
    """
    # First, protect already-wrapped calls by replacing them with placeholders
    wrapped_pattern = r'\(select\s+auth\.(uid|role|jwt)\(\)\)'
    replacements = {}
    
    def protect_wrapped(match):
        func_name = match.group(1)
        placeholder = f'__PROTECTED_{func_name.upper()}__'
        replacements[placeholder] = match.group(0)
        return placeholder
    
    # Protect already-wrapped calls
    content = re.sub(wrapped_pattern, protect_wrapped, content, flags=re.IGNORECASE)
    
    # Now replace all unwrapped auth function calls
    patterns = [
        (r'\bauth\.uid\(\)', r'(select auth.uid())'),
        (r'\bauth\.role\(\)', r'(select auth.role())'),
        (r'\bauth\.jwt\(\)', r'(select auth.jwt())'),
    ]
    
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    # Restore protected wrapped calls
    for placeholder, original in replacements.items():
        content = content.replace(placeholder, original)
    
    return content

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    setup_file = project_root / 'supabase' / 'setup_database_from_scratch.sql'
    
    if not setup_file.exists():
        print(f"Error: {setup_file} not found")
        sys.exit(1)
    
    print(f"Reading {setup_file}...")
    with open(setup_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    content = fix_auth_functions(content)
    
    # Count changes
    original_unwrapped = len(re.findall(r'\bauth\.(uid|role|jwt)\(\)', original_content, re.IGNORECASE))
    new_unwrapped = len(re.findall(r'\bauth\.(uid|role|jwt)\(\)', content, re.IGNORECASE))
    wrapped_count = original_unwrapped - new_unwrapped
    
    if wrapped_count == 0:
        print("No changes needed - all auth functions are already wrapped.")
        return
    
    print(f"Found {original_unwrapped} unwrapped auth function calls")
    print(f"Wrapped {wrapped_count} auth function calls")
    
    # Write back
    print(f"Writing updated file...")
    with open(setup_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Successfully updated {setup_file}")
    print(f"  {wrapped_count} auth function calls now wrapped for performance")

if __name__ == '__main__':
    main()