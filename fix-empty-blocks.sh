#!/bin/bash

# Fix empty catch blocks
find src -name "*.ts" -type f -exec sed -i '' 's/} catch (_\([a-zA-Z]*\)Error) {}/} catch (_\1Error) {\n\t\tconsole.error("Error:", _\1Error);\n\t}/g' {} \;
find src -name "*.ts" -type f -exec sed -i '' 's/} catch (_error) {}/} catch (_error) {\n\t\tconsole.error("Error:", _error);\n\t}/g' {} \;

# Fix empty if blocks
find src -name "*.ts" -type f -exec sed -i '' 's/if (\([^)]*\)) {\n\t}/if (\1) {\n\t\t\/\/ TODO: Add error handling\n\t}/g' {} \;

echo "Fixed empty blocks"
