
import os

file_path = r"c:\Users\Dell\Desktop\Kishan Sir\priya\Admin App\app\components\forms\DeepChildCategoryForm.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lines are 0-indexed in python list.
# 2203 in 1-indexed is 2202 in 0-indexed.
start_index = 2202

# Extract the block
new_lines = lines[start_index:]

# Uncomment
# Note: The view_file output showed // "use client";
# That means it has "// " at the start.
# I should remove the first 3 characters if they are "// "
# Be careful not to remove indentation if it exists, but usually top level is generic.
# However, inside the code, indentation exists.
# e.g. //     const context = ...
# removing "// " will leave "    const context = ..." which is correct.
# What if a line is just "//"?
# e.g. line 2201 was empty in the file content shown (it was just newlines)
# But in step 46, line 2199-2202 appeared empty.
# In the block I want (2203+), let's check indentation.
# 2203: // "use client";  -> "use client";
# 2205: // import ... -> import ...
# 2215: // const Deep... -> const Deep...
# 2216: //     const context ... ->     const context ...
# It seems " // " or "// " acts as the comment prefix.
# I will use a regex or simple string manipulation.
# If line.strip().startswith("//"):
#    replace first instance of "//" or "// "
# But wait, indentation.
# Logic:
# If line starts with "// " (slash slash space), remove it.
# If line starts with "//" (slash slash) but no space, remove it (might be empty line).
# But be careful of nested comments.
# e.g. // // some comment
# Removing one level is enough.

final_lines = []
for line in new_lines:
    if line.startswith("// "):
        final_lines.append(line[3:])
    elif line.startswith("//"):
        final_lines.append(line[2:])
    else:
        # If it's not commented, just keep it (though expected to be commented)
        final_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print("Successfully updated DeepChildCategoryForm.tsx")
