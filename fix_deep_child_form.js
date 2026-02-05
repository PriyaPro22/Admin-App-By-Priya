
const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\Dell\\Desktop\\Kishan Sir\\priya\\Admin App\\app\\components\\forms\\DeepChildCategoryForm.tsx";

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    // 2203 in 1-indexed is 2202 in 0-indexed
    const startIndex = 2202;

    // Check if file is long enough
    if (lines.length < startIndex) {
        console.error("File is too short!");
        process.exit(1);
    }

    const newLines = lines.slice(startIndex);

    const finalLines = newLines.map(line => {
        if (line.startsWith("// ")) {
            return line.substring(3);
        } else if (line.startsWith("//")) {
            return line.substring(2);
        }
        return line;
    });

    const newContent = finalLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully updated DeepChildCategoryForm.tsx");

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
